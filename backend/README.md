# HarvestHub Backend API

## Overview

HarvestHub is a comprehensive grocery store backend API built with Node.js, Express.js, and MongoDB. It provides a complete e-commerce solution with authentication, product management, order processing, and payment integration.

## Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (User, Admin)
- Email verification system
- Password reset functionality
- Account lockout protection
- Rate limiting for security

### 👥 User Management

- User registration and login
- Profile management
- Address management
- Password update
- Account activation/deactivation

### 🛍️ Product Management

- Product CRUD operations
- Category and subcategory management
- Product search and filtering
- Product reviews and ratings
- Inventory management
- Featured products

### 📦 Order Management (Structure Created)

- Order creation and management
- Order status tracking
- Order history
- Order cancellation

### 💳 Payment Integration

- Razorpay integration (Indian market)
- Stripe integration (International)
- Cash on Delivery (COD)
- Payment verification
- Refund management

### 📧 Email System

- Welcome emails
- Email verification
- Password reset emails
- Order notifications
- Custom email templates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Handlebars templates
- **Payment**: Stripe, Razorpay
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs
- **Validation**: Express Validator
- **File Upload**: Multer (configured)
- **Documentation**: This README

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── auth.js              # Authentication controllers
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User model with authentication
│   ├── Product.js           # Product model with reviews
│   └── Category.js          # Category model with hierarchy
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── products.js          # Product routes
│   ├── categories.js        # Category routes
│   ├── orders.js            # Order routes (structure)
│   └── payments.js          # Payment routes
├── utils/
│   ├── asyncHandler.js      # Async error handling
│   ├── email.js             # Email utility functions
│   └── validation.js        # Input validation schemas
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies and scripts
└── server.js                # Main server file
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Grocery_store1/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/harvesthub

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your cloud database.

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /register           # User registration
POST   /login              # User login
POST   /logout             # User logout
GET    /me                 # Get current user
POST   /forgot-password    # Forgot password
PUT    /reset-password/:token # Reset password
PUT    /update-password    # Update password
GET    /verify-email/:token # Verify email
POST   /resend-verification # Resend verification email
POST   /refresh-token      # Refresh JWT token
```

### User Routes (`/api/users`)

```
GET    /                   # Get all users (Admin)
GET    /:id                # Get single user
PUT    /:id                # Update user profile
DELETE /:id                # Delete user (Admin)
POST   /:id/addresses      # Add user address
PUT    /:id/addresses/:addressId # Update address
DELETE /:id/addresses/:addressId # Delete address
GET    /:id/orders         # Get user orders
GET    /admin/stats        # User statistics (Admin)
```

### Product Routes (`/api/products`)

```
GET    /                   # Get all products
GET    /featured           # Get featured products
GET    /trending           # Get trending products
GET    /:id                # Get single product
POST   /                   # Create product (Admin)
PUT    /:id                # Update product (Admin)
DELETE /:id                # Delete product (Admin)
POST   /:id/reviews        # Add product review
PUT    /:id/reviews/:reviewId # Update review
DELETE /:id/reviews/:reviewId # Delete review
GET    /admin/stats        # Product statistics (Admin)
```

### Category Routes (`/api/categories`)

```
GET    /                   # Get all categories
GET    /main               # Get main categories
GET    /:id/subcategories  # Get subcategories
GET    /:id                # Get single category
POST   /                   # Create category (Admin)
PUT    /:id                # Update category (Admin)
DELETE /:id                # Delete category (Admin)
PUT    /reorder            # Reorder categories (Admin)
GET    /admin/tree         # Get category tree
GET    /admin/stats        # Category statistics (Admin)
```

### Payment Routes (`/api/payments`)

```
POST   /razorpay/create-order    # Create Razorpay order
POST   /razorpay/verify          # Verify Razorpay payment
POST   /stripe/create-intent     # Create Stripe payment intent
POST   /stripe/confirm           # Confirm Stripe payment
POST   /cod/confirm              # Confirm COD order
GET    /history                  # Payment history
POST   /refund                   # Process refund (Admin)
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configured for frontend domains
- **Helmet Security**: Sets various HTTP headers
- **Account Lockout**: Prevents multiple failed login attempts
- **Email Verification**: Ensures valid user emails

## Error Handling

- Global error handling middleware
- Consistent error response format
- Validation error formatting
- Development vs production error details
- 404 handler for undefined routes

## Development Features

- **Nodemon**: Auto-restart on file changes
- **Morgan**: HTTP request logging
- **Environment-based**: Different configs for dev/prod
- **Compression**: Response compression for performance

## Testing

The project structure supports testing with:

- Jest for unit testing
- Supertest for API testing

```bash
npm test
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/harvesthub
JWT_SECRET=your-production-jwt-secret
# ... other production configurations
```

### Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## API Documentation

For detailed API documentation, run the server and visit:

- Health Check: `http://localhost:5000/health`
- API Base: `http://localhost:5000/api`

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.
