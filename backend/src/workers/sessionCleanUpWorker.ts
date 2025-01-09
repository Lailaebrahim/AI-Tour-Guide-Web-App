import sessionCleanUpQueue from "../queues/sessionCleanUpQueue.js";


async function startSessionCleanUpWorker() {
    console.log('Session Clean Up worker started');
    
    process.on('SIGTERM', async () => {
      console.log('Worker shutting down...');
      await sessionCleanUpQueue.close();
      process.exit(0);
    });
}
  
startSessionCleanUpWorker();