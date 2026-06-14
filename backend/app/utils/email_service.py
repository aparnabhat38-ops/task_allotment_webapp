import os
import requests
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")


def send_account_email(receiver_email, trainee_name, trainee_email, password):

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {
            "name": "Task Allotment System",
            "email": "taskallotment298@gmail.com"
        },
        "to": [
            {
                "email": receiver_email
            }
        ],
        "subject": "Task Allotment System Credentials",
        "textContent": f"""
Hello {trainee_name},

Your account has been created successfully.

Email: {trainee_email}
Password: {password}

Regards,
Task Management Team
"""
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=10
        )

        print("Brevo Status:", response.status_code)
        print("Brevo Response:", response.text)

    except Exception as e:
        print("Brevo Error:", e)