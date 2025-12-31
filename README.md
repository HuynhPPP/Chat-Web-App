# 💬 Chat App

A modern, real-time chat application built with React, Node.js, Socket.IO, and MongoDB. Features include instant messaging, friend management, online status tracking, and a beautiful, responsive UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)

## ✨ Features

- 🔐 **Authentication & Authorization**

  - Secure user registration and login
  - JWT-based authentication
  - Protected routes and API endpoints

- 💬 **Real-time Messaging**

  - Instant message delivery using Socket.IO
  - Message read/seen status
  - Typing indicators
  - Message timestamps with localization

- 👥 **Friend Management**

  - Search users by username
  - Send and receive friend requests
  - Accept or decline friend requests
  - View friends list

- 🟢 **Online Status**

  - Real-time online/offline status
  - Last seen timestamps
  - Active user indicators

- 🎨 **Modern UI/UX**

  - Clean and intuitive interface
  - Responsive design for all devices
  - Dark mode support
  - Smooth animations and transitions
  - Emoji picker integration
  - Custom scrollbar styling

- 📱 **Conversation Management**
  - Create and manage conversations
  - Infinite scroll for message history
  - Auto-scroll to latest messages
  - Message grouping by date

## 🚀 Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Emoji Mart** - Emoji picker

### Backend

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Swagger** - API documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
PORT=8989
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
VITE_API_URL=http://localhost:8989/api
VITE_SOCKET_URL=http://localhost:8989
```

### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8989
- **API Documentation:** http://localhost:8989/api/api-docs

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Custom middlewares
│   │   ├── socket/           # Socket.IO configuration
│   │   ├── libs/             # Database connection
│   │   ├── utils/            # Utility functions
│   │   ├── swagger.json      # API documentation
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── chat/         # Chat-related components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   └── AddFriendModel/ # Friend request components
│   │   ├── services/         # API service layer
│   │   ├── stores/           # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user

### User

- `GET /api/user/me` - Get current user
- `GET /api/user/search` - Search users by username

### Friends

- `POST /api/friends/requests` - Send friend request
- `GET /api/friends/requests` - Get friend requests (sent & received)
- `PUT /api/friends/requests/:requestId/accept` - Accept friend request
- `DELETE /api/friends/requests/:requestId/decline` - Decline friend request
- `GET /api/friends` - Get all friends

### Messages

- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages by conversation
- `PUT /api/messages/:messageId/seen` - Mark message as seen

### Conversations

- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:conversationId` - Get conversation by ID

## 🎯 Usage

1. **Register/Login:** Create a new account or login with existing credentials
2. **Add Friends:** Search for users by username and send friend requests
3. **Start Chatting:** Select a friend from your list and start messaging
4. **Real-time Updates:** Receive messages instantly with online status indicators

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- Protected API routes
- CORS configuration
- Input validation with Zod

## 🎨 UI Components

Built with Radix UI primitives for accessibility:

- Dialog/Modal
- Dropdown Menu
- Avatar
- Tooltip
- Popover
- Switch
- Label
- Separator

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Socket.IO](https://socket.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

⭐ If you found this project helpful, please give it a star!
