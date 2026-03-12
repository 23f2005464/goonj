import qrcode
import uuid
import os
import base64
from io import BytesIO
from PIL import Image

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "qrcodes")


def generate_qr_token() -> str:
    return str(uuid.uuid4())


def generate_qr_image(token: str, name: str) -> str:
    """Generate QR code, save to disk, and return the base64-encoded PNG string."""
    os.makedirs(STATIC_DIR, exist_ok=True)

    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(token)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#1a1a2e", back_color="white").convert("RGB")

    # Save to disk (for scanner page to serve via /static)
    file_path = os.path.join(STATIC_DIR, f"{token}.png")
    img.save(file_path)

    # Also return as base64 for inline email embedding
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")