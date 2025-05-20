/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simuler un appel API pour envoyer le lien de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError("Nous n'avons pas pu envoyer le lien de réinitialisation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles cohérents avec le reste de l'application
  const inputClass = "w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10";
  const buttonClass = "w-full p-3 bg-[#1EB1D1] hover:bg-[#062C57] text-white rounded-md transition duration-300 font-medium";
  const labelClass = "mb-1 text-sm text-gray-700";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Image de gauche - fixe même en cas de défilement */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="fixed w-1/2 h-screen">
          <Image
            src="/images/welcome.jpg"
            alt="Poignée de main entre un humain et un robot"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
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
      <div
        className="w-full md:w-1/2 flex flex-col p-8 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="mb-6 self-center">
          <Image
            src="/images/logo_mts.png"
            alt="Millennium Tech"
            width={180}
            height={40}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-[#062C57]">
          Mot de passe oublié ?
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-5 rounded-md mb-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-lg font-semibold mb-2">E-mail envoyé</h2>
            <p className="mb-4">
              Si un compte existe avec l'adresse e-mail <strong>{email}</strong>, vous recevrez sous peu un lien pour réinitialiser votre mot de passe.
            </p>
            <Link href="/auth/login" className={buttonClass + " inline-block text-center"}>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <div className={labelClass}>Adresse mail</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail professionnelle"
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonClass}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>

            <div className="text-center mt-6">
              <Link
                href="/auth/login"
                className="text-sm text-[#1EB1D1] hover:text-[#062C57] flex items-center justify-center"
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
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* CTA dans le coin inférieur gauche (sur la partie image) - visible uniquement sur desktop */}
      <div className="hidden md:block absolute bottom-8 left-8">
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
      </div>
    </div>
  );
}