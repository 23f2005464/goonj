import httpx
import os
import base64
import qrcode
from io import BytesIO

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "")
FROM_NAME = os.getenv("FROM_NAME", "Goonj 2026")


async def send_registration_email(email: str, name: str, token: str) -> bool:
    try:
        qr_base64 = _make_qr_base64(token)
        html = _build_html(name, token, qr_base64)

        payload = {
            "sender": {"email": FROM_EMAIL, "name": FROM_NAME},
            "to": [{"email": email, "name": name}],
            "subject": "🎉 Goonj 2026 – Your Entry QR Pass",
            "htmlContent": html,
            "attachment": [
                {
                    "content": qr_base64,
                    "name": "qr_pass.png",
                }
            ],
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=30,
            )

        if response.status_code == 201:
            print(f"[EMAIL] Sent to {email}")
            return True
        else:
            print(f"[EMAIL ERROR] Brevo returned {response.status_code}: {response.text}")
            return False

    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def _make_qr_base64(token: str) -> str:
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
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Goonj 2026 – Entry Pass</title>
</head>
<body style="margin:0;padding:0;background:#fff8f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(224,123,0,0.12);">
 
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#b35200,#e07b00,#f5a623);padding:44px 32px;text-align:center;">
            <div style="font-size:42px;margin-bottom:12px;">🎊</div>
            <h1 style="margin:0;color:white;font-size:30px;font-weight:900;letter-spacing:0.5px;">
              You're In, {name}!
            </h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.88);font-size:15px;line-height:1.7;">
              Your registration for <strong>Goonj 2026 – Grand Cultural Festival</strong><br/>has been confirmed!
            </p>
          </td>
        </tr>
 
        <!-- QR Attachment Notice -->
        <tr>
          <td style="padding:36px 32px;text-align:center;background:#fffdf5;">
            <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#e07b00;text-transform:uppercase;letter-spacing:2px;">
              Your Entry QR Code
            </p>
            <div style="background:#fff8f0;border:1.5px dashed #e07b00;border-radius:14px;padding:24px 20px;display:inline-block;max-width:400px;">
              <div style="font-size:36px;margin-bottom:10px;">📎</div>
              <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a2e;">
                QR Pass attached as
              </p>
              <p style="margin:6px 0 12px;font-size:14px;color:#e07b00;font-family:monospace;font-weight:700;">
                goonj2026_qr_pass.png
              </p>
              <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
                Open the attachment, take a screenshot or print it.<br/>
                Show it at the entry gate on the event day.
              </p>
            </div>
            <p style="margin:16px 0 0;color:#aaa;font-size:12px;font-family:monospace;">
              Token: {short_token}
            </p>
          </td>
        </tr>
 
        <!-- Divider -->
        <tr>
          <td style="padding:0 32px;">
            <div style="border-top:1.5px solid #f0e8d0;"></div>
          </td>
        </tr>
 
        <!-- Event Details -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1.5px;">Event Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fff8f0,#fff3d0);border-radius:14px;border:1.5px solid #f5a623;">
              <tr>
                <td style="padding:22px 24px;font-size:14px;color:#6b4c2e;line-height:2.4;">
                  <div>📅 &nbsp;<strong style="color:#2d1a00;">17 March 2026 (Tuesday)</strong></div>
                  <div>🕑 &nbsp;<strong style="color:#2d1a00;">2:00 PM – 5:00 PM</strong></div>
                  <div>📍 &nbsp;<strong style="color:#2d1a00;">Indoor Auditorium, JP Arts &amp; Science College, Bharuch</strong></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
 
        <!-- Important Note -->
        <tr>
          <td style="padding:0 32px 32px;">
            <div style="background:#fff3cd;border-left:4px solid #f5a623;border-radius:8px;padding:14px 18px;font-size:13px;color:#856404;line-height:1.8;">
              <strong>⚠️ Important:</strong> Please carry your QR code (screenshot or printout).
              Each QR code is valid for <strong>one-time entry only</strong>.
              Do not share it with others.
            </div>
          </td>
        </tr>
 
        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;line-height:2;">
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
</html>"""