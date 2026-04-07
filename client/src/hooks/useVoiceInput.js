import { useEffect, useRef, useState } from "react";

export const useVoiceInput = ({ onFinalTranscript }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    finalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      setLiveTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error || "Voice recognition failed");
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interimText = "";
      let finalText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result?.[0]?.transcript?.trim();

        if (!text) {
          continue;
        }

        if (result.isFinal) {
          finalText += `${text} `;
        } else {
          interimText += `${text} `;
        }
      }

      const nextTranscript = (finalText || interimText).trim();
      if (nextTranscript) {
        setLiveTranscript(nextTranscript);
      }

      if (finalText.trim()) {
        finalTranscriptRef.current?.(finalText.trim());
      }
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setLiveTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setLiveTranscript("");
  };

  return {
    isSupported,
    isListening,
    error,
    liveTranscript,
    startListening,
    stopListening,
    clearTranscript,
  };
};
