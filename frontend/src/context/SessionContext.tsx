import {
  createContext
} from "react";


type message = {
  userMessage: string;
  botMessage: string;
  createdAt: Date;
};

type Session = {
  isLoading: boolean;
  sessionId: string | null;
  messages: message[];
  sendTextMessage: (user_input: string, responseType: string) => Promise<void>;
  clearChat: () => Promise<void>;
  sendAudioMessage: (
    blob: Blob | number,
    responseType: string
  ) => Promise<void>;
  toAudio: (index: number) => Promise<void>;
};


export const SessionContext = createContext<Session | null>(null);