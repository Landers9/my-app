/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Save,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { AuthService } from "@/services/authService";
import { ProfileFormData, PasswordFormData, ProfileUpdateRequest, PasswordChangeRequest } from "@/types/models";
import { RouteGuard } from "@/components/RouteGuard";

export default function ProfilePage() {
  const { user, refreshUser } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États de chargement
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // États d'affichage mot de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Messages
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Preview avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Formulaire informations personnelles
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    telephone: user?.telephone || "",
    _avatar: null
  });

  // Formulaire mot de passe
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Mettre à jour le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        telephone: user.telephone || "",
        _avatar: null
      });
      // Définir l'avatar existant comme preview
      if (user._avatar) {
        setAvatarPreview(user._avatar);
      }
    }
  }, [user]);

  // Auto-effacement des messages
  useEffect(() => {
    if (profileMessage) {
      const timer = setTimeout(() => setProfileMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [profileMessage]);

  useEffect(() => {
    if (passwordMessage) {
      const timer = setTimeout(() => setPasswordMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  // Gestion de l'upload d'avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        setProfileMessage({type: 'error', text: 'Veuillez sélectionner une image valide'});
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setProfileMessage({type: 'error', text: 'L\'image ne doit pas dépasser 5MB'});
        return;
      }

      setProfileForm(prev => ({ ...prev, _avatar: file }));

      // Créer un preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer l'avatar
  const handleRemoveAvatar = () => {
    setProfileForm(prev => ({ ...prev, _avatar: null }));
    setAvatarPreview(user?._avatar || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Soumission du profil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage(null);

    try {
      const updateData: ProfileUpdateRequest = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        telephone: profileForm.telephone,
        _avatar: profileForm._avatar
      };

      await AuthService.updateProfile(updateData);
      await refreshUser();

      setProfileMessage({type: 'success', text: 'Profil mis à jour avec succès !'});

      // Reset avatar form field
      setProfileForm(prev => ({ ...prev, avatar: null }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setProfileMessage({
        type: 'error',
        text: error?.message || 'Erreur lors de la mise à jour du profil'
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Soumission du mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage(null);

    // Validation côté client
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMessage({type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas'});
      setIsPasswordLoading(false);
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordMessage({type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères'});
      setIsPasswordLoading(false);
      return;
    }

    try {
      const passwordData: PasswordChangeRequest = {
        current_password: passwordForm.current_password,
        password: passwordForm.new_password,
        password_confirmation: passwordForm.confirm_password
      };

      await AuthService.changePassword(passwordData);

      setPasswordMessage({type: 'success', text: 'Mot de passe mis à jour avec succès !'});
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error: any) {
      setPasswordMessage({
        type: 'error',
        text: error?.message || 'Erreur lors de la mise à jour du mot de passe'
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Générer les initiales utilisateur
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-lg backdrop-blur-xl bg-gradient-to-r from-white/40 to-white/20 border border-white/30 p-8"
          >
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#1EB1D1]/20 to-transparent rounded-full blur-2xl"
              animate={{
                x: [0, 10, 0],
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-[#062C57] to-[#1EB1D1] bg-clip-text text-transparent mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Mon Profil
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Gérez vos informations personnelles et votre sécurité
              </motion.p>
            </div>
          </motion.div>

          {/* Section Informations Personnelles */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/50 rounded-lg p-8 border border-white/30"
          >
            <div className="flex items-center mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <User className="mr-3 text-[#1EB1D1]" size={24} />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Informations Personnelles</h2>
            </div>

            {/* Message de statut profil */}
            {profileMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                  profileMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <AlertCircle size={20} className="text-red-600" />
                )}
                <span className="font-medium">{profileMessage.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1EB1D1] to-[#17a2b8] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                      {getUserInitials()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1EB1D1] rounded-full flex items-center justify-center shadow-lg hover:bg-[#17a2b8] transition-colors"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="mb-1 text-sm text-gray-700">Photo de profil</div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-3 py-2 bg-gray-200 text-gray-700 border-none rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      <Upload size={16} className="mr-2" />
                      Changer
                    </button>
                    {(profileForm._avatar || avatarPreview) && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X size={16} className="mr-1" />
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG jusqu'à 5MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div>
                  <div className="mb-1 text-sm text-gray-700">
                    Prénom *
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <div className="mb-1 text-sm text-gray-700">
                    Nom *
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                {/* Email (lecture seule) */}
                <div>
                  <div className="mb-1 text-sm text-gray-700">
                    Email
                  </div>
                  <div className="relative">
                    <div className="w-full p-2 bg-gray-100 text-gray-500 border-none rounded-md cursor-not-allowed h-10 flex items-center">
                      {user?.email}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                {/* Téléphone */}
                <div>
                  <div className="mb-1 text-sm text-gray-700">
                    Téléphone
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profileForm.telephone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, telephone: e.target.value }))}
                      className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isProfileLoading}
                  className={`w-full p-3 bg-[#1EB1D1] hover:bg-[#062C57] text-white rounded-md transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProfileLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{isProfileLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Section Sécurité */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/50 rounded-lg p-8 border border-white/30"
          >
            <div className="flex items-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lock className="mr-3 text-[#1EB1D1]" size={24} />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Sécurité</h2>
            </div>

            {/* Message de statut mot de passe */}
            {passwordMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <AlertCircle size={20} className="text-red-600" />
                )}
                <span className="font-medium">{passwordMessage.text}</span>
              </motion.div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Mot de passe actuel */}
              <div>
                <div className="mb-1 text-sm text-gray-700">
                  Mot de passe actuel *
                </div>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                    placeholder="Votre mot de passe actuel"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <div className="mb-1 text-sm text-gray-700">
                  Nouveau mot de passe *
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                    placeholder="Votre nouveau mot de passe"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 caractères
                </p>
              </div>

              {/* Confirmation nouveau mot de passe */}
              <div>
                <div className="mb-1 text-sm text-gray-700">
                  Confirmer le nouveau mot de passe *
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10"
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Bouton de mise à jour */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isPasswordLoading}
                  className={`w-full p-3 bg-[#1EB1D1] hover:bg-[#062C57] text-white rounded-md transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPasswordLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock size={18} />
                  )}
                  <span>{isPasswordLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </RouteGuard>
  );
}