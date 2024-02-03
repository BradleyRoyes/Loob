import React, { useState, useEffect, useMemo } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const VoiceControlButton: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  const recognition = useMemo(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Set continuous to true to keep it listening until manually stopped
      return recognitionInstance;
    }
    return null;
  }, [SpeechRecognition]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscripts: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscripts.push(event.results[i][0].transcript);
      }
      setTranscripts(prevTranscripts => [...prevTranscripts, ...currentTranscripts]);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Only restart listening if `isListening` is still true
      } else {
        console.log('Voice recognition stopped. Processing results...');
        // Process accumulated transcripts here
        console.log(transcripts.join(' '));
      }
    };

    // Other event handlers...
  }, [recognition, isListening, transcripts]);

  const handleStartListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setTranscripts([]); // Reset transcripts when starting
    setIsListening(true);
    recognition.start();
  };

  const handleStopListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setIsListening(false);
    recognition.stop(); // This will trigger the onend event
  };

  return (
    <div>
      <button onClick={handleStartListening} disabled={isListening}>Start Listening</button>
      <button onClick={handleStopListening} disabled={!isListening}>Stop Listening</button>
      {/* Optionally display the accumulated transcripts */}
      <div>{transcripts.join(' ')}</div>
    </div>
  );
};

export default VoiceControlButton;
