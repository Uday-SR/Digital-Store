import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthForum from './components/AuthForum.jsx';
import SignIn from './components/SignIn.jsx';
import UserDash from './components/UserDash.jsx';
import AdminDash from './components/AdminDash.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {path:"/", element: <App/>},
  {path:"/AuthForum", element: <AuthForum/>},
  {path:"/AuthForum/signin", element: <SignIn/>},
  {path:"/UserDash", element: <UserDash/>},
  {path:"/AdminDash", element: <AdminDash/>}

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />   
  </StrictMode>,
)
