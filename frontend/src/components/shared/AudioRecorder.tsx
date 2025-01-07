import { AudioRecorder } from "react-audio-voice-recorder";
import { useSession } from "../../context/SessionContext";
import { toast } from "react-hot-toast";
// import { AiTwotoneAudio } from "react-icons/ai";
// import { useState } from "react";

// type AudioRecorderComponentProps = {
//    responseType: string;
// };

const AudioRecorderComponent = () => {
  const session = useSession();

  const addAudioElement = async (blob: Blob) => {
    try {
      const audio = new File([blob], "audio.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });
      // await session?.sendAudioMessage(audio, props.responseType);
      await session?.sendAudioMessage(audio, "audio");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <AudioRecorder
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      onNotAllowedOrFound={(status) => {
        console.log(status);
      }}
      showVisualizer={true}
      downloadFileExtension="mp3"
    />
  );
};

export default AudioRecorderComponent;
