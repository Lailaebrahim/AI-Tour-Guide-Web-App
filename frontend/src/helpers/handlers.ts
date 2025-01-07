
export const handleSendTextMessage = async () => {
    try {
      if (!userTextInput.trim()) return;
      setUserTextInput("");
      setShowSendButton(false);
      await session?.sendTextMessage(userTextInput);
      setIsInitialView(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown Error occurred");
      }
    }
  };