import os
import razorpay
from typing import Dict, Any

class RazorpayService:
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock123")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET", "mock_secret_123")
        try:
            self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
        except Exception:
            self.client = None

    def create_recovery_payment_link(
        self,
        amount: float,
        customer_name: str,
        customer_phone: str = "+919876543210",
        customer_email: str = "customer@example.com",
        discount_pct: float = 0.0
    ) -> Dict[str, Any]:
        # Calculate discounted amount
        discounted_amount = amount * (1.0 - (discount_pct / 100.0))
        amount_in_paise = int(round(discounted_amount * 100))

        # Attempt API call to Razorpay
        if self.client and not self.key_id.startswith("rzp_test_mock"):
            try:
                link_data = {
                    "amount": amount_in_paise,
                    "currency": "INR",
                    "accept_partial": False,
                    "description": f"RevAgent Checkout Recovery ({discount_pct:.0f}% Off)",
                    "customer": {
                        "name": customer_name,
                        "contact": customer_phone,
                        "email": customer_email
                    },
                    "notify": {"sms": False, "email": False},
                    "reminder_enable": False
                }
                res = self.client.payment_link.create(link_data)
                return {
                    "payment_link_id": res.get("id"),
                    "short_url": res.get("short_url"),
                    "amount_payable": discounted_amount,
                    "status": "CREATED_LIVE"
                }
            except Exception as e:
                print(f"[Razorpay API Fallback]: {e}")

        # Mock Fallback when test key or API call isn't available
        mock_id = f"plink_rec_{abs(hash(customer_name)) % 100000}"
        return {
            "payment_link_id": mock_id,
            "short_url": f"https://rzp.io/i/{mock_id}",
            "amount_payable": discounted_amount,
            "status": "MOCK_CREATED"
        }