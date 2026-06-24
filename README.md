# 💰 Smart Expense Tracker

A full-stack personal finance management web application that helps users track expenses, manage budgets, monitor spending habits, and automate recurring expenses.

---

## 🚀 Overview

Smart Expense Tracker is a web-based expense management system designed to help users gain better control over their finances. The application allows users to record expenses, create monthly budgets, receive spending alerts, and manage recurring payments through an intuitive dashboard.

---

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- Password hashing using PBKDF2-SHA256
- Session-based authentication
- Automatic session expiration

### 💵 Expense Management
- Add, edit, and delete expenses
- Categorize expenses
- Record merchant details and notes
- Filter expenses by category, payment mode, and date range
- Search expenses quickly

### 📊 Dashboard Analytics
- Monthly spending overview
- Budget vs actual spending comparison
- Category-wise spending breakdown
- Daily expense trends
- Recent expense history

### 🎯 Budget Management
- Set monthly budgets for categories
- Configure budget warning thresholds
- Receive alerts when spending approaches limits
- Automatic budget exceed notifications

### 🔄 Recurring Expenses
- Create recurring expense rules
- Weekly, monthly, and yearly recurrence options
- Automatic expense generation
- Recurring payment notifications

### 🔔 Smart Notifications
- Budget warning alerts
- Budget exceeded alerts
- Recurring expense reminders
- Notification tracking system

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6 Modules)

### Backend
- Python
- HTTPServer
- REST API Architecture

### Database
- SQLite3

### Security
- PBKDF2 Password Hashing
- UUID Session Tokens
- Authorization Middleware

---

## 🗄️ Database Design

The application uses SQLite and includes the following core tables:

- Users
- Categories
- Expenses
- Budgets
- Recurring Rules
- Notifications

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/smart-expense-tracker.git
cd smart-expense-tracker
```

### Run the Application

```bash
python backend/server.py
```

### Open in Browser

```text
http://localhost:8000
```

---

## 🧪 API Verification

The project includes a testing script that automatically verifies:

- User Registration
- Authentication
- Category Retrieval
- Budget Creation
- Expense Logging
- Budget Alerts
- Dashboard Statistics
- Notification Generation

Run the verification script:

```bash
python backend/verify_api.py
```

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Full Stack Development
- REST API Design
- Authentication Systems
- Database Design
- SQLite Integration
- Session Management
- CRUD Operations
- Financial Data Processing
- Frontend-Backend Communication
- Budget Tracking Logic

---

## 🔮 Future Enhancements

- Export Reports to CSV/PDF
- Email Notifications
- Multi-Currency Support
- Dark Mode
- Cloud Database Integration
- AI-Based Expense Prediction
- Mobile Application Support
- Advanced Analytics & Reports

---

## 👨‍💻 Author

**Arup Roy**

Aspiring Software Developer passionate about building practical applications and solving real-world problems through technology.

### Connect With Me

- GitHub: [https://github.com/aruproy2006-droid]
- LinkedIn: [https://www.linkedin.com/in/arup-roy-010a3b38a/?skipRedirect=true]

---

## ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.
