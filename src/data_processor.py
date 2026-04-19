# src/data_processor.py
import pandas as pd
import os

class DataProcessor:
    def __init__(self):
        self.data_path = "data/"
        self.medicines = None
        self.alternatives = None
        self.pharmacies = None
        self.inventory = None
        self.safety_rules = None
        self.salt_info = None

    def load_all_data(self):
        print("Loading data...")
        self.medicines = pd.read_csv(os.path.join(self.data_path, 'medicines.csv'))
        self.alternatives = pd.read_csv(os.path.join(self.data_path, 'alternatives.csv'))
        self.pharmacies = pd.read_csv(os.path.join(self.data_path, 'pharmacies.csv'))
        self.inventory = pd.read_csv(os.path.join(self.data_path, 'pharmacy_inventory.csv'))
        self.safety_rules = pd.read_csv(os.path.join(self.data_path, 'safety_rules.csv'))
        self.salt_info = pd.read_csv(os.path.join(self.data_path, 'salt_info.csv'))

        print(f"✅ Loaded {len(self.medicines)} medicines")
        print(f"✅ Loaded {len(self.pharmacies)} pharmacies")
        print(f"✅ Loaded {len(self.safety_rules)} safety rules")
        print(f"✅ Loaded {len(self.salt_info)} salt mappings")
        return self

    def get_medicine_info(self, brand_name):
        result = self.medicines[
            self.medicines['brand_name'].str.lower() == brand_name.lower()
        ]
        if not result.empty:
            return result.iloc[0].to_dict()
        return None

    def get_salt_info(self, salt_composition):
        """Get detailed info about the salt"""
        result = self.salt_info[
            self.salt_info['salt_composition'].str.lower() == salt_composition.lower()
        ]
        if not result.empty:
            return result.iloc[0].to_dict()
        return None

    def get_safety_info(self, category):
        """Get safety rules for a medicine category"""
        result = self.safety_rules[
            self.safety_rules['category'].str.lower() == category.lower()
        ]
        if not result.empty:
            return result.iloc[0].to_dict()
        return None

    def get_alternatives(self, brand_name):
        """Get alternatives with SAME salt AND strength"""
        medicine = self.get_medicine_info(brand_name)
        if not medicine:
            return []

        salt = medicine['salt_composition']
        strength = medicine['strength']

        alts = self.medicines[
            (self.medicines['salt_composition'] == salt) &
            (self.medicines['strength'] == strength) &
            (self.medicines['brand_name'].str.lower() != brand_name.lower())
        ].copy()

        alts = alts.sort_values('avg_price_inr')
        return alts.to_dict('records')

    def get_overpricing_score(self, brand_name):
        """
        Calculate how overpriced a medicine is
        compared to cheapest alternative
        """
        medicine = self.get_medicine_info(brand_name)
        if not medicine:
            return None

        alternatives = self.get_alternatives(brand_name)
        if not alternatives:
            return None

        original_price = medicine['avg_price_inr']
        cheapest_price = alternatives[0]['avg_price_inr']

        if cheapest_price == 0:
            return None

        overpricing_ratio = ((original_price - cheapest_price) / cheapest_price) * 100

        # Score from 0-100
        if overpricing_ratio <= 10:
            score = "Fair Price 🟢"
            emoji = "🟢"
        elif overpricing_ratio <= 50:
            score = "Slightly Overpriced 🟡"
            emoji = "🟡"
        elif overpricing_ratio <= 100:
            score = "Overpriced 🟠"
            emoji = "🟠"
        else:
            score = "Highly Overpriced 🔴"
            emoji = "🔴"

        return {
            'original_price': original_price,
            'cheapest_price': cheapest_price,
            'overpricing_percentage': round(overpricing_ratio, 1),
            'score_label': score,
            'emoji': emoji,
            'monthly_savings': round((original_price - cheapest_price) * 30, 2),
            'yearly_savings': round((original_price - cheapest_price) * 365, 2)
        }

    def get_switch_recommendation(self, brand_name):
        """
        Core USP: Should patient switch or not?
        Returns clear guided recommendation
        """
        medicine = self.get_medicine_info(brand_name)
        if not medicine:
            return None

        category = medicine['category']
        safety = self.get_safety_info(category)

        if not safety:
            return {
                'can_switch': False,
                'risk_level': 'Unknown',
                'recommendation': '⚠️ Consult your doctor before switching',
                'warning': 'We dont have safety data for this category'
            }

        can_switch = safety['can_switch'] == 'Yes'
        risk_level = safety['switch_risk_level']

        if risk_level == 'Critical':
            emoji = "🚫"
            action = "DO NOT SWITCH"
        elif risk_level == 'High':
            emoji = "⚠️"
            action = "CONSULT DOCTOR FIRST"
        elif risk_level == 'Medium':
            emoji = "💡"
            action = "SWITCH WITH CAUTION"
        else:
            emoji = "✅"
            action = "SAFE TO SWITCH"

        return {
            'can_switch': can_switch,
            'risk_level': risk_level,
            'action': action,
            'emoji': emoji,
            'warning_message': safety['warning_message'],
            'recommendation': safety['recommendation']
        }

    def get_available_pharmacies(self, brand_name, city=None):
        available = self.inventory[
            (self.inventory['brand_name'].str.lower() == brand_name.lower()) &
            (self.inventory['in_stock'] == 'Yes')
        ]

        pharmacy_ids = available['pharmacy_id'].tolist()
        pharmacies = self.pharmacies[
            self.pharmacies['pharmacy_id'].isin(pharmacy_ids)
        ]

        if city:
            pharmacies = pharmacies[
                pharmacies['city'].str.lower() == city.lower()
            ]

        return pharmacies.to_dict('records')

    def calculate_savings(self, brand_name):
        medicine = self.get_medicine_info(brand_name)
        if not medicine:
            return None

        alternatives = self.get_alternatives(brand_name)
        if not alternatives:
            return None

        original_price = medicine['avg_price_inr']
        cheapest = alternatives[0]

        savings = original_price - cheapest['avg_price_inr']
        savings_pct = (savings / original_price) * 100

        return {
            'original_medicine': brand_name,
            'original_price': original_price,
            'cheapest_alternative': cheapest['brand_name'],
            'alternative_price': cheapest['avg_price_inr'],
            'savings_amount': round(savings, 2),
            'savings_percentage': round(savings_pct, 1),
            'same_salt': medicine['salt_composition'],
            'monthly_savings': round(savings * 30, 2),
            'yearly_savings': round(savings * 365, 2)
        }

    def create_knowledge_base(self):
        documents = []

        for _, row in self.medicines.iterrows():
            alts = self.get_alternatives(row['brand_name'])
            alt_names = [a['brand_name'] for a in alts]
            alt_prices = [str(a['avg_price_inr']) for a in alts]

            salt_data = self.get_salt_info(row['salt_composition'])
            salt_use = salt_data['common_use'] if salt_data else 'Not available'
            side_effects = salt_data['side_effects'] if salt_data else 'Not available'

            safety = self.get_safety_info(row['category'])
            safety_msg = safety['warning_message'] if safety else 'Consult doctor'

            doc = f"""
            Medicine: {row['brand_name']}
            Salt Composition: {row['salt_composition']}
            Strength: {row['strength']}
            Form: {row['form']}
            Manufacturer: {row['manufacturer']}
            Price: Rs.{row['avg_price_inr']}
            Category: {row['category']}
            Common Use: {row.get('common_use', salt_use)}
            Prescription Required: {row['prescription_required']}
            Safe To Switch: {row.get('safety_switch', 'Unknown')}
            Risk Level: {row.get('switch_risk_level', 'Unknown')}
            Side Effects: {side_effects}
            Safety Warning: {safety_msg}
            Alternatives: {', '.join(alt_names) if alt_names else 'None found'}
            Alternative Prices: {', '.join(alt_prices) if alt_prices else 'N/A'}
            """

            documents.append({
                'text': doc.strip(),
                'metadata': {
                    'brand_name': row['brand_name'],
                    'salt': row['salt_composition'],
                    'price': row['avg_price_inr'],
                    'category': row['category'],
                    'risk_level': row.get('switch_risk_level', 'Unknown')
                }
            })

        print(f"✅ Created {len(documents)} knowledge base documents")
        return documents


if __name__ == "__main__":
    dp = DataProcessor()
    dp.load_all_data()

    print("\n--- Switch Recommendation for DOLO 650 ---")
    rec = dp.get_switch_recommendation("DOLO 650")
    print(f"{rec['emoji']} {rec['action']}")
    print(f"Reason: {rec['warning_message']}")

    print("\n--- Switch Recommendation for Thyronorm 50 ---")
    rec = dp.get_switch_recommendation("Thyronorm 50")
    print(f"{rec['emoji']} {rec['action']}")
    print(f"Reason: {rec['warning_message']}")

    print("\n--- Overpricing Score for Lipitor 10 ---")
    score = dp.get_overpricing_score("Lipitor 10")
    print(f"Score: {score['score_label']}")
    print(f"Overpriced by: {score['overpricing_percentage']}%")
    print(f"Monthly savings if switched: Rs.{score['monthly_savings']}")
    print(f"Yearly savings if switched: Rs.{score['yearly_savings']}")