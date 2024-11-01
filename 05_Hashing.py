import hashlib

passwords = [
 "123456", "123456789", "qwerty", "password", "12345", "12345678", "111111",
 "123123", "abc123", "1234", "password1", "1234567", "qwerty123", "1q2w3e4r",
 "admin", "qwertyuiop", "654321", "555555", "lovely", "welcome", "letmein",
 "dragon", "sunshine", "iloveyou", "princess", "football", "password123",
 "monkey","shadow", "654321"
]

def hashfunc(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest();



for password in passwords:
    print(password, hashfunc(password));





print("shadow", hashfunc("shadow"));
print("shadow69", hashfunc("shadow69"));
