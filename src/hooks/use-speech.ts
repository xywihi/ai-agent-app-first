"use client";

import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  // const Check = () => {
  //     if (!window.speechSynthesis) {
  //   setIsSupported(false);
  //   return;
  // }
  // }
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => {
    //获取语音列表
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
    };
    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
    //页面卸载停止朗读
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis || !text.trim()) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 1; // 语速
      utterance.pitch = 1; // 音调
      //优先选择中文语音
      const zhVoice = voices.find((voice) => voice.lang === "zh-CN");
      if (zhVoice) utterance.voice = zhVoice;
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );
  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);
  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
}
