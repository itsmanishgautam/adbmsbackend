import urllib.request
import urllib.parse
import json
import string
import random

BASE_URL = "http://127.0.0.1:8000"

def generate_random_email():
    return "".join(random.choices(string.ascii_lowercase, k=10)) + "@test.com"

def make_request(url, method="GET", json_data=None, form_data=None, headers=None):
    if headers is None:
        headers = {}
    
    data = None
    if json_data:
        data = json.dumps(json_data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif form_data:
        data = urllib.parse.urlencode(form_data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            return status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else str(e)

def test_signup_login():
    print("--- Testing Patient Signup and Login ---")
    email = generate_random_email()
    password = "password123"
    name = "Test Patient"
    
    # 1. Signup patient
    status, res = make_request(f"{BASE_URL}/api/v1/auth/signup", method="POST", json_data={
        "name": name,
        "email": email,
        "password": password
    })
    print("Signup Status:", status)
    print("Signup Response:", res)
    assert status in [200, 201]

    # 2. Login patient
    status, res = make_request(f"{BASE_URL}/api/v1/auth/login", method="POST", form_data={
        "username": email,
        "password": password
    })
    print("Login Status:", status)
    print("Login Response Token Valid:", bool(res.get("access_token")))
    assert status in [200, 201]

def test_admin_create_doctor():
    print("\n--- Testing Admin Creating Doctor ---")
    
    # login as admin
    status, res = make_request(f"{BASE_URL}/api/v1/auth/login", method="POST", form_data={
        "username": "admin@ehcidb.com",
        "password": "password123"
    })
    print("Admin Login Status:", status)
    admin_token = res.get("access_token")
    assert admin_token is not None
    
    # Admin creates a doctor
    doctor_email = generate_random_email()
    doctor_password = "docpassword123"
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    status, res = make_request(f"{BASE_URL}/api/v1/admin/create_doctor", method="POST", json_data={
        "name": "Dr. Test",
        "email": doctor_email,
        "password": doctor_password,
        "specialty": "Cardiology",
        "hospital_id": 1
    }, headers=headers)
    print("Admin Create Doctor Status:", status)
    print("Admin Create Doctor Response:", res)
    assert status in [200, 201]
        
    # Test doctor login
    status, res = make_request(f"{BASE_URL}/api/v1/auth/login", method="POST", form_data={
        "username": doctor_email,
        "password": doctor_password
    })
    print("Doctor Login Status:", status)
    print("Doctor Login Token Valid:", bool(res.get("access_token")))
    assert status in [200, 201]
        
if __name__ == "__main__":
    test_signup_login()
    test_admin_create_doctor()
