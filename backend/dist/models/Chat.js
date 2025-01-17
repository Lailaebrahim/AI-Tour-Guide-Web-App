import { Schema, model } from "mongoose";
export const chatSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
    },
    messages: [
        {
            userMessage: {
                type: String,
                required: true,
                maxLength: 1000,
            },
            botMessage: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Chat = model("chat", chatSchema);
export default Chat;
//# sourceMappingURL=Chat.js.map