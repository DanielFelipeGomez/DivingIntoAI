import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";

export default function Dictaphone({
  setInput,
}: {
  setInput: (input: string) => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // Cuando cambia el transcript, actualizamos el input combinando el valor inicial con el nuevo texto
  useEffect(() => {
    if (listening) {
      setInput(transcript);
    }
  }, [transcript, setInput, listening]);

  if (!isClient) {
    return <p>Loading...</p>; // Evita el problema de hidratación en SSR
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
      interimResults: true,
    });
  };

  return (
    <div>
      {listening ? (
        <button
          type="button"
          onClick={() => SpeechRecognition.stopListening()}
          className="bg-red-500 rounded-full p-2 hover:bg-red-600"
        >
          <MicOff className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStartListening}
          className="bg-green-500 rounded-full p-2 hover:bg-green-600"
        >
          <Mic className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
