import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


def send_account_email(receiver_email, trainee_name, trainee_email, password):
    msg = EmailMessage()

    msg["Subject"] = "New Trainee Account Created"
    msg["From"] = EMAIL_USER
    msg["To"] = receiver_email

    msg.set_content(
        f"""
Hello {trainee_name},

Here are your credentials for the Task Allotment System:

Email: {trainee_email}
Password: {password}

Please keep these credentials safe.

Regards,
Task Management Team
"""
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.send_message(msg)