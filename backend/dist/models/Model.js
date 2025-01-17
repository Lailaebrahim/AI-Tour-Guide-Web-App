import { Schema, model } from "mongoose";
const chatSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    messages: [
        {
            userMessage: {
                type: String,
                required: true,
                maxLength: 1000
            },
            botMessage: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    messageCount: Number,
    isActive: Boolean,
});
chatSchema.pre('save', function (next) {
    if (this.messages.length === parseInt(process.env.MAX_MESSAGES_PER_CHAT)) {
        this.isActive = false;
        const error = new Error(`Chat cannot exceed ${process.env.MAX_MESSAGES_PER_CHAT} messages`);
        next(error);
    }
    this.messageCount++;
    next();
});
const Chat = model('Chat', chatSchema);
//# sourceMappingURL=Model.js.map