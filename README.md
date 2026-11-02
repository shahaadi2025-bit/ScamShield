# ScamShield: Real-Time Fraud Message Detector (RAG-Enabled)
**RunUp Coders Hackathon 2026**

ScamShield is an AI-powered, **Retrieval-Augmented Generation (RAG)** cyber threat defense platform engineered to protect Indian citizens, senior citizens, and families from modern cyber scams—including **"Digital Arrest" judicial extortion, fake UPI/KYC bank freezes, utility disconnection panic, Telegram prepaid task traps, and malicious APK distribution**.

---

## 🧠 RAG Pipeline Architecture

ScamShield implements a hybrid RAG pipeline combining vector similarity search against official government cybercrime manuals with contextual generative model reasoning:

```
[ User Input (Text / OCR Screenshot) ]
                  │
                  ▼
   [ SentenceTransformers (all-MiniLM-L6-v2) ]
                  │
                  ▼ (Query Embedding Vector)
        [ ChromaDB Vector Store ]
  (Indexed with Official I4C, NPCI & CERT-In Advisories)
                  │
                  ▼ (Top-3 Semantic Nearest Neighbors)
    [ RAG Prompt Augmentation Engine ]
                  │
                  ▼ (Context-Grounded Zero-Hallucination Prompt)
           [ Google Gemini LLM ]
                  │
                  ▼
  [ Fact-Checked Threat Verdict + Verified Citations ]
```

### 1. Vector Knowledge Store (`/backend/rag_store` & `knowledge_base.json`)
The knowledge store is populated with verified advisories:
- **Indian Cybercrime Coordination Centre (I4C)**: Advisories on Digital Arrest scams, fake Skype/VoIP police interrogation, and bogus judicial orders.
- **National Payments Corporation of India (NPCI)**: Guidelines on UPI fraud prevention, MPIN misconceptions, and fake collect requests.
- **CERT-In & Department of Telecommunications (DoT)**: Phishing link signatures, malicious `.apk` malware indicators, and Chakshu reporting.
- **Ministry of Power**: Standard Operating Procedures on official utility headers vs. fraudulent 10-digit mobile disconnection SMS.

### 2. Retrieval & Semantic Grounding Workflow
1. Incoming message text is embedded into dense semantic vector space.
2. ChromaDB retrieves the top-3 most relevant threat vectors with cosine similarity scores.
3. The retrieved advisory citations, directive numbers, and official government quotes are injected into the Gemini prompt template.
4. Generates an augmented, zero-hallucination verdict displaying a verified **"Fact-Checked Grounding"** badge.

---

## 🚀 Key Features

1. **RAG-Powered Scam Score Meter**:
   - Risk score (0–100%) with Green, Amber, and Red threat gauges.
   - Deceptive tactic tags: *Digital Arrest Threat*, *Fake Authority Impersonation*, *Malicious APK*, *Urgency Trigger*, *Unverified UPI*.
   - **Fact-Checked Grounding**: Cites the official government advisory number and source authority (e.g. `I4C/MHA Advisory No. 2024/09/DA`, `NPCI Circular 118/2024`).
   - Top-3 retrieved threat vectors drawer allowing users to inspect matched manual clauses.

2. **Interactive SpiralFunnel Vortex Component**:
   - Powered by `<SpiralFunnel />`, providing dynamic 3D-projected vortex strands of light that respond fluidly to cursor height and pointer tracking.

3. **Multi-Input Interface**:
   - **Voice Dictation (Web Speech API)**: Dictate suspicious SMS/WhatsApp threats hands-free.
   - **Text Paste**: 1-click test scenarios for Digital Arrest, UPI Freeze, Electricity Cutoff, and Job Scams.
   - **Screenshot OCR**: Client-side optical character recognition using `Tesseract.js`.

4. **Background Browser Notifications**:
   - Fires high-priority OS-level system notifications on **Critical Danger** verdicts, even when the user minimizes the tab or works in another window.

5. **Official PDF Evidence Summary Exporter (`jsPDF`)**:
   - Downloads a formal **Cyber Incident Forensic Evidence Report** with report ID, timestamps, message transcript, detected tactics, and emergency contacts for filing police FIRs or bank disputes.

6. **"Family Guard" Accessibility Mode**:
   - High-contrast mode, extra large typography, and Web Speech API audio readout (`speechSynthesis`) for elderly relatives.

7. **Indian Emergency Response Hub**:
   - Direct click-to-call link for **Helpline `1930`** (I4C).
   - Direct link to **`cybercrime.gov.in`**.
   - "Golden Hour" rule guide (reporting within 2 hours to freeze recipient bank accounts).
   - "Share Warning with Family" via the Web Share API.

---

## 📁 Repository Structure

```
├── backend/
│   ├── main.py               # FastAPI server (/api/analyze & /api/rag-search)
│   ├── rag_engine.py         # ChromaDB setup, vector search, prompt augmentation
│   ├── knowledge_base.json   # Official I4C, NPCI, and DoT cybercrime advisories
│   └── requirements.txt      # Python dependencies (FastAPI, ChromaDB, etc.)
├── frontend/
│   └── src/
│       └── App.jsx           # App entry point
├── src/
│   ├── components/
│   │   ├── SpiralFunnel.jsx  # Interactive vortex component (<SpiralFunnel />)
│   │   ├── Header.jsx        # Navigation, 1930 link, notification toggle, Family Guard
│   │   ├── InputPanel.jsx    # Voice dictation, text paste, Tesseract OCR dropzone
│   │   ├── RiskMeter.jsx     # Gauge dial with Fact-Checked Grounding badge
│   │   ├── ResultsView.jsx   # Results dashboard, vector evidence drawer, PDF export
│   │   ├── RecentScans.jsx   # Persistent scan history with search & re-examine
│   │   └── EmergencyHub.jsx  # 1930 helpline & Golden Hour protocol
│   ├── services/
│   │   ├── ragEngine.js      # Client-side RAG vector knowledge search
│   │   ├── analyzer.js       # Heuristic & RAG analysis engine
│   │   ├── storage.js        # LocalStorage persistence service
│   │   ├── notifications.js  # Background HTML5 notification service
│   │   └── pdfExporter.js    # jsPDF forensic evidence generator
│   └── App.jsx               # Main React application shell
├── package.json
└── README.md
```

---

## 🏃 Getting Started

### 1. Frontend Web App (Port 3000)
```bash
# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend FastAPI Server (Port 8000)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Launch FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)
