"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Imports des services et hooks
import { useCompany } from '@/hooks/useCompany';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();

  // Récupérer l'ID depuis les paramètres de route, utiliser "0197e484-612e-7b7f-ac64-abff96823798" par défaut si pas d'ID
  const companyId = (params.id as string) || "0197e484-612e-7b7f-ac64-abff96823798";

  // Utilisation du hook pour récupérer la company
  const { company, isLoading } = useCompany(companyId);

  useEffect(() => {
    // Déclencher les animations après le chargement de la page
    if (!isLoading && company) {
      setIsLoaded(true);
    }
  }, [isLoading, company]);

  // Fonction pour appliquer les couleurs au slogan
  const renderStyledSlogan = (slogan: string | null) => {
    if (!slogan) return '';

    const words = slogan.split(' ');
    if (words.length < 3) {
      return <span className="text-[#1EB1D1]">{slogan}</span>;
    }

    return (
      <>
        <span className="text-[#1EB1D1]">{words[0]} {words[1]}</span>{" "}
        <span className="text-[#062C57]">
          {words.slice(2, -1).join(' ')}
        </span>{" "}
        <span className="text-[#1EB1D1]">{words[words.length - 1]}</span>
      </>
    );
  };

  // Variantes d'animation pour différents éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 1.2
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)"
    }
  };

  // Animation de l'image avec un zoom léger
  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  // Animation des titres avec un effet de mise en évidence
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Image de gauche - poignée de main entre humain et robot */}
      <motion.div
        className="w-full md:w-1/2 relative"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={imageVariants}
      >
        <Image
          src={company?.cover_image || "/images/welcome.jpg"}
          alt={company?.name || ""}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Overlay gradué qui disparaît progressivement */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
      </motion.div>

      {/* Contenu textuel à droite */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-8"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Logo avec animation de rebond */}
        <motion.div
          className="mb-8"
          variants={logoVariants}
        >
          <Image
            src={company?.logo || "/images/default-logo.png"}
            alt={company?.name || ""}
            width={180}
            height={40}
            className="object-contain"
          />
        </motion.div>

        {/* Titre principal avec animations séquentielles - utilise le slogan de la company */}
        <div className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <motion.div
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="inline-block"
          >
            {company?.slogan && renderStyledSlogan(company.slogan)}
          </motion.div>
        </div>

        {/* Texte descriptif qui apparaît ligne par ligne - utilise la description de la company */}
        <motion.p
          className="text-sm md:text-base text-black mb-8 text-center max-w-lg"
          variants={itemVariants}
        >
          {company?.description}
        </motion.p>

        {/* Bouton d'action avec animation interactive */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href={`/services?company=${companyId}`}
            className="bg-[#1EB1D1] text-white font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block"
          >
            Soumettre votre projet
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}