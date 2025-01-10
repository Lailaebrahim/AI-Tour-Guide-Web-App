import { Box, Button } from '@mui/material';
import { GiPharoah } from "react-icons/gi";
import { IoReloadOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";
import { LuAudioLines } from "react-icons/lu";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from '../../context/SessionContext';
import { isAudioPath } from '../../utils/pathChecker';
import Message from './Message';

interface BotMessageProps {
    message: string;
    index: number;
    // responseType: string;
}

const BotMessage = ({ message, index }: BotMessageProps) => {
    const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
    const isThisMessageHovered = hoveredMessageId === index;

    const session = useSession();

    const handleCopy = (index: number) => {
        const text = document.getElementById(`bot_msg_${index}_text`)?.textContent;
        navigator.clipboard.writeText(text || '');
    };

    const handleRetry = async (index: number) => {
        try {
            const user_input = session?.messages[index].userMessage;
            if (user_input && user_input.trim() !== "") {
                if (isAudioPath(user_input)) {
                    await session?.sendAudioMessage(index, "audio");
                } else {
                    await session?.sendTextMessage(user_input, "text");
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown Error occurred");
            }
        }

    };

    const handleToAudio = async (index: number) => {
        try {
            if (index >= 0) {
                await session?.toAudio(index);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown Error occurred");
            }
        }
    }

    return (
        <Box
            id={`bot_msg_${index}`}
            sx={{
                position: 'relative',
                width: {
                    xs: '95%',
                    sm: '90%',
                    md: '85%',
                    lg: '80%'
                },
                maxWidth: {
                    xs: '95%',
                    sm: '90%',
                    md: '85%',
                    lg: '80%'
                },
                borderRadius: {
                    xs: '12px',
                    sm: '15px'
                },
                padding: {
                    xs: '8px 12px',
                    sm: '10px 15px'
                },
                alignSelf: 'flex-start',
                gap: {
                    xs: '8px',
                    sm: '10px'
                },
                display: 'flex',
                textWrap: 'wrap',
                wordBreak: 'break-word',
                margin: {
                    xs: '4px 0',
                    sm: '6px 0',
                    md: '8px 0'
                },
                fontSize: {
                    xs: '0.9rem',
                    sm: '1rem'
                },
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#333',
                },
                color: '#f5f5f5',
            }}
            onMouseEnter={() => setHoveredMessageId(index)}
            onMouseLeave={() => setHoveredMessageId(null)}
        >
            <GiPharoah
                size="1.5em"
                color="goldenrod"
                style={{
                    flexShrink: 0,
                    width: '1.5em',
                    height: '1.5em',
                    alignSelf: "flex-start"
                }}
            />

            <Message
                message={message}
                type={isAudioPath(message) ? 'audio' : 'text'}
                index={index}
                sender='bot'
            />

            {/* Hover box inside the relative container */}
            {isThisMessageHovered && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: {
                            xs: '-30px',
                            sm: '-35px',
                            md: '-40px'
                        },
                        left: {
                            xs: '-5px',
                            sm: '-8px',
                            md: '-10px'
                        },
                        backgroundColor: 'rgba(51, 51, 51, 0.9)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '8px',
                        padding: {
                            xs: '3px 5px',
                            sm: '4px 6px'
                        },
                        fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem'
                        },
                        color: 'goldenrod',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(218, 165, 32, 0.2)',
                        zIndex: 1,
                        animation: 'fadeIn 0.3s ease',
                        '@keyframes fadeIn': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(-10px)'
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    { !isAudioPath(message) ?
                        (<Button
                            sx={{
                                backgroundColor: 'transparent',
                                color: "goldenrod",
                                "&:hover": {
                                    color: "#b8860b"
                                },
                                fontSize: {
                                    xs: '0.65rem',
                                    sm: '0.75rem'
                                }
                            }}
                            onClick={() => { handleToAudio(index) }}
                        >
                            <LuAudioLines />
                            <span style={{ marginLeft: '5px' }}>Listen</span>
                        </Button>) : null}

                    <Button
                        sx={{
                            backgroundColor: 'transparent',
                            color: "goldenrod",
                            "&:hover": {
                                color: "#b8860b"
                            },
                            fontSize: {
                                xs: '0.65rem',
                                sm: '0.75rem'
                            }
                        }}
                        onClick={() => { handleRetry(index) }}
                    >
                        <IoReloadOutline />
                        <span style={{ marginLeft: '5px' }}>Retry</span>
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: 'transparent',
                            color: "goldenrod",
                            "&:hover": {
                                color: "#b8860b"
                            },
                            fontSize: {
                                xs: '0.65rem',
                                sm: '0.75rem'
                            }
                        }}
                        onClick={() => { handleCopy(index) }}
                    >
                        <FaRegCopy />
                        <span style={{ marginLeft: '5px' }}>Copy</span>
                    </Button>
                </Box>
            )}
        </Box>

    );
};

export default BotMessage;