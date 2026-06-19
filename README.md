<div align="center">

<h1>🧠 CogniSphere</h1>

<p><strong>AI-Powered Personal Tutor Dashboard</strong></p>

<p>
  <a href="https://github.com/PJain7988/CogniSphere_-AI_Personal_Tutor_Dashboard">
    <img src="https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge" alt="Version" />
  </a>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge" alt="License" />
</p>

<p>
  A production-ready, fully responsive AI tutor dashboard built with React, TypeScript, and Tailwind CSS.
  Features an intelligent chat interface, lesson management, learning analytics, and granular user settings — all in one cohesive UI.
</p>

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Home Dashboard** | At-a-glance overview of progress, upcoming lessons, and recent activity |
| 📚 **Lessons** | Browse, filter, and track interactive learning modules by subject |
| 📊 **Progress Tracker** | Visual charts powered by Recharts showing streaks, mastery, and time-spent |
| 💬 **AI Chat** | Simulated AI tutor responses with message history and smooth animations |
| 📈 **Tutor Analytics** | Deep-dive analytics for tutors — student performance, engagement metrics |
| ⚙️ **Settings** | Profile management, notification preferences, and theme configuration |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **TypeScript 5** | Type-safe development |
| **Vite 5** | Lightning-fast dev server & bundler |
| **Tailwind CSS 3** | Utility-first styling with responsive & accessible focus states |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **Recharts** | Composable chart library for analytics pages |
| **React Router v6** | Client-side routing |
| **Lucide React** | Consistent, accessible icon set |
| **clsx** | Conditional class name utility |

---

## 📁 Project Structure

```
CogniSphere/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI component library
│   │   ├── Badge.tsx        # Status badge component
│   │   ├── Button.tsx       # Primary/secondary button variants
│   │   ├── Card.tsx         # Content card wrapper
│   │   ├── ChatBubble.tsx   # AI & user message bubbles
│   │   ├── ChatInput.tsx    # Chat input with send action
│   │   ├── Input.tsx        # Form input component
│   │   └── ProgressCharts.tsx  # Recharts-based chart components
│   ├── pages/               # Route-level page components
│   │   ├── Home.tsx         # Dashboard home page
│   │   ├── Lessons.tsx      # Lessons browser & tracker
│   │   ├── Progress.tsx     # Learning progress analytics
│   │   ├── Chat.tsx         # AI chat interface
│   │   ├── Settings.tsx     # User settings panel
│   │   └── TutorAnalytics.tsx  # Advanced tutor analytics
│   ├── lib/
│   │   └── mock.ts          # Demo/mock data for prototyping
│   ├── styles.css           # Tailwind layers, design tokens & global styles
│   ├── App.tsx              # Root app with router & layout
│   └── main.tsx             # Application entry point
├── index.html               # HTML entry point
├── tailwind.config.js       # Tailwind configuration & theme extensions
├── tsconfig.json            # TypeScript compiler options
├── vite.config.ts           # Vite build configuration
└── package.json             # Project metadata & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or `pnpm` / `yarn`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PJain7988/CogniSphere_-AI_Personal_Tutor_Dashboard.git
cd CogniSphere

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Dashboard overview with stats and quick actions |
| `/lessons` | Lessons | Lesson catalogue with filters and progress tracking |
| `/progress` | Progress | Learning analytics with charts and streaks |
| `/chat` | AI Chat | Conversational AI tutor interface |
| `/analytics` | Tutor Analytics | Advanced performance and engagement metrics |
| `/settings` | Settings | Profile, notifications, and preferences |

---

## 🔌 API Integration

The current build uses **mock data** (`src/lib/mock.ts`) and **simulated AI responses** (`Chat.tsx`) for demonstration purposes.

To connect a real backend:

1. Replace mock imports in each page with your API service layer.
2. Implement actual AI API calls (e.g., OpenAI, Gemini) in `Chat.tsx`.
3. Add environment variables via a `.env` file:

```env
VITE_API_BASE_URL=https://your-api.example.com
VITE_AI_API_KEY=your_key_here
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feat/your-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using React, TypeScript & Tailwind CSS</p>
  <p>
    <a href="https://github.com/PJain7988/CogniSphere_-AI_Personal_Tutor_Dashboard">⭐ Star this repo if you find it useful!</a>
  </p>
</div>
