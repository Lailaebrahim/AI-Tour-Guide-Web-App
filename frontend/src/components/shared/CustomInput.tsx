import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    }
  },
  '& .MuiInputBase-root': {
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto !important',
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Roboto, sans-serif',
    color: 'black',
    padding: '10px',
    maxHeight: 'none',
    overflow: 'visible'
  },
  '& .MuiInputBase-root::-webkit-scrollbar': {
    width: '8px',
  },
  '& .MuiInputBase-root::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '& .MuiInputBase-root::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '& .MuiInputBase-root::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
  '& ::placeholder': {
    fontFamily: 'Akhenaton',
    fontSize: '2rem',
    color: 'goldenrod',
  }
});

export default CustomInput;