import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import { Provider } from 'react-redux'
import store from './redux/store.tsx'

import './index.css'

// ==================== PAGES ====================

// General
import Main from './pages/Main'
import Home from './pages/Home/home'
import AboutUs from './pages/About/aboutUs.tsx'

// General
import Message from './pages/Message/Message.tsx'

// Auth
import Register from './pages/Auth/Register/register.tsx'
import LogIn from './pages/Auth/LogIn/login.tsx'
import ConfirmEmail from './pages/Auth/ConfirmEmail/confirmEmail.tsx'
import ForgetPassword from './pages/Auth/ForgetPassword/ForgetPassword.tsx'
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword.tsx'

// User
import UserInfo from './pages/User/Info/userInfo.tsx'
import EditProfile from './pages/User/Edit/editProfile.tsx'

// Posts
import Posts from './pages/Post/Posts/posts.tsx'
import Post from './pages/Post/Info/postInfo.tsx'
import CreatePost from './pages/Post/Create/createPost.tsx'
import EditPost from './pages/Post/Edit/editPost.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/about',
        element: <AboutUs></AboutUs>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/confirm_email',
        element: <ConfirmEmail></ConfirmEmail>
      },
      {
        path: '/forget_password',
        element: <ForgetPassword></ForgetPassword>
      },
      {
        path: '/reset_password',
        element: <ResetPassword></ResetPassword>
      },
      {
        path: '/message',
        element: <Message></Message>
      },
      {
        path: '/login',
        element: <LogIn></LogIn>
      },
      {
        path: '/:name',
        element: <UserInfo></UserInfo>
      },
      {
        path: '/profile',
        element: <EditProfile></EditProfile>
      },
      {
        path: 'posts',
        element: <Posts></Posts>
      },
      {
        path: '/:name/:title',
        element: <Post></Post>
      },
      {
        path: '/createpost',
        element: <CreatePost></CreatePost>
      },
      {
        path: '/editpost/:title',
        element: <EditPost></EditPost>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)