import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// IMPORTS
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PeliculaForm from './components/PeliculaForm';
import PeliculaDetail from './pages/PeliculaDetail';
import ProfileSelection from './pages/ProfileSelection';
import Search from './pages/Search';
import ProfileManager from './pages/ProfileManager';
import ProfileForm from './pages/ProfileForm';
import MovieManager from './pages/MovieManager';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><ProfileSelection /></ProtectedRoute>} />
        <Route path="/manage-profiles" element={<ProtectedRoute><ProfileManager /></ProtectedRoute>} />
        <Route path="/manage-profiles/new" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
        <Route path="/manage-profiles/edit/:id" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
        <Route path="/manage-movies" element={<ProtectedRoute><MovieManager /></ProtectedRoute>} />
        <Route path="/manage-movies/new" element={<ProtectedRoute><PeliculaForm /></ProtectedRoute>} />
        <Route path="/manage-movies/edit/:id" element={<ProtectedRoute><PeliculaForm /></ProtectedRoute>} />

        {/* La home real está en /home */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/peliculas/:id" element={<ProtectedRoute><PeliculaDetail /></ProtectedRoute>} />
        <Route path="/crear-pelicula" element={<ProtectedRoute><PeliculaForm /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;