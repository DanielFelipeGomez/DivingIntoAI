"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface WhisperTranscriberProps {
  setInput: (text: string) => void;
}

export default function WhisperTranscriber({
  setInput,
}: WhisperTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleTranscription;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleTranscription = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsTranscribing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");

      // Necesitarás crear un endpoint en tu API para manejar la comunicación con Whisper
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al transcribir el audio");
      }

      const data = await response.json();

      if (data.text) {
        setInput(data.text);
      }
    } catch (error) {
      console.error("Error al transcribir:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isRecording ? (
        <Button
          variant="destructive"
          size="icon"
          onClick={stopRecording}
          disabled={isTranscribing}
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={startRecording}
          disabled={isTranscribing}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}

      {isTranscribing && (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-xs text-muted-foreground">
            Transcribiendo...
          </span>
        </div>
      )}
    </div>
  );
}
