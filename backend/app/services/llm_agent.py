import os
import json
from typing import Dict, Any
from openai import OpenAI

class RecoveryAgent:
    @classmethod
    def generate_intervention(
        cls, customer_name: str, amount: float, failure_code: str, failure_reason: str = ""
    ) -> Dict[str, Any]:
        api_key = os.getenv("OPENAI_API_KEY", "")
        client = OpenAI(api_key=api_key) if api_key else None

        # Rule-based fallback/logic baseline
        suggested_discount = 10.0 if failure_code in ["INSUFFICIENT_FUNDS", "BAD_REQUEST_PAYMENT_TIMED_OUT"] else 5.0
        recommended_channel = "WHATSAPP" if failure_code != "AUTHENTICATION_FAILED" else "SMS"

        hinglish_message = (
            f"Hi {customer_name}, aapka payment ₹{amount:.2f} incomplete reh gaya. "
            f"Use this link to complete with {suggested_discount:.0f}% off:"
        )

        if client:
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a polite revenue recovery assistant for an e-commerce platform in India. "
                                "Generate a friendly, 1-sentence Hinglish message informing the customer about their failed order. "
                                "Do not include placeholder links; just return the message text under 140 characters."
                            )
                        },
                        {
                            "role": "user",
                            "content": f"Customer: {customer_name}, Amount: {amount}, Failure Reason: {failure_code}"
                        }
                    ],
                    max_tokens=60
                )
                hinglish_message = response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[LLM Fallback Triggered]: {e}")

        return {
            "proposed_discount_pct": suggested_discount,
            "recommended_channel": recommended_channel,
            "hinglish_message": hinglish_message,
            "reasoning": f"Analyzed failure '{failure_code}'. Selected {recommended_channel} with {suggested_discount:.0f}% discount."
        }