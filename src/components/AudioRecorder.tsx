/* eslint-disable react/no-unescaped-entities */
// src/components/AudioRecorder.tsx
"use client";
import { useState, useRef, useEffect } from "react";

interface AudioRecorderProps {
  onChange: (audioBlob: Blob | null) => void;
}

export default function AudioRecorder({ onChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Effet de nettoyage pour arrêter les flux médias lors du démontage
  useEffect(() => {
    return () => {
      // Nettoyer le stream et les ressources audio lors du démontage du composant
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Libérer l'URL de l'objet blob si elle existe
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      // Arrêter tout flux existant avant d'en créer un nouveau
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

        // Nettoyer l'ancienne URL avant d'en créer une nouvelle
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onChange(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Arrêter les tracks du stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const clearRecording = () => {
    // Libérer l'URL de l'objet blob
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioURL("");
    onChange(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        {isRecording ? (
          <button
            type="button" // Spécifier explicitement type="button" pour éviter la soumission du formulaire
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Arrêter l'enregistrement
          </button>
        ) : (
          <button
            type="button" // Spécifier explicitement type="button" pour éviter la soumission du formulaire
            onClick={startRecording}
            className="bg-[#1EB1D1] hover:bg-[#062C57] text-white px-4 py-2 rounded-md"
          >
            Commencer l'enregistrement
          </button>
        )}

        {audioURL && (
          <button
            type="button" // Spécifier explicitement type="button" pour éviter la soumission du formulaire
            onClick={clearRecording}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Effacer
          </button>
        )}
      </div>

      {audioURL && (
        <audio controls src={audioURL} className="w-full" />
      )}
    </div>
  );
}