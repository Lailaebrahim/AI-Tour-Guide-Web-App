import Queue from "bull";
import fs from "fs/promises";

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
  },
});

fileDeleteQueue.process(async (job) => {
  const { filePath } = job.data;
  try {

    await fs.access(filePath);
    await fs.unlink(filePath);

    console.log(`Delete worker Successfully deleted file: ${filePath}`);

    return { success: true };

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
