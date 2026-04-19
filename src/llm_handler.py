# src/llm_handler.py
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class LLMHandler:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("❌ GROQ_API_KEY not found!")

        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"
        print("✅ Groq LLM initialized")

    def generate_medicine_response(
        self, query, medicine_info, alternatives,
        savings, pharmacies, switch_recommendation,
        overpricing_score, salt_info
    ):
        """Generate structured guided response"""

        # Build alternatives text
        alt_text = ""
        for i, alt in enumerate(alternatives[:3], 1):
            alt_text += f"{i}. {alt['brand_name']} by {alt['manufacturer']} - ₹{alt['avg_price_inr']}\n"

        # Build pharmacy text
        pharmacy_text = ""
        for p in pharmacies[:2]:
            pharmacy_text += f"- {p['name']}, {p['address']}\n"

        # Safety decision
        switch_action = switch_recommendation.get('action', 'CONSULT DOCTOR')
        switch_emoji = switch_recommendation.get('emoji', '⚠️')
        switch_warning = switch_recommendation.get('warning_message', '')

        # Overpricing
        if overpricing_score:
            price_label = overpricing_score.get('score_label', '')
            overpricing_pct = overpricing_score.get('overpricing_percentage', 0)
        else:
            price_label = 'Fair Price'
            overpricing_pct = 0

        # Salt use info
        salt_use = salt_info.get('common_use', '') if salt_info else ''

        system_prompt = """You are Swasthya AI, India's most trusted medicine transparency assistant.

Your job is to:
1. Explain what the medicine does in simple words
2. Tell if the prescription is cost-optimal or overpriced  
3. Suggest safe alternatives (ONLY if safe to switch)
4. Give ONE clear recommendation

Rules:
- NEVER replace a doctor's advice
- For critical/high risk medicines: ALWAYS say do not switch
- Be warm, clear and concise
- Use simple English that any Indian patient understands
- Maximum 4 paragraphs"""

        user_prompt = f"""Patient Query: "{query}"

Medicine Prescribed: {medicine_info['brand_name']}
Salt: {medicine_info['salt_composition']}
What it does: {salt_use}
Current Price: ₹{medicine_info['avg_price_inr']}
Manufacturer: {medicine_info['manufacturer']}

Pricing Analysis: {price_label} (overpriced by {overpricing_pct}%)

Switch Safety Decision: {switch_emoji} {switch_action}
Safety Warning: {switch_warning}

Cheaper Alternatives (Same Salt + Same Strength):
{alt_text if alt_text else "No alternatives found in database"}

Available at Nearby Pharmacies:
{pharmacy_text if pharmacy_text else "Check local pharmacies"}

Generate a warm, helpful, structured response."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=400
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"