import { Typography, keyframes } from '@mui/material';
import { LiaAnkhSolid } from 'react-icons/lia';

// Create a subtle glow animation
const glowAnimation = keyframes`
  0% { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
  50% { text-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700; }
  100% { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
`;

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => (
  <Typography 
    variant="h1" 
    sx={{
      marginLeft: '10px',
      fontFamily: 'Akhenaton',
      background: 'linear-gradient(45deg, #ffd700 10%, #ffb700 30%, #ffd700 90%)',
      backgroundClip: 'text',
      color: 'transparent',
      textShadow: `
        2px 2px 2px rgba(0, 0, 0, 0.8),
        -2px -2px 4px rgba(255, 215, 0, 0.3)
      `,
      position: 'relative',
      animation: `${glowAnimation} 3s ease-in-out infinite`,
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '110%',
        height: '120%',
        background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 183, 0, 0.1))',
        filter: 'blur(8px)',
        zIndex: -1,
        borderRadius: '10px'
      },
      '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 0.3s ease'
      }
    }}
  >
    <LiaAnkhSolid size={60} color="goldenrod" style={{ marginLeft: "20px" }} />
    {text}
  </Typography>
);

export default Title;