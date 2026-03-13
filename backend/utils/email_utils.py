import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os
import base64
import qrcode

SMTP_HOST = os.getenv("SMTP_HOST", "in-v3.mailjet.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "")
FROM_NAME = os.getenv("FROM_NAME", "Goonj 2026")


async def send_registration_email(email: str, name: str, token: str) -> bool:
    try:
        qr_base64 = _make_qr_base64(token)
        html = _build_html(name, token, qr_base64)
        msg = MIMEMultipart("related")

        msg["Subject"] = "🎉 Goonj 2026 – Your Entry QR Pass"
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = email

        msg_alt = MIMEMultipart("alternative")
        msg.attach(msg_alt)
        msg_alt.attach(MIMEText(html, "html"))

        img_data = base64.b64decode(qr_base64)
        image = MIMEImage(img_data)
        image.add_header("Content-ID", "<qr_code>")
        image.add_header("Content-Disposition", "inline", filename="qr.png")
        msg.attach(image)

        await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            start_tls=True,
        )
        print(f"[EMAIL] Sent to {email}")
        return True

    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def _make_qr_base64(token: str) -> str:
    import qrcode, base64
    from io import BytesIO

    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(token)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1a1a2e", back_color="white").convert("RGB")

    buf = BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def _build_html(name: str, token: str, qr_base64: str) -> str:
    short_token = token[:8] + "..." + token[-4:]
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Goonj 2026 – Entry Pass</title>
</head>
<body style="margin:0;padding:0;background:#fff8f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(224,123,0,0.15);">
        <tr>
          <td style="background:linear-gradient(135deg,#b35200,#e07b00,#f5a623);padding:40px 32px;text-align:center;">
            <div style="font-size:38px;margin-bottom:8px;">🎊</div>
            <h1 style="margin:0;color:white;font-size:30px;font-weight:900;letter-spacing:0.5px;">
              You're In, {name}!
            </h1>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.88);font-size:15px;line-height:1.6;">
              Your registration for <strong>Goonj 2026 – Grand Cultural Festival</strong> has been confirmed!<br/>
              Show the QR code below at the entry gate on the event day.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px;text-align:center;background:#fffdf5;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#e07b00;
                      text-transform:uppercase;letter-spacing:2px;border:2px solid #e07b00;
                      display:inline-block;border-radius:20px;padding:4px 16px;">
              Your Entry QR Code
            </p>
            <div style="margin:20px auto;display:inline-block;border:3px solid #e07b00;
                        border-radius:16px;padding:16px;background:white;
                        box-shadow:0 4px 20px rgba(224,123,0,0.15);">
              <img src="cid:qr_code" alt="Your Entry QR Code" width="220" height="220"
                   style="display:block;border-radius:8px;" />
            </div>
            <p style="margin:8px 0 0;color:#999;font-size:12px;font-family:monospace;">
              Token: {short_token}
            </p>
            <p style="margin:12px 0 0;color:#e07b00;font-size:13px;font-weight:700;">
              Scan this QR code at the gate
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:linear-gradient(135deg,#fff8f0,#fff3d0);
                          border-radius:14px;border:1.5px solid #f5a623;">
              <tr>
                <td style="padding:22px 24px;font-size:14px;color:#6b4c2e;line-height:2.2;">
                  <div>📅 <strong style="color:#2d1a00;">17 March 2026 (Tuesday)</strong></div>
                  <div>🕑 <strong style="color:#2d1a00;">2:00 PM – 5:00 PM</strong></div>
                  <div>📍 <strong style="color:#2d1a00;">Indoor Auditorium, JP Arts & Science College, Bharuch</strong></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <div style="background:#fff3cd;border-left:4px solid #f5a623;border-radius:8px;
                        padding:14px 18px;font-size:13px;color:#856404;line-height:1.7;">
              <strong>⚠️ Important:</strong> Please carry this QR code (screenshot or printout).
              Each QR code is valid for <strong>one-time entry only</strong>.
              Do not share it with others.
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#1a1a2e;padding:22px 32px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;line-height:1.8;">
              Goonj 2026 – Grand Cultural Festival<br/>
              JP Arts &amp; Science College, Bharuch<br/>
              <span style="color:rgba(255,255,255,0.3);">This is an automated email. Please do not reply.</span>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""