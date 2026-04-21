# 🩺 Swasthya-AI

MediFind AI is an intelligent medicine search platform that combines **AI-powered recommendations** with **real-time pharmacy price comparison**.

It uses a **RAG (Retrieval-Augmented Generation) pipeline**, **vector database (FAISS)**, and **Groq LLM** to understand user queries and suggest medicines along with alternatives and savings.

---

# 🚀 Features

* 🔍 Smart medicine search (AI-powered)
* 💊 Suggests alternatives (not only cheapest)
* 📍 Location-based pharmacy results
* 🧠 RAG pipeline using vector database (FAISS)
* ⚡ Fast LLM responses using Groq
* 🌐 Dual frontend support:

  * React (modern UI)
  * Streamlit (AI-only UI)

---

# 📁 Project Structure

```
MEDICINE-AI/
│
├── api/                  # FastAPI backend (AI)
│   └── main.py
│
├── data/                 # Dataset + vector DB
│   ├── medicines.csv
│   ├── pharmacies.csv
│   ├── pharmacy_inventory.csv
│   ├── alternatives.csv
│   ├── faiss_index.bin
│   └── documents.pkl
│
├── src/                  # AI logic (RAG pipeline)
│   ├── rag_pipeline.py
│   ├── llm_handler.py
│   ├── embeddings.py
│   └── data_processor.py
│
├── swasthya-ai/          # React frontend (main UI)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── ui/                   # Streamlit frontend (optional)
│   └── app.py
│
├── requirements.txt      # Python dependencies
└── .env                  # API keys (NOT included in repo)
```

---

# ⚙️ Tech Stack

* **Frontend**: React + Vite
* **Backend**: FastAPI (Python)
* **AI/ML**:

  * RAG Pipeline
  * FAISS (Vector Database)
  * Groq LLM (LLaMA 3)
* **Data**: CSV-based pharmacy + medicine dataset

---

# 🔑 Setup Instructions

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sudhanshu-gupta0620/Swasthya_AI.git
cd MEDICINE-AI
```

---

## 2️⃣ Setup Backend (AI)

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔐 Setup API Key (IMPORTANT)

Create a `.env` file in the root/backend folder and add:

```env
GROQ_API_KEY=your_api_key_here
```

👉 You can get your free API key from:
https://console.groq.com/

⚠️ **Important:**

* Do NOT share your API key
* Do NOT upload `.env` to GitHub

---

## ▶ Run Backend

```bash
uvicorn api.main:app --reload --port 8000
```

---

## 3️⃣ Run Frontend (React - Recommended)

```bash
cd swasthya-ai
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 4️⃣ Optional: Run Streamlit UI

If you want to use AI-only interface:

```bash
streamlit run ui/app.py
```

---

# 🔄 How It Works

```
User Input
    ↓
React UI / Streamlit
    ↓
FastAPI (/ask)
    ↓
RAG Pipeline (FAISS + embeddings)
    ↓
Groq LLM generates response
    ↓
Returns:
- Medicine info
- Alternatives
- Savings
- Nearby pharmacies
```

---

# 🧠 Notes

* You can use **either frontend**:

  * React (recommended for full app)
  * Streamlit (quick testing)

* If Streamlit dependencies are missing, just use React frontend.

---

# 🎯 Commands Summary

### Run Backend:

```bash
uvicorn api.main:app --reload --port 8000
```

### Run React App:

```bash
cd swasthya-ai
npm install
npm run dev
```

### Run Streamlit:

```bash
streamlit run ui/app.py
```

---

# 💡 Future Improvements

* 🛒 Cart & ordering system
* 📱 Mobile app (React Native)
* 🗣 Voice-based search
* 📊 Price prediction & trends

---

# 👨‍💻 Contributors

* Frontend + Integration: You
* AI/ML + RAG Pipeline: Your Friend

---

# ⭐ Final Note

This project demonstrates how **AI + real-world data** can be combined to build a **practical healthcare solution**.

> “Not just search — intelligent medicine discovery.” 💚
