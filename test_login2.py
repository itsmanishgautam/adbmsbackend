import requests

res = requests.post("http://api:8000/api/auth/login", data={"username": "admin@example.com", "password": "password123"})
print(res.status_code)
print(res.text)
