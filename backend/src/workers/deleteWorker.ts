import fileDeleteQueue from "../queues/fileDeleteQueue.js";

async function startDeleteWorker() {
    console.log('File deletion worker started');
    
    process.on('SIGTERM', async () => {
      console.log('Worker shutting down...');
      await fileDeleteQueue.close();
      process.exit(0);
    });
}
  
startDeleteWorker();