import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const VoiceControlButton: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
      console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log(`Heard: ${transcript}`);
      // You can process the transcript here (e.g., updating state or calling a function)
    };

    recognition.onend = () => {
      // Only automatically restart listening if `isListening` is still true
      if (isListening) {
        recognition.start();
      } else {
        console.log('Voice recognition stopped.');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
    };
  }, [recognition, isListening]);

  const handleStartListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setIsListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div>
      <button onClick={handleStartListening} disabled={isListening}>Start Listening</button>
      <button onClick={handleStopListening} disabled={!isListening}>Stop Listening</button>
    </div>
  );
};

export default VoiceControlButton;
