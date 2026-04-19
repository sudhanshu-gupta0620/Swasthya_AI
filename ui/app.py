import streamlit as st
import requests

st.set_page_config(
    page_title="Swasthya AI 💊",
    page_icon="💊",
    layout="wide"
)

st.markdown("""
<style>
    .safe-box {
        background-color: #1a472a;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #00ff88;
        margin: 0.5rem 0;
    }
    .danger-box {
        background-color: #4a1515;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ff4444;
        margin: 0.5rem 0;
    }
    .warning-box {
        background-color: #4a3800;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ffaa00;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.title("💊 Swasthya AI")
st.subheader("Prescription Transparency & Medicine Cost Analyzer")
st.caption("Empowering patients with information — not replacing doctors")
st.markdown("---")

# Input
col1, col2 = st.columns([3, 1])
with col1:
    query = st.text_input(
        "🔍 Enter medicine name or ask a question:",
        placeholder="e.g. DOLO 650, Is Lipitor overpriced?, Can I switch Thyronorm?"
    )
with col2:
    city = st.selectbox(
        "📍 Your City",
        ["Bangalore", "Mumbai", "Delhi", "Chennai", "Kolkata", "Ahmedabad"]
    )

search = st.button("🔍 Analyze Prescription", type="primary", use_container_width=True)

if search and query:
    with st.spinner("🤖 Analyzing your prescription..."):
        try:
            res = requests.post(
                "http://127.0.0.1:8000/ask",
                json={"question": query, "city": city},
                headers={"Content-Type": "application/json"}
            )
            data = res.json()
        except Exception as e:
            st.error(f"❌ Connection error: {str(e)}")
            st.stop()

    if res.status_code == 200:

        # AI Response
        st.markdown("---")
        st.markdown("### 🤖 Swasthya AI Analysis")
        st.info(data.get('answer', 'No response'))

        # Switch Recommendation (BIG AND CLEAR)
        if data.get('switch_recommendation'):
            rec = data['switch_recommendation']
            st.markdown("### 🎯 Should You Switch?")

            risk = rec.get('risk_level', 'Unknown')
            action = rec.get('action', '')
            emoji = rec.get('emoji', '⚠️')

            if risk == 'Low':
                st.success(f"{emoji} {action}")
            elif risk == 'Medium':
                st.warning(f"{emoji} {action}")
            else:
                st.error(f"{emoji} {action}")

            st.caption(f"💬 {rec.get('warning_message', '')}")
            st.caption(f"📋 {rec.get('recommendation', '')}")

        # Overpricing Score
        if data.get('overpricing_score'):
            score = data['overpricing_score']
            st.markdown("---")
            st.markdown("### 💰 Prescription Fairness Score")

            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Prescribed Price", f"₹{score['original_price']}")
            col2.metric("Cheapest Available", f"₹{score['cheapest_price']}")
            col3.metric(
                "Overpriced By",
                f"{score['overpricing_percentage']}%"
            )
            col4.metric("Score", score['score_label'])

            col1, col2 = st.columns(2)
            col1.metric(
                "💊 Monthly Savings (if switched)",
                f"₹{score['monthly_savings']}"
            )
            col2.metric(
                "📅 Yearly Savings (if switched)",
                f"₹{score['yearly_savings']}"
            )

        # Medicine Info
        if data.get('medicine_info') and data['medicine_info']:
            st.markdown("---")
            st.markdown("### 💊 What Is This Medicine?")
            med = data['medicine_info']

            col1, col2, col3 = st.columns(3)
            col1.metric("Salt/Generic Name", med.get('salt_composition', 'N/A'))
            col2.metric("Strength", med.get('strength', 'N/A'))
            col3.metric("Prescription", med.get('prescription_required', 'N/A'))

            if data.get('salt_info') and data['salt_info']:
                salt = data['salt_info']
                if salt.get('common_use'):
                    st.write(f"**Used for:** {salt.get('common_use')}")
                if salt.get('side_effects'):
                    st.write(f"**Side effects:** {salt.get('side_effects')}")
                if salt.get('take_with_food'):
                    st.write(f"**Take with food:** {salt.get('take_with_food')}")

        # Alternatives
        if data.get('alternatives') and len(data['alternatives']) > 0:
            st.markdown("---")
            st.markdown("### 🔄 Cheaper Alternatives (Same Salt + Same Strength)")

            for i, alt in enumerate(data['alternatives'], 1):
                col1, col2, col3, col4 = st.columns([3, 2, 2, 2])
                with col1:
                    st.write(f"**{i}. {alt['brand_name']}**")
                with col2:
                    st.write(f"by {alt['manufacturer']}")
                with col3:
                    st.write(f"₹{alt['avg_price_inr']}")
                with col4:
                    if data.get('medicine_info'):
                        orig = data['medicine_info'].get('avg_price_inr', 0)
                        if orig > 0:
                            save_pct = round(((orig - alt['avg_price_inr']) / orig) * 100, 1)
                            if save_pct > 0:
                                st.write(f"💚 Save {save_pct}%")
        else:
            if data.get('switch_recommendation', {}).get('risk_level') not in ['Critical', 'High']:
                st.info("No alternatives found in current database")

        # Pharmacies
        if data.get('pharmacies') and len(data['pharmacies']) > 0:
            st.markdown("---")
            st.markdown("### 🏥 Available Nearby")
            for p in data['pharmacies']:
                with st.expander(f"🏪 {p['name']} — {p.get('open_hours', 'N/A')}"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"📍 {p.get('address', 'N/A')}")
                        st.write(f"🏙️ {p.get('city', 'N/A')}")
                    with col2:
                        st.write(f"📞 {p.get('phone', 'N/A')}")
                        delivery = "✅ Yes" if p.get('home_delivery') == 'Yes' else "❌ No"
                        st.write(f"🚚 Home Delivery: {delivery}")

st.markdown("---")
col1, col2 = st.columns(2)
with col1:
    st.caption("⚠️ Always consult your doctor before switching medicines")
with col2:
    st.caption("Built with ❤️ using RAG + Groq LLaMA 3.1 | Swasthya AI")