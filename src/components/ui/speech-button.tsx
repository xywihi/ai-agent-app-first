"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface SpeechButtonProps {
  text: string;
  className?: string;
}

export function SpeechButton({ text, className }: SpeechButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();
  if (!isSupported) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className, "cursor-pointer hover:bg-teal-400")}
      onClick={() => (isSpeaking ? stop() : speak(text))}
    >
      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </Button>
  );
}
