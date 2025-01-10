import fileDeleteQueue from "../queues/fileDeleteQueue.js";
import isAudioPath from "./isAudioPath.js";

type Message = {
  userMessage: string;
  botMessage: string;
  createdAt: Date;
};

const bulkDelete = async (messages: Message[]) => {
  const audioMessages = messages.filter((message) => {
    return isAudioPath(message.userMessage) || isAudioPath(message.botMessage);
  });

  const deleteJobs = audioMessages.flatMap((message) => {
    const jobs = [];
    
    if (isAudioPath(message.userMessage)) {
      jobs.push({
        name: 'delete-file',
        data: {
          filePath: message.userMessage,
        }
      });
    }
    
    if (isAudioPath(message.botMessage)) {
      jobs.push({
        name: 'delete-file',
        data: {
          filePath: message.botMessage,
        }
      });
    }
    
    return jobs;
  });

  console.log('Jobs to process:', deleteJobs.length);

  if (deleteJobs.length > 0) {
    await fileDeleteQueue.addBulk(deleteJobs);
  }
  
};

export default bulkDelete;