// components/ui/VoiceInput.tsx

import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void; // Define a type for the onTranscript prop
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // The SpeechRecognition interface of the Web Speech API is not yet part of TypeScript's lib.dom.d.ts,
    // so you might need to extend the Window interface globally or use any as a workaround.
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
      };
      setSpeechRecognition(recognition);
    } else {
      console.log('Speech recognition not supported in this browser.');
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (speechRecognition) {
      if (isListening) {
        speechRecognition.stop();
        setIsListening(false);
      } else {
        speechRecognition.start();
        setIsListening(true);
      }
    }
  };

  return (
    <button onClick={toggleListening}>
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
};

export default VoiceInput;
