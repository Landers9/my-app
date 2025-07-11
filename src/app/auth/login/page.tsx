/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  // Nettoyer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, clearError, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await login({ email, password });

      // Animation de sortie avant redirection
      await new Promise((resolve) => setTimeout(resolve, 300));

      router.push("/dashboard");
    } catch (err) {
      // L'erreur est déjà gérée par le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage de chargement
  // if (authLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-white">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1EB1D1] mx-auto"></div>
  //         <p className="mt-2 text-gray-600">Vérification...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Styles
  const inputClass = "w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10";
  const buttonClass = "w-full p-3 bg-[#1EB1D1] hover:bg-[#062C57] text-white rounded-md transition duration-300 font-medium";
  const labelClass = "mb-1 text-sm text-gray-700";

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 },
    loading: {
      scale: 1,
      opacity: 0.8
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Image de gauche - fixe même en cas de défilement */}
      <div className="hidden md:block md:w-1/2 relative">
        <motion.div
          className="fixed w-1/2 h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/welcome.jpg"
            alt="Poignée de main entre un humain et un robot"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Overlay gradué qui disparaît progressivement */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
        </motion.div>
      </div>

      {/* Image mobile (uniquement visible sur les petits écrans) */}
      <div className="md:hidden w-full h-48 relative">
        <Image
          src="/images/welcome.jpg"
          alt="Poignée de main entre un humain et un robot"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Formulaire à droite avec défilement */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col p-8 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="mb-6 self-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
        >
          <Image
            src="/images/logo_mts.png"
            alt="Millennium Tech"
            width={180}
            height={40}
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold mb-8 text-center text-[#062C57]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Vous revoilà !
        </motion.h1>

        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className={labelClass}>Adresse mail</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail professionnel"
              className={inputClass}
              required
              disabled={isSubmitting}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between">
              <div className={labelClass}>Mot de passe</div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#1EB1D1] hover:text-[#062C57]"
                >
                  Mot de passe oublié ?
                </Link>
              </motion.div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className={inputClass}
                required
                disabled={isSubmitting}
              />
              <motion.button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center"
            variants={itemVariants}
          >
            <motion.input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#1EB1D1] focus:ring-[#1EB1D1] rounded"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting}
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`${buttonClass} ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            variants={buttonVariants}
            animate={isSubmitting ? "loading" : "visible"}
            whileHover={!isSubmitting ? "hover" : undefined}
            whileTap={!isSubmitting ? "tap" : undefined}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </motion.button>
        </motion.form>

        {/* Lien d'inscription */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="text-[#1EB1D1] hover:text-[#062C57] font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </motion.div>

        {/* Bouton pour revenir à l'accueil (visible uniquement sur mobile) */}
        <motion.div
          className="mt-auto pt-6 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/"
            className="text-sm text-[#062C57] hover:text-[#1EB1D1] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Retour à l'accueil
          </Link>
        </motion.div>
      </motion.div>

      {/* CTA dans le coin inférieur gauche (sur la partie image) - visible uniquement sur desktop */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-white text-white bg-transparent hover:bg-white hover:text-[#062C57] rounded-md transition-colors duration-300"
          >
            <span className="mr-2">Retour à l'accueil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h13M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}