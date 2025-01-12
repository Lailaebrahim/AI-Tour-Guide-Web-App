import Queue from "bull";
import fs from "fs/promises";
import path from "path";
import { config } from "dotenv";

config();

const fileDeleteQueue = new Queue("file-deletion", {
  redis: {
    host: "localhost",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600
    },
    removeOnFail: 1000, 
  },
});

fileDeleteQueue.process('delete-file', async (job) => {
  const { filePath } = job.data;
  try {
    
    const fullPath = path.join(process.env.FILES_BASE_URL, filePath);
    await fs.access(fullPath);
    await fs.unlink(fullPath);

    console.log(`Delete worker Successfully deleted file: ${fullPath}`);
    return { success: true, filePath };

  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`File already deleted or doesn't exist: ${filePath}`);
      return { success: true, filePath };
    }
    throw error;
  }
});

fileDeleteQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed. File ${result.filePath} deleted`);
});

fileDeleteQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

export default fileDeleteQueue;
