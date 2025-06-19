import { AudioRecorder } from "react-audio-voice-recorder";
import { useSession } from "../../context/useSession";
import { toast } from "react-hot-toast";

type AudioRecorderComponentProps = {
  disabled: boolean;
};

const AudioRecorderComponent = ({disabled}: AudioRecorderComponentProps) => {
  const session = useSession();

  const addAudioElement = async (blob: Blob) => {
    try {
      if (disabled){
        toast.error("wait for the bot to respond before sending another audio message");
        return;
      };

      const audio = new File([blob], "audio.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });
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
      onNotAllowedOrFound={() => {
        toast.error("Microphone not found or permission not granted");
      }}
      showVisualizer={true}
      downloadFileExtension="mp3"
    />
  );
};

export default AudioRecorderComponent;
