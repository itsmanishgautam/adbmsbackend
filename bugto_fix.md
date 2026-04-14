# 🐞 Bug Report + Feature Requests

## 👤 1. User Management UI Issue

* The **“Edit Doctor” button is white** and not visible properly
* Needs better contrast / styling fix

---

## ❌ 2. User Deletion Not Working (Admin)

* Admin **cannot delete users**
* On clicking delete → shows error: *“Could not delete the user”*
* Deletion flow is broken for users/doctor/patient

---

## 🔔 3. Missing Admin Notifications

* Admin has no visibility of:

  * update requests
  * profile change requests
* Need a **notification system for admin dashboard**

---

## 👨‍⚕️ 4. Role-Based Access Issues

* Users can update their own profile
* BUT cannot manage doctor profile properly
* Admin should have full control:

  * create
  * update
  * delete (users, doctors, patients)

---

## 🏥 5. Insurance Section Missing Fields

* Insurance provider section is incomplete
* Needs additional structured fields (currently too limited)

---

## 🧑‍⚕️ 6. Patient Data CRUD Issues

For patient sections:

* allergies
* chronic conditions
* medications
* medical devices
* emergency contacts

❌ Problems:

* No proper **Create / Update / Delete flow**
* Data input exists but **no proper SAVE functionality**

---

## 📇 7. Emergency Contact Edit Bug

* Patient can edit emergency contact
* BUT changes are not saved correctly
* Previously stored values are not restored properly

---

## 🚑 8. Incident Module Issues

* Incident system is unclear / broken workflow
* Once incident is updated/deleted, cannot be improved later
* Need proper **incident lifecycle workflow (create → update → resolve)**

---

## 🔍 9. Doctor Search & Access Limitations

Doctors should be able to:

* Search users by:

  * name
  * ID
  * phone number
  * other identifiers

❌ Currently missing or incomplete

---

## 🔐 10. Approval Workflow Missing (Multi-Level)

Need approval system:

* Admin can approve data
* Doctor should ALSO be able to:

  * view patient updates
  * approve or reject changes

Example:

* user updates profile → doctor approval required → admin final approval (or configurable flow)

---

## 👨‍⚕️ 11. Doctor Profile Management Missing

* Doctor profile exists but is incomplete
* Doctors should be able to:

  * view their profile
  * update their information
  * submit changes for admin approval

---

# 🚀 Summary

Main issues:

* Broken delete functionality
* Missing save/update flows
* Weak role-based permissions
* No approval/notification system
* Incomplete patient + doctor data management

---

If you want, I can also convert this into:

* 📌 GitHub Issues (each as separate issue with labels)
* 🧾 Jira tickets
* 🧑‍💻 a proper “System Bug Fix Roadmap”
* or a **developer task breakdown with priority levels (P0/P1/P2)**
