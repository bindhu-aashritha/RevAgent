from typing import Tuple, Dict, Any

class SafetyGuardrails:
    MAX_CONTACT_ATTEMPTS = 2
    MAX_DISCOUNT_PERCENTAGE = 10.0  # Max 10% discount allowed
    MIN_TRANSACTION_AMOUNT = 100.0  # Minimum ₹100 for recovery outreach

    @classmethod
    def validate_action(cls, attempts_made: int, amount: float, proposed_discount: float) -> Tuple[bool, str, float]:
        """
        Enforces hackathon bar: Bounded and gated money actions.
        Returns: (is_allowed, reason, sanitized_discount)
        """
        if attempts_made >= cls.MAX_CONTACT_ATTEMPTS:
            return False, f"Halt: Exceeded maximum allowed contact attempts ({cls.MAX_CONTACT_ATTEMPTS}).", 0.0

        if amount < cls.MIN_TRANSACTION_AMOUNT:
            return False, f"Halt: Amount ₹{amount} is below threshold ₹{cls.MIN_TRANSACTION_AMOUNT}.", 0.0

        # Cap discount to strict 10% limit
        sanitized_discount = min(proposed_discount, cls.MAX_DISCOUNT_PERCENTAGE)
        
        return True, "Passed all safety guardrails.", sanitized_discount