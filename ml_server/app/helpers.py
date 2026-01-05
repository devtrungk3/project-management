import bcrypt
import jwt
import base64
from django.conf import settings

def verify_password_bcrypt(plain_password, encoded_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), encoded_password.encode('utf-8'))

def validate_jwt(token):
    """
    Validate JWT token
    Returns (is_valid, data_or_error)
    """
    try:
        secret_key_bytes = base64.b64decode(settings.JWT_SECRET_KEY)
        decoded = jwt.decode(
            token,
            secret_key_bytes,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return True, decoded
    except jwt.ExpiredSignatureError:
        return False, "Token has expired"
    except jwt.InvalidTokenError as e:
        return False, f"Invalid token: {str(e)}"