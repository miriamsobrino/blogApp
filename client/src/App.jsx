import { Route, Routes } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './pages/ProtectedRoute';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import UserPostsPage from './pages/UserPostsPage';
import ProfilePage from './pages/ProfilePage';
import { AppContextProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/post/:id' element={<PostDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/create' element={<CreatePostPage />} />
            <Route path='/posts' element={<UserPostsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </AppContextProvider>
  );
}

export default App;
