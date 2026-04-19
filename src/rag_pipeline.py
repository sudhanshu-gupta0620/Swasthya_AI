# src/rag_pipeline.py
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_processor import DataProcessor
from embeddings import MedicineEmbeddings
from llm_handler import LLMHandler

class MedicineRAG:
    def __init__(self):
        print("Initializing Medicine RAG Pipeline...")

        self.dp = DataProcessor()
        self.dp.load_all_data()

        self.embedder = MedicineEmbeddings()
        if not self.embedder.load_index():
            docs = self.dp.create_knowledge_base()
            self.embedder.create_embeddings(docs)
            self.embedder.save_index()

        self.llm = LLMHandler()
        print("✅ RAG Pipeline Ready!\n")

    def query(self, user_question, city="Bangalore"):
        print(f"🔍 Processing: '{user_question}'")

        # Step 1: Search
        results = self.embedder.search(user_question, top_k=1)

        if not results:
            return self._empty_response(user_question)

        best_match = results[0]

        if best_match['relevance_score'] < 0.3:
            return self._empty_response(user_question)

        medicine_name = best_match['document']['metadata']['brand_name']
        print(f"✅ Found: {medicine_name}")

        # Step 2: Get all data
        medicine_info = self.dp.get_medicine_info(medicine_name)
        alternatives = self.dp.get_alternatives(medicine_name)
        savings = self.dp.calculate_savings(medicine_name)
        pharmacies = self.dp.get_available_pharmacies(medicine_name, city)

        # Step 3: NEW - Get safety and overpricing
        switch_recommendation = self.dp.get_switch_recommendation(medicine_name)
        overpricing_score = self.dp.get_overpricing_score(medicine_name)
        salt_info = self.dp.get_salt_info(medicine_info['salt_composition'])

        # Step 4: Add alt pharmacies
        if alternatives:
            alt_pharmacies = self.dp.get_available_pharmacies(
                alternatives[0]['brand_name'], city
            )
            pharmacies.extend(alt_pharmacies)

        # Remove duplicates
        seen_ids = set()
        unique_pharmacies = []
        for p in pharmacies:
            if p['pharmacy_id'] not in seen_ids:
                unique_pharmacies.append(p)
                seen_ids.add(p['pharmacy_id'])

        # Step 5: Generate AI response with all new data
        ai_response = self.llm.generate_medicine_response(
            user_question,
            medicine_info,
            alternatives,
            savings if savings else {},
            unique_pharmacies[:3],
            switch_recommendation,
            overpricing_score,
            salt_info if salt_info else {}
        )

        return {
            'query': user_question,
            'medicine_found': medicine_name,
            'medicine_info': medicine_info,
            'alternatives': alternatives[:5],
            'savings': savings if savings else {},
            'pharmacies': unique_pharmacies[:3],
            'switch_recommendation': switch_recommendation,
            'overpricing_score': overpricing_score,
            'salt_info': salt_info,
            'ai_response': ai_response,
            'relevance_score': best_match['relevance_score']
        }

    def _empty_response(self, question):
        return {
            'query': question,
            'medicine_found': None,
            'medicine_info': {},
            'alternatives': [],
            'savings': {},
            'pharmacies': [],
            'switch_recommendation': {
                'can_switch': False,
                'action': 'MEDICINE NOT FOUND',
                'emoji': '❓',
                'warning_message': 'Please check medicine name and try again'
            },
            'overpricing_score': None,
            'salt_info': {},
            'ai_response': "Sorry, I couldn't find this medicine. Please check the name and try again.",
            'relevance_score': 0
        }


if __name__ == "__main__":
    rag = MedicineRAG()

    tests = [
        "Is DOLO 650 overpriced?",
        "Can I switch from Lipitor 10?",
        "Is it safe to change my Thyronorm 50?",
        "Cheap alternative to Zyrtec"
    ]

    for q in tests:
        print("\n" + "="*60)
        result = rag.query(q)
        print(f"\n🤖 {result['ai_response']}")
        if result.get('switch_recommendation'):
            rec = result['switch_recommendation']
            print(f"\n{rec['emoji']} Decision: {rec['action']}")
        if result.get('overpricing_score'):
            score = result['overpricing_score']
            print(f"💰 Price: {score['score_label']}")
            print(f"📅 Yearly savings: ₹{score['yearly_savings']}")
        input("\nPress Enter...")