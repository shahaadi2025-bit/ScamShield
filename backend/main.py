"""
ScamShield FastAPI Server
Exposes /api/analyze and /api/rag-search endpoints
Powered by ChromaDB Vector Search and Google Gemini API.
"""

import os
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.rag_engine import rag_engine
except ImportError:
    from rag_engine import rag_engine

# Initialize FastAPI application
app = FastAPI(
    title="ScamShield RAG Cyber Defense API",
    description="Real-Time Fraud Message Detector with ChromaDB Vector Grounding and Gemini LLM Augmentation",
    version="2.0.0"
)

# Enable Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class AnalyzeRequest(BaseModel):
    text: str
    include_raw_vectors: Optional[bool] = True

class RagSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3


def perform_gemini_analysis(text: str, retrieved_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Attempts to call Gemini API if GEMINI_API_KEY is available;
    otherwise computes zero-hallucination grounded heuristic verdict.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "")
    
    if api_key and api_key != "MY_GEMINI_API_KEY":
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            rag_prompt = rag_engine.build_rag_prompt(text, retrieved_docs)
            response = model.generate_content(
                rag_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            parsed = json.loads(response.text)
            return parsed
        except Exception as e:
            print(f"[Gemini API Warning] {e}. Falling back to grounded deterministic RAG scoring.")

    # High-precision deterministic fallback using RAG vectors
    top_match = retrieved_docs[0] if retrieved_docs else None
    top_sim = top_match["similarity"] if top_match else 0.0

    if top_match and top_sim >= 0.70:
        score = min(100, int(75 + (top_sim * 24)))
        level = "Critical Danger"
        explanation = f"GROUNDED WARNING: This message matches verified fraud patterns described in {top_match['source']} ({top_match['citation']}). {top_match['content']}"
        tactics = [top_match["category"], "Coercive Impersonation", "Urgency Trigger"]
        actions = [
            f"Advisory {top_match['citation']}: Do NOT click any link, download files, or transfer money.",
            "Disconnect and block the sender immediately.",
            "Dial 1930 National Cyber Helpline to report this communication."
        ]
    elif top_match and top_sim >= 0.45:
        score = 55
        level = "Suspicious"
        explanation = f"CAUTION: Potential fraud signals detected matching {top_match['source']} guidance ({top_match['citation']}). Proceed with extreme care."
        tactics = [top_match["category"], "Unverified Sender"]
        actions = [
            "Verify claims directly with the official authority portal or branch.",
            "Do not dial phone numbers provided in the message.",
            "Consult family members before making payments."
        ]
    else:
        score = 8
        level = "Safe"
        explanation = "LOOKS SAFE: No malicious threat indicators or coercive cyber patterns found in official I4C/NPCI databases."
        tactics = ["Normal Notification"]
        actions = ["Never share your bank OTP or MPIN with anyone."]

    return {
        "riskScore": score,
        "riskLevel": level,
        "detectedTactics": tactics,
        "simpleExplanation": explanation,
        "actionSteps": actions,
        "groundedCitation": top_match["citation"] if top_match else "Official I4C Cyber Advisory"
    }


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ScamShield RAG Engine",
        "vector_count": len(rag_engine.documents),
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "vector_store": "ChromaDB/In-Memory Vector Collection",
        "documents_indexed": len(rag_engine.documents)
    }


@app.post("/api/rag-search")
def rag_search_endpoint(payload: RagSearchRequest):
    """
    Direct semantic retrieval endpoint for vector search against the I4C/NPCI knowledge base.
    """
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    results = rag_engine.search_threat_vectors(payload.query, top_k=payload.top_k)
    return {
        "query": payload.query,
        "count": len(results),
        "retrievedVectors": results
    }


@app.post("/api/analyze")
def analyze_endpoint(payload: AnalyzeRequest):
    """
    Full RAG pipeline: Query -> Vector Embedding Search -> Augmented Gemini Grounding -> Output.
    """
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Step 1: Vector Search in ChromaDB
    retrieved_vectors = rag_engine.search_threat_vectors(payload.text, top_k=3)

    # Step 2: Augmented Generation / Grounded Evaluation
    analysis_output = perform_gemini_analysis(payload.text, retrieved_vectors)

    # Step 3: Attach vector citations
    analysis_output["retrievedVectors"] = retrieved_vectors
    analysis_output["factCheckedGrounding"] = retrieved_vectors[0] if retrieved_vectors else None

    return analysis_output


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
