import toast from 'react-hot-toast';
import { useEffect, useState, Fragment, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LiaAnkhSolid } from "react-icons/lia";
import { IoMdSend } from "react-icons/io";
import Header from '../components/Header';
import { useSession } from '../context/SessionContext';
import UserMessage from '../components/shared/UserMessage';
import BotMessage from '../components/shared/BotMessage';
import CustomInput from '../components/shared/CustomInput';
import ClearButton from '../components/shared/ClearButton'
import ToButtomButton from '../components/shared/ToButtomButton';
import ToTopButton from '../components/shared/ToTopButton';
import AudioRecorderComponent from '../components/shared/AudioRecorder';


type Message = {
  userMessage: string;
  botMessage: string;
  createdAt: Date;
}

const Chat = () => {
  const session = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simplified state
  const [userTextInput, setUserTextInput] = useState<string>("");
  const [isInitialView, setIsInitialView] = useState(true);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // initial view
  useEffect(() => {
    if ((session?.messages?.length ?? 0) > 0) {
      setIsInitialView(false);
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current?.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
      setShowAudioRecorder(true);
    } else {
      setIsInitialView(true);
    }
  }, [session?.messages]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight } = scrollContainerRef.current;
      const scrollThreshold = scrollHeight * 0.5;
      setIsVisible(scrollTop < scrollThreshold);
    }
  };

  // scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSendTextMessage = async () => {
    try {
      if (!userTextInput.trim()) return;
      setUserTextInput("");
      setShowSendButton(false);
      await session?.sendTextMessage(userTextInput, "text");
      setIsInitialView(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error occurred");
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: "flex",
        alignItems: 'center',
        flexDirection: "column",
        height: '100vh'
      }}
    >
      {
        isInitialView ? (
          null
        ) : (
          <Header />
        )
      }

      <Box
        ref={scrollContainerRef}
        sx={{
          width: '100%',
          height: '100%',
          display: 'grid',
          justifyItems: 'center',
          position: 'relative',
          paddingBottom: '150px',
          overflowY: 'auto',
        }}>

        <Box
          sx={{
            width: '70%',
            height: '100%',
            padding: '20px',
            display: 'grid',
            alignContent: 'center',
            gap: '2rem',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>

          {isInitialView ? (
            <>
              {/*  welcome message */}
              <Box id="welcome"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                <LiaAnkhSolid
                  size="7vw"
                  style={{
                    fontSize: 'clamp(30px, 7vw, 70px)'
                    }}
                />
                <Typography
                  variant="h1"
                  color="black"
                  sx={{
                  marginLeft: { xs: 0, sm: '10px' },
                  fontFamily: 'Akhenaton',
                  fontSize: {
                    xs: '50px',
                    sm: '50px',
                    md: '50px',
                    lg: '9vw',
                    xl: '9vw'
                  },
                  textShadow: '2px 2px 16px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Welcome to Project 1
                </Typography>
              </Box>

              {/* initial input */}
              <Box id="initial"
                sx={{
                  width: "100%",
                  minHeight: "150px",
                  maxHeight: "300px",
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '25px',
                  boxShadow: '10px 10px 20px #000',
                  padding: '20px',
                  boxSizing: 'border-box',
                  display: 'grid',
                  gridTemplateRows: '1fr auto',
                  gridTemplateColumns: '1fr auto',
                  gap: '15px',
                }}>
                <CustomInput
                  placeholder="How can I help you today ?"
                  multiline
                  sx={{
                    gridColumn: '1 / -1',
                    width: '100%',
                    height: '100%',
                    '& .MuiInputBase-root': {
                      height: '100%',
                      padding: '10px',
                      overflow: 'auto'
                    },
                    '& .MuiInputBase-input': {
                      fontSize: "larger",
                      overflow: 'auto !important',
                      maxHeight: 'none !important',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }
                  }}
                  value={userTextInput}
                  onChange={(e) => {
                    setShowSendButton(e.target.value.trim().length > 0);
                    setShowAudioRecorder(e.target.value.trim().length === 0);
                    setUserTextInput(e.target.value);
                  }}
                />

                {/* Send/Audio Record at bottom right */}
                <Box sx={{
                  gridColumn: '2',
                  gridRow: '2',
                  justifySelf: 'end',
                  alignSelf: 'center',
                  opacity: session?.isLoading ? 0.7 : 1,
                  pointerEvents: session?.isLoading ? 'none' : 'auto'
                }}>
                  {showSendButton ? (
                    <IoMdSend
                      id="send_initial"
                      size={30}
                      color={session?.isLoading ? "gray" : "goldenrod"}
                      onClick={session?.isLoading ? undefined : handleSendTextMessage}
                      style={{
                        cursor: session?.isLoading ? 'not-allowed' : 'pointer',
                        opacity: session?.isLoading ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ) : showAudioRecorder && (
                    <AudioRecorderComponent disabled={session?.isLoading || false} />
                  )}
                </Box>
              </Box>
            </>
          ) :
            // chat box
            <Box id="chat"
              sx={{
                position: 'relative',
                width: "100%",
                height: "fit-content",
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                borderRadius: '25px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
                padding: '30px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Arial',
                gap: '15px',
                margin: '20px auto',
              }}>

              {session?.messages?.map((message: Message, index: number) => (
                <Fragment 
                  key={index}>
                  {message?.userMessage && (
                    <UserMessage message={message.userMessage} index={index} />
                  )}

                  {!message?.botMessage ? (
                    // Show "Thinking..." animation if botMessage is empty, null, or undefined
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <CircularProgress size={30} style={{ color: "goldenrod" }} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  ) : (
                    <BotMessage message={message.botMessage} index={index} />
                  )}

                </Fragment>
              ))}
            </Box>
          }
        </Box>

      </Box>

      {/* bottom input at long chat */}
      {!isInitialView && (
        <Box sx={{ width: '95%', position: 'fixed', bottom: 0 }}>

          {/* Navigation Controls Container */}
          <Box
            sx={{
              position: 'fixed',
              right: { xs: '10px', sm: '10px' },
              bottom: { xs: '120px', sm: '10px' },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
              gap: { xs: '30px', sm: '30px', md: '20px' },
              marginBottom: { xs: '50px', sm: '50px', md: 0 },
              zIndex: 100
            }}
          >
            {/* Clear Button */}
            <Box sx={{ cursor: 'pointer' }}>
              <ClearButton />
            </Box>

            {/* To Bottom Button */}
            {isVisible && (
              <Box sx={{ cursor: 'pointer' }}>
                <ToButtomButton scrollRef={scrollContainerRef} />
              </Box>
            )}

            {/* To Top Button */}
            {!isVisible && (
              <Box sx={{ cursor: 'pointer' }}>
                <ToTopButton scrollRef={scrollContainerRef} />
              </Box>
            )}

          </Box>

          {/* Input At long chat */}
          <Box
            id="user_input"
            sx={{
              width: { xs: '90%', sm: '72%' },
              minHeight: '100px',
              mx: 'auto',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(5px)',
              borderRadius: '25px 25px 0px 0px',
              boxShadow: '-10px -10px 20px #000',
              padding: '20px',
              display: 'grid',
              gridTemplateAreas: {
                xs: `
              "input input input"
              "selector . send"
              `,
                sm: `
              "input input input"
              "selector . send"
              `
              },
              gridTemplateColumns: 'auto 1fr auto',
              gridTemplateRows: '1fr auto',
              gap: '10px',
              fontFamily: 'Roboto'
            }}
          >

            {/* Text Input */}
            <CustomInput
              id="user_msg"
              placeholder="reply to Khafura ... "
              fullWidth
              multiline
              maxRows={3}
              value={userTextInput}
              onChange={(e) => {
                setShowSendButton(e.target.value.trim().length > 0);
                setShowAudioRecorder(e.target.value.trim().length === 0);
                setUserTextInput(e.target.value);
              }}
              sx={{
                gridArea: 'input',
                '& .MuiInputBase-root': {
                  padding: 0,
                },
              }}
            />

            {/* Send Button */}
            <Box sx={{ gridArea: 'send', alignSelf: 'end' }}>
            <Box sx={{
                  gridColumn: '2',
                  gridRow: '2',
                  justifySelf: 'end',
                  alignSelf: 'center',
                  opacity: session?.isLoading ? 0.7 : 1,
                  pointerEvents: session?.isLoading ? 'none' : 'auto'
                }}>
                  {showSendButton ? (
                    <IoMdSend
                      id="send_initial"
                      size={30}
                      color={session?.isLoading ? "gray" : "goldenrod"}
                      onClick={session?.isLoading ? undefined : handleSendTextMessage}
                      style={{
                        cursor: session?.isLoading ? 'not-allowed' : 'pointer',
                        opacity: session?.isLoading ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ) : showAudioRecorder && (
                    <AudioRecorderComponent disabled={session?.isLoading || false} />
                  )}
                </Box>
            </Box>

          </Box>

        </Box>
      )}

    </Box>
  );
};

export default Chat;
