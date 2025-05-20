/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Déclencher les animations après le chargement de la page
    setIsLoaded(true);
  }, []);

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
          src="/images/welcome.jpg"
          alt="Poignée de main entre un humain et un robot"
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
            src="/images/logo_mts.png"
            alt="Millennium Tech"
            width={180}
            height={40}
          />
        </motion.div>

        {/* Titre principal avec animations séquentielles */}
        <div className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <motion.div
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="inline-block"
          >
            <span className="text-[#1EB1D1]">La technologie</span>{" "}
            <span className="text-[#062C57]">au service de</span>
          </motion.div>
          <br />
          <motion.div
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="inline-block"
          >
            <span className="text-[#062C57]">la transformation</span>{" "}
            <span className="text-[#1EB1D1]">numérique</span>
          </motion.div>
          <br />
          <motion.div
            custom={2}
            variants={titleVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="inline-block"
          >
            <span className="text-[#062C57]">de votre entreprise</span>
          </motion.div>
        </div>

        {/* Texte descriptif qui apparaît ligne par ligne */}
        <motion.p
          className="text-sm md:text-base text-black mb-8 text-center max-w-lg"
          variants={itemVariants}
        >
          Nous proposons des solutions digitales sur mesure conçues à travers de
          véritables partenariats avec nos clients. Développement web, création
          d'applications mobiles, stratégie en écosystèmes connectés...
          Notre équipe d'experts s'engage à moderniser votre entreprise en
          définissant une performance de réponse à vos besoins métiers.
        </motion.p>

        {/* Bouton d'action avec animation interactive */}
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href="/services"
            className="bg-[#1EB1D1] text-white font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block"
          >
            Soumettre votre projet
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}