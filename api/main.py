from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.rag_pipeline import MedicineRAG

app = FastAPI(title="Swasthya AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str
    city: str = "Bangalore"

print("🚀 Loading RAG...")
rag = MedicineRAG()
print("✅ Ready!")

@app.post("/ask")
async def ask(request: AskRequest):
    try:
        print(f"📩 Question: {request.question}")
        result = rag.query(request.question, request.city)
        return {
            "answer": result.get("ai_response", ""),
            "medicine_info": result.get("medicine_info", {}),
            "alternatives": result.get("alternatives", []),
            "savings": result.get("savings", {}),
            "pharmacies": result.get("pharmacies", []),
            "switch_recommendation": result.get("switch_recommendation", {}),
            "overpricing_score": result.get("overpricing_score", {}),
            "salt_info": result.get("salt_info", {})
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {
            "answer": f"Error: {str(e)}",
            "medicine_info": {},
            "alternatives": [],
            "savings": {},
            "pharmacies": {},
            "switch_recommendation": {},
            "overpricing_score": {},
            "salt_info": {}
        }

@app.get("/")
def home():
    return {"status": "Swasthya AI Running ✅"}