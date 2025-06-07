# 🏷️ Salon Management System

A comprehensive salon management system with admin panel, appointment booking, and customer management.

## 🚀 Features

- **Admin Dashboard** - Manage appointments, services, staff, and customers
- **User Management** - Handle customer and staff accounts
- **Appointment Booking** - Online booking system with real-time availability
- **Service Management** - Add, edit, and manage salon services
- **Responsive Design** - Works on desktop and mobile devices
- **Secure Authentication** - JWT-based authentication with role-based access

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL / SQLite (development)
- **Authentication**: JWT
- **Deployment**: Docker (coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- PostgreSQL (for production) or SQLite (for development)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/salone.git
   cd salone
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp .env.example .env
   
   # Edit the .env file with your configuration
   # nano .env
   ```

4. **Set up admin credentials**
   Create a `server/admin-credentials.json` file:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "ChangeMe123!",
     "role": "superadmin"
   }
   ```

5. **Run the setup script**
   ```bash
   # From the project root
   cd server
   npm run setup
   ```
   This will:
   - Install all dependencies
   - Set up the database
   - Create admin user
   - Start both frontend and backend servers

## 🏗️ Project Structure

```
salone/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── App.tsx         # Main app component
│
├── server/                # Backend Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   └── index.js            # Application entry point
│
├── .env.example          # Example environment variables
└── README.md              # This file
```

## 🎨 Available Scripts

### Server
- `npm run dev` - Start development server with hot-reload
- `npm start` - Start production server
- `npm run setup` - Run initial setup
- `npm run create-admin` - Create a new admin user
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database with test data

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Authentication

- Admin: `/admin` - Full access to all features
- Staff: `/staff` - Limited access to appointments and customers
- Customers: `/` - Book and manage appointments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Your Name]
- Icons by [Tabler Icons](https://tabler-icons.io/)
- UI Components by [Headless UI](https://headlessui.com/)
