# 🤖 DeltaGPT – AI Chatbot with CI/CD Automation

DeltaGPT is a **full-stack AI chatbot** powered by **OpenAI’s GPT-4o-mini model**, built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
It features secure authentication, automated deployment, and a modern, responsive chat interface — all powered by a custom **CI/CD pipeline**.

🌐 **Live Demo:** [https://delta-gpt-chatbot.vercel.app/](https://delta-gpt-chatbot.vercel.app/)

---

## 🚀 Features

- 🧠 **AI-Powered Chat** using OpenAI’s `gpt-4o-mini` model  
- 🔐 **User Authentication** (Register / Login using JWT)
- 💬 **Interactive Chat Interface** built with React
- 🧵 **Thread-based Conversation History**
- 🧪 **Jest Testing** for backend and frontend logic
- ⚙️ **CI/CD Pipeline** using GitHub Actions  
  - Automatically runs tests on each push  
  - Deploys frontend (Vercel) and backend (Render) if all tests pass  
- 🍪 **Cookies + LocalStorage** for session management
- 🖥️ **Responsive, Clean UI**
- ☁️ **Deployed Platforms**
  - **Frontend:** Vercel  
  - **Backend:** Render  

---

## 🏗️ Tech Stack

**Frontend**
- React.js (Vite)
- Context API
- React Router
- Bootstrap 5 / Font Awesome
- React Spinners (Loader)

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- bcrypt.js (Password Hashing)
- JWT for authentication
- CORS / Cookie Parser
- OpenAI API Integration

**DevOps**
- GitHub Actions (CI/CD)
- Jest (Testing)
- Render (Backend Deployment)
- Vercel (Frontend Deployment)

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/DeltaGPT.git
cd DeltaGPT
