"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
  // Redirection automatique vers la company 1
  router.replace('/company/019812fc-e7b3-73e9-b791-5e25e3d6ba36');
  }, [router]);

  // Affichage temporaire pendant la redirection
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1EB1D1]"></div>
    </div>
  );
}