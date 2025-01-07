import { motion } from "framer-motion";
import { FaChevronCircleUp } from "react-icons/fa";

interface ToTopButtonProps {

  scrollRef: React.RefObject<HTMLDivElement>;

}

const ToTopButton: React.FC<ToTopButtonProps> = ({ scrollRef }) => {
  
  const handleGoUp = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", padding: "5px"}}
      onClick={handleGoUp}
    >
      <FaChevronCircleUp size={30} color="goldenrod" />
    </motion.button>
  );
}

export default ToTopButton;
