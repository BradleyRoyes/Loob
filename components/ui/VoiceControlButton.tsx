import React, { useState, useEffect, useMemo } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceControlButtonProps {
  setInput: (message: string) => void;
}

const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({ setInput }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isPressed, setIsPressed] = useState<boolean>(false);

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

    const handleResult = (event: SpeechRecognitionEvent) => {
      const currentTranscripts: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscripts.push(event.results[i][0].transcript);
      }
      setTranscripts((prevTranscripts) => [...prevTranscripts, ...currentTranscripts]);
    };

    const handleEnd = () => {
      if (isListening) {
        recognition.start(); // Only restart listening if `isListening` is still true
      } else {
        console.log('Voice recognition stopped. Processing results...');
        // Process accumulated transcripts here
        const message = transcripts.join(' ');
        console.log(message);
        setInput(message); // Call the setInput prop with the transcribed message
      }
    };

    recognition.onresult = handleResult;
    recognition.onend = handleEnd;

    // Other event handlers...

    return () => {
      // Cleanup event handlers when component unmounts
      if (recognition.onresult === handleResult) {
        recognition.onresult = null as any; // Type assertion here
      }
      if (recognition.onend === handleEnd) {
        recognition.onend = null as any; // Type assertion here
      }
    };
  }, [recognition, isListening, transcripts, setInput]);

  const handleStartListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setTranscripts([]); // Reset transcripts when starting
    setIsListening(true);
    recognition.start();
    setIsPressed(true); // Set the button state to pressed
  };

  const handleStopListening = () => {
    if (!recognition) {
      console.error('SpeechRecognition not available.');
      return;
    }
    setIsListening(false);
    recognition.stop(); // This will trigger the onend event
    setIsPressed(false); // Set the button state to released
  };

  return (
    <div>
      <button
        onClick={isPressed ? handleStopListening : handleStartListening}
        disabled={isListening}
        style={{
          backgroundColor: isPressed ? 'blue' : 'initial',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
        }}
      >
        {/* Microphone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 2c-1.657 0-3 1.343-3 3v5h6V5c0-1.657-1.343-3-3-3zM4 8v7c0 3.313 2.687 6 6 6h4c3.313 0 6-2.687 6-6v-7h2c1.104 0 2-.896 2-2v-4c0-1.104-.896-2-2-2H4c-1.104 0-2 .896-2 2v4c0 1.104.896 2 2 2h2zm14-2h-2V5c0-.551-.449-1-1-1s-1 .449-1 1v1H8V5c0-.551-.449-1-1-1s-1 .449-1 1v1H4c-.553 0-1 .447-1 1v4c0 .553.447 1 1 1h2v7c0 2.761 2.239 5 5 5s5-2.239 5-5v-7h2c.553 0 1-.447 1-1v-4c0-.553-.447-1-1-1z" />
        </svg>
        {/* End of Microphone Icon */}
      </button>
      {/* Optionally display the accumulated transcripts */}
      <div>{transcripts.join(' ')}</div>
    </div>
  );
};

export default VoiceControlButton;

