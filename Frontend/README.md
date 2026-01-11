

# 🎨 Frontend – URL Shortener

This is the frontend of the URL Shortener application.  
It handles user interaction, authentication flow, URL creation, analytics display, and QR code generation.

The frontend communicates with the backend via REST APIs.

---

## 🛠 Tech Stack

- React 19
- Redux Toolkit
- React Redux
- TanStack Query (Server state management)
- TanStack Router (Routing)
- Tailwind CSS
- Axios
- react-qr-code
- Vite

---

## ✨ Features

- Guest URL shortening
- OTP-based authentication flow
- Automatic login after OTP verification
- Persistent login using refresh tokens
- Protected routes for authenticated users
- Dashboard for managing URLs
- QR code generation
- URL analytics display

---

## 🔐 State & Auth Handling

- Global state managed using Redux Toolkit
- Server state managed using TanStack Query
- Authentication handled via access & refresh tokens
- Protected routes using router guards
- API communication handled with Axios

---

