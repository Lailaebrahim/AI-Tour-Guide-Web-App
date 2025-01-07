import { motion } from "framer-motion";
import { FaChevronCircleDown } from "react-icons/fa";

interface ToButtomButtonProps {

  scrollRef: React.RefObject<HTMLDivElement>;

}

const ToButtomButton: React.FC<ToButtomButtonProps> = ({ scrollRef }) => {
  const handleGoDown = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: "smooth"
      })
    }, 100);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", padding: "5px"}}
      onClick={handleGoDown}
    >
      <FaChevronCircleDown size={30} color="goldenrod" />
    </motion.button>
  );
}

export default ToButtomButton;
