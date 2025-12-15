import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Predefined avatar options
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot3',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wink',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Alex',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sam',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel2',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel3',
];

const ProfileSelection = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    if (savedProfiles.length === 0 && user) {
      const defaultProfile = {
        id: 1,
        name: user.username || 'Usuario',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        isKids: false
      };
      localStorage.setItem('profiles', JSON.stringify([defaultProfile]));
      setProfiles([defaultProfile]);
    } else {
      setProfiles(savedProfiles);
    }
    setLoading(false);
  }, []);

  const handleSelect = (profile) => {
    if (isManaging) {
      openEditModal(profile);
    } else {
      localStorage.setItem('currentProfile', JSON.stringify(profile));
      navigate('/home');
    }
  };

  const openEditModal = (profile) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
    setShowAvatarPicker(false);
  };

  const closeEditModal = () => {
    setEditingProfile(null);
    setEditName('');
    setEditAvatar('');
    setShowAvatarPicker(false);
  };

  const saveProfile = () => {
    if (!editName.trim()) return;

    const updatedProfiles = profiles.map(p =>
      p.id === editingProfile.id
        ? { ...p, name: editName.trim(), avatar: editAvatar }
        : p
    );
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
    closeEditModal();
  };

  const handleAddProfile = () => {
    const newId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
    const randomAvatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
    const newProfile = {
      id: newId,
      name: `Perfil ${newId}`,
      avatar: randomAvatar,
      isKids: false
    };
    const updatedProfiles = [...profiles, newProfile];
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);

    // Open edit modal for the new profile
    openEditModal(newProfile);
  };

  const handleDeleteProfile = (profileId) => {
    if (profiles.length <= 1) return;
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
    closeEditModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F171E' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '4px solid #00A8E1', borderTopColor: 'transparent' }}
          ></div>
          <p style={{ color: '#8197A4' }}>Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#0F171E' }}>
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <span className="text-2xl font-bold text-white">
          Cine<span style={{ color: '#00A8E1' }}>Stream</span>
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3">
        {isManaging ? 'Administrar perfiles' : '¿Quién está viendo?'}
      </h1>
      <p className="mb-10" style={{ color: '#8197A4' }}>
        {isManaging ? 'Pulsa un perfil para editarlo' : 'Selecciona tu perfil para continuar'}
      </p>

      {/* Profiles Grid */}
      <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mb-12">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className="relative group cursor-pointer text-center"
            onClick={() => handleSelect(profile)}
          >
            <div
              className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-lg overflow-hidden transition-all duration-300"
              style={{
                border: '3px solid transparent',
                backgroundColor: '#1A242F'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#00A8E1'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
                }}
              />

              {isManaging && (
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              )}

              {profile.isKids && (
                <div
                  className="absolute bottom-0 left-0 right-0 text-xs font-medium py-1 text-center"
                  style={{ backgroundColor: '#00A8E1', color: 'white' }}
                >
                  KIDS
                </div>
              )}
            </div>

            <p
              className="mt-3 text-sm lg:text-base transition-colors"
              style={{ color: '#8197A4' }}
            >
              {profile.name}
            </p>
          </div>
        ))}

        {/* Add Profile Button */}
        {profiles.length < 5 && (
          <div
            className="cursor-pointer text-center"
            onClick={handleAddProfile}
          >
            <div
              className="w-28 h-28 lg:w-36 lg:h-36 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                border: '3px solid #425265',
                backgroundColor: 'transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#00A8E1';
                e.currentTarget.style.backgroundColor = 'rgba(0, 168, 225, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#425265';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg className="w-12 h-12" style={{ color: '#8197A4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="mt-3 text-sm lg:text-base" style={{ color: '#8197A4' }}>
              Añadir perfil
            </p>
          </div>
        )}
      </div>

      {/* Manage Profiles Button */}
      <button
        onClick={() => setIsManaging(!isManaging)}
        className="px-8 py-3 rounded text-sm font-medium uppercase tracking-wider transition-all duration-200"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #8197A4',
          color: '#8197A4'
        }}
        onMouseOver={(e) => {
          e.target.style.borderColor = '#FFFFFF';
          e.target.style.color = '#FFFFFF';
        }}
        onMouseOut={(e) => {
          e.target.style.borderColor = '#8197A4';
          e.target.style.color = '#8197A4';
        }}
      >
        {isManaging ? 'Listo' : 'Administrar perfiles'}
      </button>

      {/* Logout link */}
      <button
        onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('currentProfile');
          navigate('/login');
        }}
        className="mt-8 text-sm transition-colors"
        style={{ color: '#8197A4' }}
        onMouseOver={(e) => e.target.style.color = '#00A8E1'}
        onMouseOut={(e) => e.target.style.color = '#8197A4'}
      >
        Cerrar sesión
      </button>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={(e) => e.target === e.currentTarget && closeEditModal()}
        >
          <div
            className="w-full max-w-lg rounded-lg p-6"
            style={{ backgroundColor: '#1A242F', border: '1px solid #425265' }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Editar perfil</h2>

            {/* Avatar Preview & Picker */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="relative w-32 h-32 rounded-lg overflow-hidden cursor-pointer mb-3"
                style={{ border: '3px solid #00A8E1' }}
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                <img
                  src={editAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="text-sm"
                style={{ color: '#00A8E1' }}
              >
                {showAvatarPicker ? 'Cerrar galería' : 'Cambiar avatar'}
              </button>
            </div>

            {/* Avatar Picker Grid */}
            {showAvatarPicker && (
              <div
                className="mb-6 p-4 rounded-lg max-h-64 overflow-y-auto"
                style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
              >
                <p className="text-sm mb-3" style={{ color: '#8197A4' }}>Selecciona un avatar:</p>
                <div className="grid grid-cols-6 gap-3">
                  {AVATAR_OPTIONS.map((avatar, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-110"
                      style={{
                        border: editAvatar === avatar ? '2px solid #00A8E1' : '2px solid transparent',
                        backgroundColor: '#1A242F'
                      }}
                      onClick={() => {
                        setEditAvatar(avatar);
                        setShowAvatarPicker(false);
                      }}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded text-white focus:outline-none"
                style={{ backgroundColor: '#0F171E', border: '1px solid #425265' }}
                onFocus={(e) => e.target.style.borderColor = '#00A8E1'}
                onBlur={(e) => e.target.style.borderColor = '#425265'}
                placeholder="Nombre del perfil"
                maxLength={20}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={saveProfile}
                className="flex-1 py-3 rounded font-semibold text-white transition-colors"
                style={{ backgroundColor: '#00A8E1' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#00C8FF'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#00A8E1'}
              >
                Guardar
              </button>
              <button
                onClick={closeEditModal}
                className="flex-1 py-3 rounded font-semibold transition-colors"
                style={{ backgroundColor: 'transparent', border: '1px solid #425265', color: '#8197A4' }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#FFFFFF';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#425265';
                  e.target.style.color = '#8197A4';
                }}
              >
                Cancelar
              </button>
            </div>

            {/* Delete Button */}
            {profiles.length > 1 && (
              <button
                onClick={() => handleDeleteProfile(editingProfile.id)}
                className="w-full mt-4 py-3 rounded font-semibold transition-colors"
                style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#ef4444';
                }}
              >
                Eliminar perfil
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelection;
