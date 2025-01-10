import Queue from "bull";
import Chat from "../models/Chat.js";
import bulkDelete from "../utils/bulkDelete.js";
import { connectDB } from "../db/dbClient.js";

const sessionCleanUpQueue = new Queue("session-cleanup", {
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

connectDB()
  .then(() => {
    sessionCleanUpQueue.add(
      "cleanup-expired-sessions",
      {},
      {
        repeat: {
          cron: "* * * * *",
        },
      }
    );

    sessionCleanUpQueue.process("cleanup-expired-sessions", async (job) => {
      try {
        const sessions = await Chat.find({
          createdAt: { $lt: new Date(Date.now() - 24 * 3600000) },
        });
        if (sessions.length === 0) {
          return [];
        }
        const results = [];
        for (const session of sessions) {
          try {
            await bulkDelete(session.messages);
            await Chat.deleteOne({ _id: session._id });
            results.push({
              sessionId: session._id,
              status: "deleted",
            });
          } catch (error) {
            results.push({
              sessionId: session._id,
              status: "failed",
              error: error.message,
            });
          }
          return results;
        }
      } catch (error) {
        console.error("Error in session cleanup job:", error);
        throw error;
      }
    });

    sessionCleanUpQueue.on("completed", (job, result) => {
      console.log(
        `Job ${job.id} completed. Processed ${result.length} sessions:`,
        `${result.filter((r) => r.status === "deleted").length} deleted,`,
        `${result.filter((r) => r.status === "failed").length} failed`
      );
    });

    sessionCleanUpQueue.on("failed", (job, error) => {
      console.error(`Job ${job.id} failed:`, error);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

export default sessionCleanUpQueue;
