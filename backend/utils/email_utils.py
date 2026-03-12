import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
from utils.qr_utils import get_qr_base64

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "")
FROM_NAME = os.getenv("FROM_NAME", "Goonj 2026")


def build_email_html(name: str, qr_token: str, qr_base64: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body {{ margin:0; padding:0; background:#fff8f0; font-family:Arial,sans-serif; }}
  .container {{ max-width:600px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1); }}
  .header {{ background:linear-gradient(135deg,#e07b00,#f5a623,#e07b00); padding:40px 30px; text-align:center; }}
  .header h1 {{ color:#fff; margin:0; font-size:42px; font-weight:900; text-shadow:2px 2px 8px rgba(0,0,0,0.3); letter-spacing:2px; }}
  .header p {{ color:#fff8e0; margin:5px 0 0; font-size:14px; letter-spacing:3px; text-transform:uppercase; }}
  .body {{ padding:35px 30px; }}
  .greeting {{ font-size:22px; color:#1a1a2e; font-weight:700; margin-bottom:10px; }}
  .message {{ color:#555; font-size:14px; line-height:1.8; }}
  .qr-section {{ text-align:center; margin:30px 0; padding:25px; background:linear-gradient(135deg,#fff8e0,#fff3cc); border-radius:16px; border:2px dashed #e07b00; }}
  .qr-section img {{ width:200px; height:200px; border:4px solid #e07b00; border-radius:12px; }}
  .qr-section p {{ color:#7a3d00; font-weight:600; margin:12px 0 0; font-size:13px; }}
  .details {{ background:#f9f0e0; border-radius:12px; padding:20px; margin:20px 0; }}
  .details h3 {{ color:#e07b00; margin:0 0 12px; font-size:16px; text-transform:uppercase; letter-spacing:1px; }}
  .detail-row {{ display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e8d5b0; font-size:13px; color:#444; }}
  .detail-row:last-child {{ border:none; }}
  .detail-label {{ font-weight:600; color:#7a3d00; }}
  .footer {{ background:#1a1a2e; padding:25px; text-align:center; color:#aaa; font-size:12px; }}
  .footer strong {{ color:#f5a623; }}
  .warning {{ background:#fff3cd; border:1px solid #ffc107; border-radius:8px; padding:12px 15px; margin:20px 0; font-size:12px; color:#856404; }}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>GOONJ 2026</h1>
    <p>Grand Cultural Festival</p>
  </div>
  <div class="body">
    <div class="greeting">🎉 You're In, {name}!</div>
    <p class="message">
      Your registration for <strong>Goonj 2026 – Grand Cultural Festival</strong> has been confirmed!
      Show the QR code below at the entry gate on the event day.
    </p>
    <div class="qr-section">
      <img src="data:image/png;base64,{qr_base64}" alt="Your Entry QR Code" />
      <p>📱 Scan this QR code at the gate</p>
      <p style="font-size:11px;color:#a06030;margin-top:4px;">Token: {qr_token[:8]}...{qr_token[-4:]}</p>
    </div>
    <div class="details">
      <h3>📅 Event Details</h3>
      <div class="detail-row"><span class="detail-label">Event</span><span>Goonj 2026 – Grand Cultural Festival</span></div>
      <div class="detail-row"><span class="detail-label">Date</span><span>17 March 2026 (Tuesday)</span></div>
      <div class="detail-row"><span class="detail-label">Time</span><span>2:00 PM – 5:00 PM</span></div>
      <div class="detail-row"><span class="detail-label">Venue</span><span>Indoor Auditorium, JP Arts & Science College, Bharuch</span></div>
      <div class="detail-row"><span class="detail-label">Convener</span><span>Prof. Swaral Naik</span></div>
    </div>
    <div class="warning">
      ⚠️ <strong>Important:</strong> This QR code is unique to you. Do not share it. Present it at entry for verification.
    </div>
  </div>
  <div class="footer">
    <p>Organized by <strong>JP Arts and Science College, Bharuch</strong></p>
    <p>Student Coordinator: Hariom Dave — 79907 41568</p>
    <p style="margin-top:8px;font-size:11px;">© 2026 Goonj. All rights reserved.</p>
  </div>
</div>
</body>
</html>
"""


async def send_registration_email(to_email: str, name: str, qr_token: str) -> bool:
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"[EMAIL] Skipped (no SMTP config). Would send to {to_email}")
        return False

    try:
        qr_b64 = get_qr_base64(qr_token)
        html = build_email_html(name, qr_token, qr_b64)

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🎉 Goonj 2026 – Your Registration is Confirmed!"
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html, "html"))

        # aiosmtplib 5.x API
        await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            start_tls=True,
        )
        print(f"[EMAIL] Sent to {to_email}")
        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")
        return False
