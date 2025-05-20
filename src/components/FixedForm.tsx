// src/components/FixedForm.tsx
"use client";
import { useState, useEffect, useRef, FormEvent } from "react";

interface FixedFormProps {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

/**
 * Composant de formulaire sécurisé qui empêche les soumissions accidentelles
 */
export default function FixedForm({ className = "", onSubmit, children }: FixedFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timers au démontage du composant
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handler de soumission sécurisé
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Si déjà en cours de soumission, ignorer
    if (isSubmitting) {
      return;
    }

    // Marquer comme en cours de soumission
    setIsSubmitting(true);

    // Soumettre après un court délai pour éviter les soumissions accidentelles
    timerRef.current = setTimeout(() => {
      onSubmit(e);
      // Réinitialiser après la soumission
      setIsSubmitting(false);
    }, 100);
  };

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={handleSubmit}
      // Attribut noValidate pour empêcher la validation HTML5 native
      noValidate
    >
      {children}
    </form>
  );
}