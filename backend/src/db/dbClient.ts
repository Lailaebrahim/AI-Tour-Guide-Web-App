import { connect, disconnect } from "mongoose";


export const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
