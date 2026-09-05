class MessagingService:
    @classmethod
    def dispatch_whatsapp(cls, phone: str, message: str, short_url: str):
        return {
            "status": "DELIVERED",
            "channel": "WHATSAPP",
            "recipient": phone,
            "message_preview": f"{message} {short_url}"
        }

    @classmethod
    def dispatch_sms(cls, phone: str, message: str, short_url: str):
        return {
            "status": "DELIVERED",
            "channel": "SMS",
            "recipient": phone,
            "message_preview": f"{message} {short_url}"
        }