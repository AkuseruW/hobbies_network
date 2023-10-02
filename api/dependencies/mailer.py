from dotenv import load_dotenv
import os
import resend

load_dotenv()

resend.api_key = os.environ["RESEND_API_KEY"]


def send_mail(email: str, subject: str, message: str):
    params = {
        "from": "admin@hobbies.wolfsaxel.com",
        "to": email,
        "subject": subject,
        "html": message,
    }
    
    resend.Emails.send(params)
