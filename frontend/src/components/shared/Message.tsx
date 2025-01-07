import { Box } from '@mui/material';

type MessageProps = {
  message: string;
  index: number;
  type?: 'text' | 'audio';
  sender: string;
};

const Message = ({ message, index, type , sender}: MessageProps) => {
  return (
    <>
      {type === 'audio' ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            '& audio': {
              width: {
                xs: '100%',
                sm: '80%', 
                md: '60%',
                lg: '50%',
              },
              height: {
                xs: '40px',
                sm: '45px',
                md: '50px',
              },
              borderRadius: '8px',
              backgroundColor: 'rgba(218, 165, 32, 0.1)',
              '&::-webkit-media-controls-panel': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-media-controls-play-button': {
                backgroundColor: 'goldenrod',
                borderRadius: '50%',
                transform: 'scale(1.2)',
              },
              '&::-webkit-media-controls-current-time-display, &::-webkit-media-controls-time-remaining-display': {
                color: 'black',
              },
              '&::-webkit-media-controls-timeline': {
                backgroundColor: 'rgba(218, 165, 32, 0.3)',
              },
            },
          }}
        >
          <audio controls id={`${sender}_msg_${index}_audio`}>
            <source src={message} type="audio/mp3" />
          </audio>
        </Box>
      ) : (
        <span
          id={`${sender}_msg_${index}_text`}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {message}
        </span>
      )}
    </>
  );
};

export default Message;