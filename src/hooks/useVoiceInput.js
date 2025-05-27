import { useState, useCallback, useEffect } from 'react';

const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return null;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    return recognition;
  }, []);

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening]);

  const startListening = useCallback(() => {
    setError('');
    const recognitionInstance = recognition();
    
    if (!recognitionInstance) return;

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access to use voice input.');
      } else {
        setError('Error occurred while listening. Please try again.');
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionInstance.start();
    } catch (err) {
      setError('Error starting voice recognition. Please try again.');
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};

export default useVoiceInput; 