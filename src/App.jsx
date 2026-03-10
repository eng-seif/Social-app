import './App.css'
import { HeroUIProvider } from "@heroui/react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './Pages/MainLayout/MainLayout';
import Home from './Pages/Home/Home';
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';
import Profile from './Pages/Profile/Profile';
import Notifications from './Pages/Notifications/Notifications';
import PostDetails from './Pages/PostDetails/PostDetails';
import MyPosts from './Pages/myPosts/MyPosts';
import Community from './Pages/Community/Community'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthContextProvider from './context/AuthContext';
import Settings from './Pages/Settings/Settings';
import SavedPosts from './Pages/SavedPosts/SavedPosts';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const routes = createBrowserRouter([
  // ================= MAIN APP LAYOUT (With Navbar) =================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: "community",
        element: <ProtectedRoute><Community /></ProtectedRoute>
      },
      {
        path: "saved-posts",
        element: <ProtectedRoute><SavedPosts /></ProtectedRoute>
      },
      { 
        path: "myposts", 
        element: <ProtectedRoute><MyPosts /></ProtectedRoute> 
      },
      {
        path: "Profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "Notifications",
        element: <ProtectedRoute><Notifications /></ProtectedRoute>
      },
      {
        path: "Settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>
      },
      {
        path: "post-details/:postId",
        element: <ProtectedRoute><PostDetails /></ProtectedRoute>
      }
    ]
  },

  // ================= AUTH LAYOUT (No Navbar) =================
  { 
    path: "/login", 
    element: <Login /> 
  },
  { 
    path: "/register", 
    element: <Register /> 
  }
]);

const queryClient = new QueryClient();

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <RouterProvider router={routes} />
        </HeroUIProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;