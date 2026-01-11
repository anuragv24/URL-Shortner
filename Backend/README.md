


# ⚙️ Backend – URL Shortener API

This is the backend API for the URL Shortener application.  

It handles authentication, URL generation, redirection, analytics, and security.

The backend is built as a RESTful service and deployed independently.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs (Password hashing)
- JSON Web Tokens (JWT)
- Nodemailer (Email OTP)
- express-rate-limit
- cookie-parser
- CORS
- dotenv

---

## ✨ Core Features

- Email-based OTP authentication
- Access & refresh token-based authorization
- Secure cookie handling
- Guest URL creation with expiry
- Authenticated URL management
- Custom short URLs using nanoid
- URL redirection
- Click analytics
- Rate limiting to prevent abuse

---

## 🔐 Authentication Flow (High Level)

1. User submits email
2. OTP is sent via email
3. OTP verification authenticates user
4. Access token issued for API requests
5. Refresh token maintains session
6. Protected routes validate JWT tokens

---


