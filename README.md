# 🛒 HarvestHub - Modern Grocery Store

![HarvestHub Preview](https://placehold.co/1200x400/10b981/ffffff?text=HarvestHub+-+Fresh+Groceries+Delivered)

**HarvestHub** is a premium, full-stack e-commerce web application designed for online grocery shopping. Built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled with modern Tailwind CSS, it offers a beautifully responsive user interface, robust state management, and seamless deployment on Vercel.

---

## 🔗 Live Demo
**Production URL:** [https://grocery-store-mw3h97l65-terukotinaveen-4272s-projects.vercel.app](https://grocery-store-mw3h97l65-terukotinaveen-4272s-projects.vercel.app)

*(You can update this link if you add a custom domain in Vercel).*

---

## ✨ Features

- **🛍️ Massive Product Catalog:** Over 100+ distinct products across 8 categories (Fruits, Dairy, Bakery, Beverages, Meat, Seafood, etc.) featuring high-quality images.
- **🔐 Secure Authentication:** JWT-based user authentication (Login/Register) with secure, encrypted password hashing.
- **🛒 Shopping Cart & Checkout:** Real-time cart management, dynamic price calculation, and integrated checkout flows.
- **💳 Payment Integration:** Setup for multiple payment gateways including Razorpay, Stripe, and Cash on Delivery (COD).
- **📦 Order Management:** Complete order tracking from placement to delivery, including stock management updates in the database.
- **🎨 Premium Dark/Light Mode:** A sleek, togglable dark mode UI tailored for modern user experiences using Tailwind CSS.
- **📱 Fully Responsive:** Mobile-first design that looks stunning on desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Headless UI / Heroicons
- **Routing:** React Router v6
- **Deployment:** Vercel (Serverless Edge)

### Backend
- **Server:** Node.js & Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Deployment:** Vercel Serverless Functions (`/api/*`)

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster.

### 2. Clone the Repository
```bash
git clone https://github.com/TNaveen-24/HarvestHub-Grocery-Store.git
cd HarvestHub-Grocery-Store
```

### 3. Install Dependencies
The project is split into a frontend and a backend. You need to install dependencies for both.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 4. Environment Variables
Create a `.env` file inside the `backend` folder and add the following keys:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/harvesthub
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:5173
```
*(Make sure to replace the `<your-username>` and `<your-password>` with your actual MongoDB credentials).*

### 5. Seed the Database
To populate your MongoDB database with the 100+ starter products and categories, run the seed script:
```bash
cd backend
node seedProducts.js
```

### 6. Run the Application

**Start the Backend Server:**
```bash
cd backend
npm run dev
```

**Start the Frontend Client:**
Open a new terminal window/tab:
```bash
cd frontend
npm run dev
```

The application will now be running on `http://localhost:5173`.

---

## ☁️ Deployment

This project is configured to be seamlessly deployed on **Vercel** as a monorepo.
The `vercel.json` file handles routing all `/api/*` requests to the Express backend serverless functions, while serving the Vite React frontend statically.

To deploy your own version:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Dashboard, ensure the Root Directory is set to the main folder.
3. Add your `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV=production` in the Vercel **Environment Variables** settings.
4. Click **Deploy**.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/TNaveen-24/HarvestHub-Grocery-Store/issues).

## 📝 License
This project is licensed under the MIT License.
