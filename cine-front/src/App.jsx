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
import MiLista from './pages/MiLista';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import CommentManagement from './pages/CommentManagement';
import UpdateAgeRatings from './pages/UpdateAgeRatings';

// Ruta protegida para usuarios autenticados
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Ruta protegida para administradores
const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.rol !== 'ADMINISTRADOR') {
    return <Navigate to="/home" replace />;
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

        {/* Admin Routes - Solo usuarios con rol ADMIN */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/movies" element={<AdminRoute><MovieManager /></AdminRoute>} />
        <Route path="/admin/comments" element={<AdminRoute><CommentManagement /></AdminRoute>} />
        <Route path="/admin/update-ages" element={<AdminRoute><UpdateAgeRatings /></AdminRoute>} />

        {/* Rutas legacy redirigidas o mantenidas por compatibilidad */}
        <Route path="/manage-movies" element={<Navigate to="/admin/movies" replace />} />
        <Route path="/manage-movies/new" element={<AdminRoute><PeliculaForm /></AdminRoute>} />
        <Route path="/manage-movies/edit/:id" element={<AdminRoute><PeliculaForm /></AdminRoute>} />
        <Route path="/crear-pelicula" element={<AdminRoute><PeliculaForm /></AdminRoute>} />

        {/* La home real está en /home */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/mi-lista" element={<ProtectedRoute><MiLista /></ProtectedRoute>} />
        <Route path="/peliculas/:id" element={<ProtectedRoute><PeliculaDetail /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;