import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import App from './App'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Progress from './pages/Progress'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import TutorAnalytics from './pages/TutorAnalytics'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'lessons', element: <Lessons /> },
      { path: 'progress', element: <Progress /> },
      { path: 'chat', element: <Chat /> },
      { path: 'settings', element: <Settings /> },
      { path: 'tutor-analytics', element: <TutorAnalytics /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
