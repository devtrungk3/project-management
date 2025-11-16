import bcrypt
def verify_password_bcrypt(plain_password, encoded_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), encoded_password.encode('utf-8'))