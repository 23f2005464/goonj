import qrcode
import uuid
import os
from PIL import Image, ImageDraw
import io
import base64


QR_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "qrcodes")
os.makedirs(QR_DIR, exist_ok=True)


def generate_qr_token() -> str:
    return str(uuid.uuid4())


def generate_qr_image(token: str, name: str) -> str:
    """Generate QR code image and save it. Returns filename."""
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(token)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#1a1a2e", back_color="white")

    # Convert to RGBA for potential overlay
    img = img.convert("RGBA")

    filename = f"{token}.png"
    filepath = os.path.join(QR_DIR, filename)
    img.save(filepath)

    return filename


def get_qr_base64(token: str) -> str:
    """Return base64 encoded QR image for email embedding."""
    filepath = os.path.join(QR_DIR, f"{token}.png")
    if os.path.exists(filepath):
        with open(filepath, "rb") as f:
            return base64.b64encode(f.read()).decode()

    # Generate if not exists
    generate_qr_image(token, "")
    with open(filepath, "rb") as f:
        return base64.b64encode(f.read()).decode()
