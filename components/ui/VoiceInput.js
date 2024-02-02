// components/VoiceInput.js

import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window) {
      const webkitSpeech = new window.webkitSpeechRecognition();
      webkitSpeech.continuous = false; // Reactivate after each command
      webkitSpeech.interimResults = false; // We only want final results
      webkitSpeech.lang = 'en-US'; // Set the language
      webkitSpeech.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript); // Pass the transcript to the parent component
        setIsListening(false); // Stop listening after getting result
      };
      webkitSpeech.onerror = (event) => {
        console.error(event.error);
        setIsListening(false); // Handle errors gracefully
      };
      setSpeechRecognition(webkitSpeech);
    } else {
      console.log('Speech recognition not supported in this browser.');
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
      setIsListening(true);
    }
  };

  return (
    <button onClick={toggleListening}>
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
};

export default VoiceInput;
