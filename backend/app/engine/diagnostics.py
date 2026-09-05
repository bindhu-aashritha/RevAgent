class FailureDiagnostics:
    @classmethod
    def analyze_failure(cls, failure_code: str, failure_reason: str = ""):
        return {
            "failure_code": failure_code,
            "failure_reason": failure_reason,
            "diagnostic_summary": f"Analyzed failure code: {failure_code}",
            "retryable": True if failure_code != "AUTHENTICATION_FAILED" else False
        }