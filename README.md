 # 🚀 SaaS Base AI - AI-Powered Task Management

A modern, full-stack task management application powered by AI. Built with Next.js, MongoDB, and OpenRouter's free AI models.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple)

## ✨ Features

### 🤖 AI-Powered Features
- **AI Task Suggestions**: Get intelligent subtask breakdowns, time estimates, and productivity tips
- **AI Chat Assistant**: Real-time help and advice from AI assistant
- **Multiple AI Models**: Automatic fallback between free AI models (Gemini, Llama, Mistral)

### 📋 Task Management
- Create, edit, and delete tasks
- Set priority levels (Low, Medium, High)
- Track task status (To Do, In Progress, Done)
- Interactive todo lists with checkboxes
- AI-generated subtasks with progress tracking

### 📁 Project Organization
- Create projects with custom colors
- Organize tasks by projects
- Task count per project
- Simple project management

### 📊 Dashboard
- Real-time statistics (Total tasks, Completed, AI-powered)
- Recent tasks overview
- Project summaries
- Quick action buttons

### ⚙️ User Management
- Secure authentication (NextAuth)
- User profile and settings
- Sign in/Sign up functionality

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **NextAuth** - Authentication

### AI Integration
- **OpenRouter** - Free AI model access
- **Google Gemini 2.0** - Primary AI model
- **Meta Llama 3.2** - Backup model
- **Mistral 7B** - Additional fallback

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key (free)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/saas-base-ai.git
cd saas-base-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# OpenRouter AI (FREE)
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Getting API Keys

### MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add to `.env.local` as `MONGODB_URI`

### OpenRouter (FREE AI)
1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up for free
3. Get your API key from Settings
4. Add to `.env.local` as `OPENROUTER_API_KEY`

### NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

## 📁 Project Structure

```
saas-base-ai/
├── app/
│   ├── api/              # API routes
│   │   ├── ai/           # AI endpoints
│   │   ├── tasks/        # Task CRUD
│   │   └── projects/     # Project CRUD
│   ├── dashboard/        # Main dashboard
│   ├── tasks/            # Tasks page
│   ├── projects/         # Projects page
│   ├── aiassistant/      # AI chat page
│   ├── settings/         # User settings
│   └── page.tsx          # Landing page
├── components/
│   ├── tasks/            # Task components
│   ├── projects/         # Project components
│   ├── settings/         # Settings components
│   ├── landing/          # Landing page components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # NextAuth config
│   └── db.ts             # MongoDB connection
├── types/
│   └── index.ts          # TypeScript types
└── README.md
```

## 🎯 Key Features Explained

### AI Task Suggestions
When creating a task, click "Get Suggestions" to receive:
- 3-5 actionable subtasks
- Estimated completion time
- Priority recommendation
- Helpful productivity tips

### AI Chat Assistant
Navigate to `/aiassistant` to:
- Ask questions about task management
- Get productivity advice
- Receive personalized recommendations
- Chat in real-time with AI

### Multiple AI Model Fallback
The app automatically tries multiple free AI models:
1. Google Gemini 2.0 Flash (primary)
2. Google Gemini Flash 1.5 8B (backup)
3. Meta Llama 3.2 3B (fallback)
4. Local fallback suggestions (if all fail)

### Environment Variables on Vercel
Add these in your Vercel project settings:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `OPENROUTER_API_KEY`

## 📸 Screenshots

### Landing Page
Beautiful hero section with AI-powered features showcase

### Dashboard
Real-time statistics and task overview

### AI Task Suggestions
Intelligent task breakdown with subtasks and tips

### AI Chat Assistant
Interactive chat interface with AI assistant

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Most Rozena Akter**
- GitHub: https://github.com/rozenaakter
- LinkedIn:https://www.linkedin.com/in/most-rozena-akter/
- Email: 90rozena@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [OpenRouter](https://openrouter.ai/) - Free AI model access
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting platform

---

⭐ If you found this project helpful, please consider giving it a star!

Made with ❤️ and ☕