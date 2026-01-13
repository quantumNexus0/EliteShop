from auth_utils import get_password_hash
try:
    p = "admin123"
    h = get_password_hash(p)
    print(f"Password: {p}")
    print(f"Hash: {h}")
except Exception as e:
    print(f"Error: {e}")
