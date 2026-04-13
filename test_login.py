import requests

res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": "admin@example.com", "password": "password123"})
print(res.status_code)
print(res.text)
