import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Modal from '../shared/Modal';
import { useSession } from "../../context/useSession";

const ClearButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const session = useSession();

    const handleClearChat = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleConfirmClear = async () => {
        console.log("clear");
        try {
            await session?.clearChat();
            toast.success("Chat history cleared successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown Error occurred");
            }
        }
        setIsOpen(false);
    };

    return (
        <>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", padding: "5px" }}
                onClick={handleClearChat}
            >
                <MdDelete size={30} color="red" />
            </motion.button>

            <Modal
                isOpen={isOpen}
                onClose={handleCloseModal}
                title="Clear Chat History"
            >
                <div style={{ padding: '10px' }}>
                    <Typography sx={{ marginBottom: '20px' }}>
                        Are you sure you want to clear all chat history? This action cannot be undone.
                    </Typography>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={handleCloseModal}
                            style={{
                                background: "#222",
                                color: 'goldenrod',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#222'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmClear}
                            style={{
                                background: "#222",
                                color: 'goldenrod',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#222'}
                        >
                            Clear History
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClearButton;