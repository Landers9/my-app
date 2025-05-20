/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Image de gauche - poignée de main entre humain et robot */}
      <div className="w-full md:w-1/2 relative">
        <Image
          src="/images/welcome.jpg"
          alt="Poignée de main entre un humain et un robot"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Contenu textuel à droite */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo_mts.png"
            alt="Millennium Tech"
            width={180}
            height={40}
          />
        </div>

        {/* Titre principal avec les couleurs correctes */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          <span className="text-[#1EB1D1]">La technologie</span> <span className="text-[#062C57]">au service de</span>
          <br />
          <span className="text-[#062C57]">la transformation</span> <span className="text-[#1EB1D1]">numérique</span>
          <br />
          <span className="text-[#062C57]">de votre entreprise</span>
        </h1>

        {/* Texte descriptif en noir */}
        <p className="text-sm md:text-base text-black mb-8 text-center">
          Nous proposons des solutions digitales sur mesure conçues à travers de
          véritables partenariats avec nos clients. Développement web, création
          d'applications mobiles, stratégie en écosystèmes connectés...
          Notre équipe d'experts s'engage à moderniser votre entreprise en
          définissant une performance de réponse à vos besoins métiers.
        </p>

        {/* Bouton d'action avec la couleur correcte */}
        <Link
          href="/services"
          className="bg-[#1EB1D1] hover:bg-primary text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Soumettre votre projet
        </Link>
      </div>
    </div>
  );
}