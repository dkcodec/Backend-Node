# Task Manager API

## 📌 Description

Task Manager API is a web application for managing tasks. It allows users to register, log in, create, edit, and delete tasks. There is also an admin role that can manage all users and their tasks.

## 🚀 Deployment

The project is deployed on **Render**: [Task Manager API](https://backend-node-ss3o.onrender.com/)

## 🛠 Technologies

- **Node.js + Express.js** (backend)
- **MongoDB Atlas** (database)
- **Mongoose** (ORM for MongoDB)
- **JWT (JSON Web Token)** (authentication)
- **EJS** (page rendering)
- **Bootstrap** (frontend styling)

---

## 📌 Installation & Running Locally

### **1. Clone the repository**

```bash
git clone https://github.com/dkcodec/Backend-Node/
cd taskmanager
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Configure environment variables**

Create a `.env` file in the root directory and add:

```ini
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=yourSuperSecretKey123
```

**Replace `username:password` with your MongoDB Atlas credentials!**

### **4. Start the server**

```bash
npm start
```

(or with auto-restart)

```bash
npm run dev
```

---

## 📌 API Endpoints

### **🔹 Authentication**

| Method | URL         | Description           |
| ------ | ----------- | --------------------- |
| `POST` | `/register` | Register a new user   |
| `POST` | `/login`    | Log in (JWT token)    |
| `GET`  | `/logout`   | Log out (clear token) |

### **🔹 Tasks**

| Method | URL                 | Description               |
| ------ | ------------------- | ------------------------- |
| `GET`  | `/tasks`            | Get the list of tasks     |
| `POST` | `/tasks`            | Create a new task         |
| `GET`  | `/tasks/edit/:id`   | Show edit form for a task |
| `POST` | `/tasks/edit/:id`   | Update a task             |
| `POST` | `/tasks/delete/:id` | Delete a task             |

### **🔹 Users (Admin Only)**

| Method | URL                             | Description     |
| ------ | ------------------------------- | --------------- |
| `GET`  | `/users/admin`                  | Admin dashboard |
| `POST` | `/users/admin/users/delete/:id` | Delete a user   |
| `POST` | `/users/admin/users/update/:id` | Update a user   |

---

## 📌 User Roles

- **Regular User** - Can manage only their own tasks.
- **Administrator** - Can manage all users and their tasks.

---

## 📌 Deploying MongoDB Atlas

1. Create a **free cluster** in [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Go to **Database Access** → Create a user.
3. In **Network Access** → Add `0.0.0.0/0`.
4. Copy the **MongoDB Connection String** and paste it into `.env`.

---

## 📌 Deploying on Render

1. **Connect the repository to Render**.
2. **Create a Web Service**:
   - Build Command: `npm install`
   - Start Command: `node app.js`
3. **Add environment variables (from `.env`)**.
4. **Start and test the API**!

---

## 📌 TODO (Additional Features)

✅ Data validation (`Joi`)
✅ Route protection (JWT + Middleware)
✅ Admin panel for user management

📌 **Author**: `Dmitriy Kairgeldin` | 🚀 2024
