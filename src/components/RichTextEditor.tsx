// src/components/RichTextEditor.tsx
"use client";
import { useState, useEffect } from "react";

interface RichTextEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
  className?: string; // Ajout de cette prop
}

export default function RichTextEditor({ initialValue = "", onChange, className = "" }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(initialValue);

  // Assurer que le changement est toujours propagé au parent
  useEffect(() => {
    onChange(editorContent);
  }, [editorContent, onChange]);

  return (
    <textarea
      className={`w-full h-32 p-3 ${className}`}
      value={editorContent}
      onChange={(e) => setEditorContent(e.target.value)}
      placeholder="Décrivez votre projet, besoins et attentes..."
    />
  );
}