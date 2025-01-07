import { Box } from '@mui/material';
import { isAudioPath } from '../../utils/pathChecker';
import Message from './Message';

interface UserMessageProps {
  message: string;
  index: number;
}

const UserMessage = ({ message, index }: UserMessageProps) => {
  return (
    <Box
      id={`user_msg_${index}`}
      sx={{
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
        backgroundColor: '#222',
        borderRadius: {
          xs: '12px',   
          sm: '15px'  
        },
        padding: {
          xs: '8px 12px',
          sm: '10px 15px' 
        },
        color: 'goldenrod',
        alignSelf: 'flex-end',
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
        }
      }}
    >
      <Message
        message={message}
        type={isAudioPath(message) ? 'audio' : 'text'}
        index={index}
        sender='user'
      />
    </Box>
    );
};

export default UserMessage;