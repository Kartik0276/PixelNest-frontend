import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/ToastContainer';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import Signup from './pages/Signup';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Contact from './pages/Contact';
import { useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const showFullFooter = location.pathname === '/contact';
  const showMinimalFooter = location.pathname === '/';

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          <main className="flex-grow-1">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/contact' element={<Contact />} />

              {/* Protected Routes */}
              <Route
                path='/myposts'
                element={
                  <ProtectedRoute>
                    <MyPosts />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/createPost'
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/post/:id'
                element={
                  <ProtectedRoute>
                    <PostDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/edit/:id'
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Full footer on contact page */}
          {showFullFooter && <Footer />}

          {/* Minimal footer on home page */}
          {showMinimalFooter && (
            <footer className="minimal-footer text-center">
              <div className="container">
                <span className="text-light">© 2025 All rights reserved by </span>
                <a className="text-warning fw-bold" href="https://github.com/Kartik0276" target="_blank" rel="noopener noreferrer">
                  Kartik
                </a>
                <span className="text-light"> | Built with ❤️ for the community</span>
              </div>
            </footer>
          )}
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
