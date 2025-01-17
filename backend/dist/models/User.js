import { Schema, model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    chats: {
        type: [Schema.Types.ObjectId],
        default: [],
        maxLength: process.env.MAX_CHATS_PER_USER
    }
});
userSchema.pre('save', async function (next) {
    if (this.chats.length === parseInt(process.env.MAX_CHATS_PER_USER)) {
        const error = new Error(`User cannot exceed ${process.env.MAX_CHATS_PER_USER} chats`);
        next(error);
    }
    next();
});
const User = model('User', userSchema);
export default User;
//# sourceMappingURL=User.js.map