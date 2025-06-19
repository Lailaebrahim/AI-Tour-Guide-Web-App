import {
  ReactNode,
  useEffect,
  useState,
  // useRef,
} from "react";
import {
  checkSession as checksession,
  // getMessages as getMsgs,
  sendTextMessage as sendTxtMsg,
  clearChatHistory,
  sendAudioMessage as sendAudioMsg,
  saveAudioMessage as saveAudioMsg,
  // getMessage,
  retryMessage,
  toAudio as convertToAudio,
} from "../helpers/api-communicator";
import { SessionContext } from './SessionContext';


type message = {
  userMessage: string;
  botMessage: string;
  createdAt: Date;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const socketRef = useRef<typeof Socket | null>(null);

  // useEffect(() => {
  //   if (sessionId) {
  //     socketRef.current = io(SOCKET_URL, {
  //       query: { sessionId },
  //     });

  //     // Listen for incoming messages
  //     // socketRef.current?.on('botResponse', (message: message) => {
  //     //   setMessages(prevMessages => {
  //     //     const updatedMessages = [...prevMessages];
  //     //     updatedMessages[updatedMessages.length - 1] = message;
  //     //     return updatedMessages;
  //     //   });
  //     //   setIsLoading(false);
  //     // });

  //     // Handle connection errors
  //     socketRef.current?.on('connect_error', (error: Error) => {
  //       console.error('Socket connection error:', error);
  //       setIsLoading(false);
  //     });

  //     return () => {
  //       socketRef.current?.disconnect();
  //     };
  //   }
  // }, [sessionId]);

  // const getMessages = async (page: number) => {
  //   try {
  //     console.log(page);
  //     const data = await getMsgs(page);
  //     if (data) {
  //       console.log(page);
  //       console.log(data.messages.length);
  //       setMessages((prevMessages) => [...data.messages, ...prevMessages]);
  //       setIsLoading(false);
  //       return data.messages.length;
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     if (error instanceof Error) {
  //       console.log(error.message);
  //     } else {
  //       console.log("Unknown Error");
  //     }
  //   }
  // };

  const sendTextMessage = async (user_input: string, responseType: string) => {
    try {
      setIsLoading(true);
      if (
        user_input &&
        user_input.trim() !== "" &&
        responseType &&
        responseType.trim() !== ""
      ) {
        const newUserMessage = {
          userMessage: user_input,
          botMessage: "",
          createdAt: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        const data = await sendTxtMsg(user_input, responseType);

        const newBotMessage = {
          userMessage: data.message.userMessage,
          botMessage: data.message.botMessage,
          createdAt: data.message.createdAt,
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = newBotMessage;
          return updatedMessages;
        });
      } else {
        throw new Error("Invalid input");
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Unknown Error");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      setIsLoading(true);
      const data = await clearChatHistory();
      if (data) {
        setMessages(() => []);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Unknown Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendAudioMessage = async (
    blob: Blob | number,
    responseType: string
  ) => {
    try {
      setIsLoading(true);

      if (blob === null || blob === undefined || responseType.trim() === "") {
        throw new Error("No audio provided or response type not specified");
      }

      let data;
      if (blob instanceof Blob) {
        data = await saveAudioMsg(blob);
      } else {
        data = await retryMessage(blob);
      }

      if (data) {
        const newMessage = {
          userMessage: data.message.userMessage,
          botMessage: data.message.botMessage,
          createdAt: data.message.createdAt,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const aiResponse = await sendAudioMsg(data.message.index, responseType);

        if (aiResponse) {
          const newBotMessage = {
            userMessage: aiResponse.message.userMessage,
            botMessage: aiResponse.message.botMessage,
            createdAt: aiResponse.message.createdAt,
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = newBotMessage;
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop();
          return updatedMessages;
        });
        console.log(error);
        throw new Error(`Error processing audio message: ${error.message}`);
      } else {
        throw new Error(
          "Unknown error occurred while processing audio message"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toAudio = async (index: number) => {
    try {
      setIsLoading(true);
      if (index >= 0) {
        console.log("index: ", index);

        const newMessage = {
          userMessage: messages[index].userMessage,
          botMessage: "",
          createdAt: messages[index].createdAt,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const data = await convertToAudio(index);
        if (data) {
          const newMessage = {
            userMessage: data.message.userMessage,
            botMessage: data.message.botMessage,
            createdAt: data.message.createdAt,
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = newMessage;
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Unknown Error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const data = await checksession();
        if (data) {
          setSessionId(data.sessionId);
          setMessages([...data.messages]);
        }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          console.log((error as any).response?.data.error);
        } else {
          console.log("Unknown Error");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const value = {
    isLoading,
    sessionId,
    messages,
    // page,
    // getMessages,
    sendTextMessage,
    clearChat,
    sendAudioMessage,
    toAudio,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};