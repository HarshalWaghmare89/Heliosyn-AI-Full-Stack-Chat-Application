# <img src="./client/src/assets/favicon.png" alt="Heliosyn AI Logo" width="45"> Heliosyn AI - Full Stack AI Chat Application

**Heliosyn AI** is a modern **full-stack AI conversational platform** that allows users to interact with **Google Gemini AI models** through a clean and responsive chat interface. Users can **create and manage conversations**, switch between available AI models, **share chats**, and work with **formatted AI responses**, while the platform provides **secure authentication**, **backend API integration**, and a **responsive user experience**.

---

## 📖 Table of Contents

- 🤖 [Overview](#overview)
- 🎥 [Demo Video](#demo-video)
- 🌐 [Live Demo](#live-demo)
- 🚀 [Features](#features)
- 🧠 [AI Models](#ai-models)
- 🔄 [How It Works](#how-it-works)
- 🛠️ [Tech Stack](#tech-stack)
- 📂 [Project Architecture](#project-architecture)
- 🔐 [Authentication & Security](#authentication--security)
- 🔌 [AI Integration](#ai-integration)
- 📝 [Response Formatting](#response-formatting)
- 🔗 [Chat Sharing](#chat-sharing)
- 📡 [API Endpoints](#api-endpoints)
- 🔧 [Local Setup for Developers](#local-setup-for-developers)
- 👨‍💻 [Developer](#developer)

---

# Overview

**Heliosyn AI** is a **full-stack AI conversational platform** that allows users to interact with **Google Gemini AI models** through a clean, responsive, and easy-to-use chat interface.

The platform supports **AI conversations**, **multiple Gemini models**, **chat history management**, **chat renaming, pinning, archiving, and deletion**, **temporary conversations**, and **conversation sharing**. AI responses can also be displayed with support for **formatted text, code, mathematics, and tables**, along with convenient features such as **copying responses**, **keyboard shortcuts**, and **automatic chat scrolling**.

Heliosyn AI also includes **secure authentication** using **JWT and HTTP-only cookies**, **email/password login**, and **Google OAuth**. The application uses a backend API to communicate with the Gemini API, keeping sensitive API credentials away from the frontend.

> 🤖 _Built with the **MERN stack and Google Gemini API**, Heliosyn AI demonstrates practical full-stack development, AI API integration, authentication, database management, responsive UI design, and real-world application architecture._

---

# Demo Video

#### 🎥 Explore Heliosyn AI in action: Coming soon

---

# Live Demo

#### 🌐 Access Heliosyn AI live here: [Visit Heliosyn AI]()

---

# Features

- 🤖 **AI-Powered Conversations**
  - Chat with Google Gemini AI models through a simple and responsive conversational interface.

- 🧠 **Multiple AI Models**
  - Choose between available Gemini models based on the type of task and required performance.

- 💬 **Chat Management**
  - Create, rename, pin, archive, and delete conversations to keep chat history organized.

- 🔗 **Chat Sharing**
  - Share conversations using shareable links so others can access the shared chat.

- 📝 **Formatted AI Responses**
  - Display Markdown, code blocks, mathematical expressions, and tables in a structured and readable format.

- 📋 **Copy AI Responses**
  - Easily copy AI-generated content, including formatted text and code.

- 🔐 **Secure Authentication**
  - Support email/password authentication and Google OAuth with JWT-based protected sessions.

- ⌨️ **Keyboard Shortcuts**
  - Use keyboard shortcuts for common actions and a faster chat experience.

- 📜 **Automatic Chat Scrolling**
  - Automatically keeps the latest messages and AI responses visible during conversations.

- 📱 **Responsive Interface**
  - Works across desktop, tablet, and mobile screen sizes with an adaptive user interface.

- ⚠️ **Error Handling**
  - Handles failed API requests, authentication errors, and other application errors with user-friendly feedback.

---

# AI Models

Heliosyn AI integrates with the **Google Gemini API** and currently provides multiple Gemini models so users can choose the model that best fits their conversation.

### Available Models

- ⚡ **gemini-3.5-flash**
  - Designed for fast and general-purpose AI conversations.

- 🚀 **gemini-3.6-flash**
  - Provides another model option for users with different task requirements.

- 💨 **gemini-3.5-flash-lite**
  - A lightweight option for faster and more efficient AI interactions.

### Model Selection

Users can select an available Gemini model from the **model selector** before sending messages. The selected model is then used by the backend when processing the AI request.

> 🧠 _Providing multiple models makes Heliosyn AI more flexible by allowing users to choose an AI model based on their task and response requirements._

---

# How It Works

Heliosyn AI follows a simple **frontend → backend → Gemini API → backend → frontend** flow for processing AI conversations.

### 🔄 AI Conversation Flow

1. **User sends a message**
   - The user enters a message in the chat interface and selects an available Gemini model.

2. **Frontend sends the request**
   - The React frontend sends the message and selected model information to the Heliosyn AI backend.

3. **Backend processes the request**
   - The backend receives the request, validates the required data, and prepares the AI request.

4. **Backend communicates with Gemini**
   - The backend sends the request to the selected **Google Gemini model** using the Gemini API.
   - The Gemini API key remains on the backend and is not exposed to the frontend.

5. **AI generates a response**
   - Gemini processes the user's message and returns the generated response to the backend.

6. **Backend returns the response**
   - The backend sends the AI response back to the frontend.

7. **Frontend formats the response**
   - The frontend processes the response and displays supported content such as text, Markdown, code, mathematics, and tables.

8. **Conversation is managed**
   - The conversation can be saved and managed through features such as rename, pin, archive, delete, temporary chats, and chat sharing.

### 🔗 Simplified Flow

```text
User
  ↓
React Frontend
  ↓
Node.js / Express Backend
  ↓
Google Gemini API
  ↓
AI Response
  ↓
Node.js / Express Backend
  ↓
React Frontend
  ↓
Formatted Chat Response

```

> 🤖 _The backend acts as the main communication layer between the frontend and Gemini, keeping API credentials protected while allowing the frontend to provide a smooth chat experience._

---

# Tech Stack

### 💻 Frontend

- **React.js**
  - Builds the interactive user interface and chat experience.

- **Vite**
  - Provides the frontend development server and production build system.

- **Tailwind CSS**
  - Provides utility-based styling for building the responsive UI.

- **React Router**
  - Handles client-side routing and navigation between application pages.

- **Axios**
  - Handles HTTP requests between the frontend and backend API.

- **React Helmet Async**
  - Manages page titles and document metadata.

- **Lucide React**
  - Provides icons used throughout the application interface.

- **React Markdown**
  - Renders AI responses that contain Markdown content.

- **React Syntax Highlighter**
  - Displays formatted source code inside AI responses.

- **KaTeX**
  - Renders mathematical expressions and formulas.

- **Remark GFM**
  - Adds GitHub-Flavored Markdown support.

- **Remark Math**
  - Enables mathematical expressions inside Markdown content.

- **Rehype KaTeX**
  - Converts mathematical expressions into rendered KaTeX output.

- **Rehype Raw**
  - Allows supported raw HTML content inside Markdown responses.

- **Copy to Clipboard**
  - Provides clipboard functionality for copying AI-generated content.

### 🖥 Backend

- **Node.js**
  - Provides the server-side JavaScript runtime.

- **Express.js**
  - Handles backend routing, middleware, and REST API endpoints.

- **Google GenAI SDK**
  - Connects the backend with Google Gemini AI models.

- **Axios**
  - Used where required for HTTP communication.

- **CORS**
  - Controls cross-origin communication between the frontend and backend.

- **Cookie Parser**
  - Parses cookies received with HTTP requests.

- **Morgan**
  - Logs HTTP requests during backend development and debugging.

- **Joi**
  - Validates incoming request data before processing it.

- **Dotenv**
  - Loads environment variables from the `.env` file.

### 🗄️ Database

- **MongoDB**
  - Stores users, conversations, messages, and related application data.

- **Mongoose**
  - Provides schemas, models, validation, and database interaction with MongoDB.

### 🔐 Authentication & Security

- **JWT**
  - Creates authentication tokens and protects authenticated API routes.

- **bcryptjs**
  - Hashes user passwords before storing them.

- **Google OAuth 2.0**
  - Allows users to authenticate using their Google account.

- **Passport.js**
  - Handles the Google OAuth authentication strategy.

- **Helmet**
  - Adds security-related HTTP headers to improve backend security.

---

# Project Architecture

> The project follows a modular architecture that keeps Heliosyn AI organized, maintainable, and easy to extend

```bash
Heliosyn-AI/
├── .gitignore
├── README.md
│
├── client/
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   │
│   ├── public/
│   │
│   └── src/
│       ├── main.jsx
│       │
│       ├── api/
│       │   ├── authApi.js
│       │   ├── axios.js
│       │   └── chatApi.js
│       │
│       ├── app/
│       │   ├── App.jsx
│       │   └── router.jsx
│       │
│       ├── assets/
│       │   ├── favicon.png
│       │   └── googlelogo.webp
│       │
│       ├── modules/
│       │   ├── auth/
│       │   │   └── AuthModal.jsx
│       │   │
│       │   └── chat/
│       │       ├── ChatBody.jsx
│       │       ├── ChatInput.jsx
│       │       └── components/
│       │           └── ChatEmptyState.jsx
│       │
│       ├── pages/
│       │   ├── ChatPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── OAuthSuccess.jsx
│       │   └── SharedChatPage.jsx
│       │
│       ├── services/
│       │   ├── authService.js
│       │   └── chatService.js
│       │
│       ├── shared/
│       │   ├── components/
│       │   │   ├── chat/
│       │   │   │   ├── ChatErrorMessage.jsx
│       │   │   │   ├── CodeBlock.jsx
│       │   │   │   ├── CopyButton.jsx
│       │   │   │   ├── CopyMessageButton.jsx
│       │   │   │   ├── HeaderAlert.jsx
│       │   │   │   ├── MarkdownRenderer.jsx
│       │   │   │   ├── MathRenderer.jsx
│       │   │   │   ├── MessageBubble.jsx
│       │   │   │   ├── MessageRenderer.jsx
│       │   │   │   ├── TableRenderer.jsx
│       │   │   │   └── ThinkingAnimation.jsx
│       │   │   │
│       │   │   ├── header/
│       │   │   │   └── Header.jsx
│       │   │   │
│       │   │   ├── popups/
│       │   │   │   ├── DeleteChatPopup.jsx
│       │   │   │   ├── LogoutConfirmPopup.jsx
│       │   │   │   ├── PinLimitPopup.jsx
│       │   │   │   └── ShareChatPopup.jsx
│       │   │   │
│       │   │   ├── shortcuts/
│       │   │   │   └── KeyboardShortcutsModal.jsx
│       │   │   │
│       │   │   └── sidebar/
│       │   │       ├── ChatHistory.jsx
│       │   │       ├── Logo.jsx
│       │   │       ├── NewChatButton.jsx
│       │   │       ├── PinnedChats.jsx
│       │   │       ├── PinnedChatsCard.jsx
│       │   │       ├── ProfileCard.jsx
│       │   │       ├── RecentChatsCard.jsx
│       │   │       ├── SearchBox.jsx
│       │   │       ├── Sidebar.jsx
│       │   │       ├── SidebarFooter.jsx
│       │   │       │
│       │   │       └── components/
│       │   │           ├── chat/
│       │   │           │   ├── ChatCard.jsx
│       │   │           │   ├── ChatContextMenu.jsx
│       │   │           │   └── ChatSection.jsx
│       │   │           │
│       │   │           ├── search/
│       │   │           │   ├── SearchChatHistory.jsx
│       │   │           │   ├── SearchChatItem.jsx
│       │   │           │   ├── SearchInput.jsx
│       │   │           │   ├── SearchModal.jsx
│       │   │           │   └── SearchNewChatButton.jsx
│       │   │           │
│       │   │           └── settings/
│       │   │               ├── SettingsContent.jsx
│       │   │               ├── SettingsModal.jsx
│       │   │               ├── SettingsSidebar.jsx
│       │   │               │
│       │   │               └── sections/
│       │   │                   ├── AboutSettings.jsx
│       │   │                   ├── ArchivedChatsSettings.jsx
│       │   │                   └── FAQSettings.jsx
│       │   │
│       │   ├── context/
│       │   │   ├── AuthContext.jsx
│       │   │   └── ChatContext.jsx
│       │   │
│       │   ├── formatters/
│       │   │   ├── chatFormatter.js
│       │   │   ├── markdownComponents.jsx
│       │   │   ├── markdownPlugins.js
│       │   │   └── syntaxHighlight.js
│       │   │
│       │   └── layouts/
│       │       └── MainLayout.jsx
│       │
│       └── styles/
│           ├── globals.css
│           └── markdown.css
│
└── server/
    ├── .env
    ├── package-lock.json
    ├── package.json
    │
    └── src/
        ├── app.js
        ├── server.js
        │
        ├── config/
        │   ├── ai.js
        │   ├── db.js
        │   ├── passport.js
        │   └── usageLimits.js
        │
        ├── controllers/
        │   ├── authController.js
        │   ├── chatController.js
        │   └── sharedChatController.js
        │
        ├── middleware/
        │   ├── authMiddleware.js
        │   └── validate.js
        │
        ├── models/
        │   ├── Chat.js
        │   └── User.js
        │
        ├── routes/
        │   ├── authRoutes.js
        │   ├── chatRoutes.js
        │   └── sharedChatRouter.js
        │
        ├── services/
        │   └── geminiService.js
        │
        ├── utils/
        │   └── token.js
        │
        └── validators/
            └── authValidator.js
```

---

# Authentication & Security

Heliosyn AI uses a combination of **authentication, authorization, request validation, secure password handling, and backend-protected API integrations** to keep user accounts and application data secure.

### 🔐 Authentication

- **JWT Authentication**
  - JSON Web Tokens are used to authenticate users and protect authenticated API requests.

- **Google OAuth 2.0**
  - Users can authenticate using their Google account through Passport and the Google OAuth 2.0 strategy.

- **Password Hashing**
  - User passwords are securely hashed using **bcryptjs** before being stored in the database.
  - Plain-text passwords are never stored directly.

- **Protected Routes**
  - Authentication middleware verifies the user's identity before allowing access to protected backend resources.

### 🛡️ Backend Security

- **Helmet**
  - Adds security-related HTTP headers to help protect the application against common web vulnerabilities.

- **CORS**
  - Cross-Origin Resource Sharing is configured to control which frontend applications can communicate with the backend API.

- **Joi Validation**
  - Incoming request data is validated using Joi schemas before it is processed by the application.

- **Environment Variables**
  - Sensitive configuration such as authentication secrets, database credentials, and AI API keys are stored in environment variables instead of being exposed in the source code.

### 🤖 AI API Protection

The Gemini API is accessed through the **backend server** rather than directly from the frontend.

```text
Frontend
   │
   │ User prompt
   ▼
Backend API
   │
   │ Protected API request
   ▼
Google Gemini API
   │
   │ AI response
   ▼
Backend API
   │
   ▼
Frontend

```

---

# AI Integration

Heliosyn AI integrates **Google Gemini** to provide AI-powered responses through a secure backend-based architecture.

The application does not expose the Gemini API directly to the frontend. Instead, the **React frontend communicates with the Express backend**, and the backend handles communication with Gemini.

## 🤖 Gemini API Integration

The application uses Google's **Gemini API** through the official `@google/genai` SDK.

The AI request flow is:

```text
User
 │
 │ Enters prompt
 ▼
React Frontend
 │
 │ Axios API Request
 ▼
Express Backend
 │
 │ Gemini API Request
 ▼
Google Gemini
 │
 │ Generated Response
 ▼
Express Backend
 │
 │ API Response
 ▼
React Frontend
 │
 ▼
Chat Interface
```

## 🧠 AI Response Generation

The backend is responsible for:

- Receiving the user's prompt from the frontend.
- Validating the incoming request.
- Sending the prompt to the configured Gemini model.
- Receiving and processing the Gemini response.
- Returning the generated response to the frontend.
- Handling unsuccessful Gemini API requests and errors.
- Keeping Gemini API credentials on the server.

> 🤖 The **backend acts as the main communication layer between the frontend and Gemini**, keeping API credentials protected while allowing the frontend to provide a smooth chat experience.

## 🔑 API Key Protection

The Gemini API key is stored as a **server-side environment variable** and is never placed directly inside the React application.

```env
GEMINI_API_KEY=your-gemini-api-key
```

> 🔒 Keeping Gemini communication on the backend prevents the API key from being exposed through the browser or client-side source code.

## 💬 Frontend and Backend Communication

The React frontend communicates with the backend using **Axios**.

The responsibilities are separated as follows:

- **Frontend** → Chat interface, user interaction, and API requests
- **Backend** → Request handling, validation, authentication, and Gemini communication
- **Gemini** → AI response generation
- **MongoDB** → Persistent application data

This separation keeps the AI integration secure, maintainable, and easier to extend.

## 📦 AI Integration Dependencies

The main technologies involved in the AI integration are:

- **`@google/genai`**
  - Official Google GenAI SDK used to communicate with Gemini.

- **Axios**
  - Used by the frontend to communicate with the backend API.

- **Express.js**
  - Provides the backend API layer that handles AI requests.

- **dotenv**
  - Loads the Gemini API key and other server-side configuration from environment variables.

## ⚠️ AI Error Handling

AI requests are handled through the backend so that API failures can be processed before a response is returned to the frontend.

```text
Frontend Request
       │
       ▼
Backend Validation
       │
       ├── Invalid Request ──► Error Response
       │
       ▼
Gemini API Request
       │
       ├── API Failure ──────► Error Handling
       │
       ▼
Generated AI Response
       │
       ▼
Frontend Chat Interface
```

This approach keeps Gemini communication centralized on the backend and prevents internal API details and credentials from being exposed directly to the client.

---

# Response Formatting

Heliosyn AI formats generated Gemini responses before displaying them in the chat interface, making AI output easier to read and understand.

Instead of displaying the generated response as plain text, the frontend supports structured content such as **headings, paragraphs, lists, code blocks, inline code, mathematical expressions, and formatted text**.

## 📝 Markdown Support

AI responses are rendered using **Markdown**, allowing Gemini to return structured and readable content.

The application supports common Markdown elements such as:

- Headings
- Paragraphs
- Bold and italic text
- Ordered and unordered lists
- Blockquotes
- Links
- Inline code
- Code blocks
- Tables where supported by the response

## 💻 Code Formatting

Code blocks generated by the AI are displayed separately from normal text and use **syntax highlighting** to improve readability.

The frontend uses **`react-syntax-highlighter`** to highlight supported programming languages.

For example:

```js
const message = "Hello, World!";
console.log(message);
```

This makes programming-related responses easier to read and understand.

## 🧮 Mathematical Expressions

Heliosyn AI also supports mathematical expressions in AI responses.

The frontend uses:

- **KaTeX** for mathematical rendering
- **`remark-math`** for detecting mathematical expressions
- **`rehype-katex`** for converting supported expressions into formatted mathematical notation

For example:

```text
E = mc^2
```

can be rendered as a properly formatted mathematical expression in the chat interface.

## 🔤 Rich Text Rendering

The frontend uses **`react-markdown`** to convert Markdown responses into React-rendered content.

Additional Markdown processing is handled through:

- **`remark-gfm`** for GitHub-Flavored Markdown features.
- **`remark-math`** for mathematical expressions.
- **`rehype-katex`** for mathematical rendering.
- **`rehype-raw`** for handling supported HTML content within Markdown.

## 🎯 Purpose of Response Formatting

The response formatting system ensures that AI-generated content is:

- Easy to read
- Properly structured
- Suitable for technical explanations
- Easier to understand when code is included
- More readable when mathematical expressions are present
- Consistent with the overall chat interface

> 📝 **Response formatting is handled on the frontend after the AI response is received from the backend, keeping AI generation and presentation responsibilities separated.**

---

# Chat Sharing

Heliosyn AI allows users to **share individual conversations** through a public share link. This makes it possible to share an AI conversation with others without exposing the user's private chat interface or requiring the viewer to be authenticated.

## 🔗 Creating a Share Link

A user can share a chat directly from the chat interface.

When the user chooses to share a conversation:

1. The frontend sends a share request to the backend.
2. The backend generates a unique `shareId` for the chat.
3. The chat is marked as shared.
4. The generated share identifier is returned to the frontend.
5. The frontend can use the share identifier to access the public conversation.

The backend generates the identifier using Node.js `crypto` functionality, ensuring that each shared conversation receives a unique identifier.

## 🌐 Public Shared Chat

Shared conversations can be viewed through a dedicated public API endpoint:

```http
GET /api/shared/:shareId
```

The public endpoint retrieves a conversation only when:

- The provided `shareId` matches an existing shared conversation.
- The conversation has `isShared: true`.
- The conversation has not been deleted.

This allows shared conversations to be accessed without requiring the viewer to log in.

## 🔄 Chat Sharing Flow

```text
Authenticated User
        │
        │ Share Chat
        ▼
React Frontend
        │
        │ POST /api/chats/:chatId/share
        ▼
Express Backend
        │
        │ Generate / Reuse shareId
        ▼
Chat Document
        │
        │ isShared = true
        ▼
Share Link
        │
        ▼
Public Viewer
        │
        │ GET /api/shared/:shareId
        ▼
Shared Chat
```

## 🔐 Sharing and Privacy

Chat sharing is separated from private chat access.

Private chat operations remain protected by authentication, while the shared-chat endpoint is specifically designed for public access using the generated `shareId`.

The backend also verifies that the shared conversation:

- Exists in the database.
- Is explicitly marked as shared.
- Has not been deleted.

> 🔒 A conversation is not publicly accessible simply because its chat ID is known. Public access is handled through a dedicated `shareId` and sharing state.

## 📡 Chat Sharing Endpoints

| Method | Endpoint                   | Authentication | Description                                               |
| ------ | -------------------------- | -------------- | --------------------------------------------------------- |
| `POST` | `/api/chats/:chatId/share` | Required       | Creates or reuses a share ID for a user's chat.           |
| `GET`  | `/api/shared/:shareId`     | Not required   | Retrieves a conversation that has been explicitly shared. |

## 🗄️ Shared Chat Data

The chat document stores the information required to control public sharing, including:

- `shareId` — Unique identifier used in the public share URL.
- `isShared` — Determines whether the conversation is publicly accessible.
- `isDeleted` — Prevents deleted conversations from being exposed through the public sharing endpoint.

This approach keeps the sharing mechanism simple while allowing the application to control whether a conversation is publicly available.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint                    | Description                                |
| ------ | --------------------------- | ------------------------------------------ |
| POST   | `/api/auth/register`        | Register a new user                        |
| POST   | `/api/auth/login`           | Authenticate an existing user              |
| GET    | `/api/auth/me`              | Get the currently authenticated user       |
| POST   | `/api/auth/logout`          | Log out the current user                   |
| GET    | `/api/auth/google`          | Start Google OAuth authentication          |
| GET    | `/api/auth/google/callback` | Handle Google OAuth callback               |
| GET    | `/api/auth/google/failure`  | Handle Google OAuth authentication failure |

---

### Chats

> 🔐 All chat management routes require authentication.

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| POST   | `/api/chats`                  | Create a new chat                          |
| GET    | `/api/chats`                  | Get all chats for the authenticated user   |
| GET    | `/api/chats/search`           | Search the user's chats                    |
| GET    | `/api/chats/:chatId`          | Get a specific chat                        |
| PATCH  | `/api/chats/:chatId/rename`   | Rename a chat                              |
| PATCH  | `/api/chats/:chatId/pin`      | Pin or unpin a chat                        |
| PATCH  | `/api/chats/:chatId/archive`  | Archive or unarchive a chat                |
| POST   | `/api/chats/:chatId/share`    | Create a shareable link for a chat         |
| POST   | `/api/chats/:chatId/messages` | Send a message and generate an AI response |
| DELETE | `/api/chats/:chatId`          | Delete a chat                              |

---

### Shared Chats

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/shared/:shareId` | Access a publicly shared chat |

<br>

> All API routes were tested using **Thunder Client**.

---

# Local Setup for Developers

#### To set up Heliosyn AI locally, follow these steps:

1. Fork the repository on GitHub and clone it

   ```bash
   git clone <your-forked-repo-url>
   ```

2. Install backend dependencies

   ```bash
   cd backend
   ```

   ```bash
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd frontend
   ```

   ```bash
   npm install
   ```

4. Set up environment variables

Create a `.env` file inside the **backend** folder and add:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your-mongodb-connection-string

GEMINI_API_KEY=your-gemini-api-key

JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> `JWT_SECRET` can be any random string used to sign authentication tokens.

Create a `.env` file inside the **frontend** folder and add:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> This connects the frontend to your local backend server.

5. Start the development servers

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

> Both servers run in development mode. The frontend port may vary depending on your system.

6. Visit the application

Open the URL displayed in the terminal (usually `http://localhost:5173`) in your browser to use the frontend.

---

# Developer

| Developed by         | LinkedIn                                                 | GitHub                                         |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| **Harshal Waghmare** | [LinkedIn](https://www.linkedin.com/in/harshalwaghmare/) | [GitHub](https://github.com/harshalWaghmare89) |
