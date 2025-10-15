# 🧠 TestWise — Computer-Based Testing App

![CBT App Screenshot](./screenshot.png)

> A modern and interactive **Computer-Based Testing (CBT)** application built with **React + Vite** on the frontend and **Express.js + Prisma** on the backend.  
> TestWise allows admins to create and manage tests while students can take quizzes in real-time with analytics and progress tracking.

---

## 🚀 Live Demo

- 🌐 **Frontend:** [https://your-frontend-url-here](https://your-frontend-url-here)  
- 🛠️ **Backend API:** [https://your-backend-url-here](https://your-backend-url-here)

*(You can remove this section if you haven’t deployed yet.)*

---

## ✨ Features

### 🧑‍💻 Admin
- Create, edit, and manage tests and questions
- Control test availability (start & end time)
- View test analytics and student performance
- Real-time updates with Socket.io

### 👨‍🎓 Students
- Take CBT quizzes with a clean and responsive UI
- View countdown timer during tests
- Real-time feedback and results
- Multiple attempts support (configurable by admin)

### 🧰 General
- Authentication & Authorization (JWT)
- Fully responsive design with Chakra UI
- Real-time updates using Socket.io
- Data visualization with Recharts
- Cloudinary for media storage
- Light/Dark mode support

---

## 🛠️ Tech Stack

### **Frontend**
- ⚡ Vite + React (TypeScript)
- 🌿 Chakra UI
- 🧭 React Router DOM
- 📊 Recharts
- 🔥 Framer Motion
- ☁️ Cloudinary
- 📡 Socket.io Client
- 🧭 TanStack Query

### **Backend**
- 🧱 Express.js (TypeScript)
- 🧪 Prisma ORM
- 🗄️ PostgreSQL / MySQL (configurable)
- 🔐 JSON Web Token (JWT)
- 📡 Socket.io
- 🪵 Winston (logging)

---

## 📦 Installation

### 🖥️ Clone the Repository
```bash

### Folder Structure
testwise/
├── testwise-client/      # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── testwise-server/      # Express Backend
│   ├── prisma/
│   ├── src/
│   └── package.json
│
├── screenshots/
│   ├── dashboard.png
│   ├── test.png
│   └── analytics.png
└── README.md


cd testwise-client
npm install
# or yarn install
npm run dev

cd ../testwise-server
npm install
# or yarn install
npx prisma migrate dev
npx prisma db seed
npm run dev


🧑‍💻 Author
Muritador Abdulazeez
💼 Full-Stack JavaScript Developer


git clone https://github.com/your-username/testwise.git
cd testwise
