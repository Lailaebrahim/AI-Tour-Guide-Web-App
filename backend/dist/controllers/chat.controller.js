import { v4 as UUID } from "uuid";
import Chat from "../models/Chat.js";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import { join, dirname } from "path";
// import path from "path";
// import { fileURLToPath } from "url";
import { text_input_mock } from "../utils/AI-Mock.js";
import extractPublicPath from "../utils/extractPublicPath.js";
import bulkDelete from "../utils/bulkDelete.js";
export const checkSession = async (req, res, next) => {
    try {
        const sessionJwt = req.signedCookies.sessionJwt;
        // Case 1: No session exists - create new session
        if (!sessionJwt || sessionJwt.trim() === "") {
            const newSessionId = UUID();
            // create new chat session
            const newChat = new Chat({
                sessionId: newSessionId.toString(),
                messages: [],
            });
            await newChat.save();
            // set new session cookie
            res.cookie("sessionJwt", jwt.sign(newSessionId.toString(), process.env.JWT_SECRET), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                signed: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log("New session created:", newSessionId);
            return res.status(200).json({
                sessionId: newChat.sessionId,
                messages: [],
            });
        }
        // Case 2: Session exists - validate and retrieve
        try {
            const sessionId = jwt.verify(sessionJwt, process.env.JWT_SECRET);
            const chat = await Chat.findOne({ sessionId });
            if (!chat) {
                // Invalid session - clear cookie and return error
                res.clearCookie("sessionJwt");
                return res.status(404).json({
                    error: "No chat found for this session id",
                });
            }
            console.log("Existing session retrieved:", sessionId);
            return res.status(200).json({
                sessionId: chat.sessionId,
                messages: chat.messages,
            });
        }
        catch (jwtError) {
            // JWT verification failed - clear cookie
            res.clearCookie("sessionJwt");
            return res.status(401).json({
                error: "Invalid session token",
            });
        }
    }
    catch (error) {
        console.error("Session check error:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
export const sendTextMessage = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .json({ error: "No session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .json({ error: "No Chat associated to this session ID" });
        const { user_input, responseType } = req.body;
        // if (responseType === "audio") {
        //     const AI_ENDPOINT = process.env.AI_TEXT_INPUT_AUDIO_OUTPUT_ENDPOINT;
        // } else {
        //   const AI_ENDPOINT = process.env.AI_TEXT_INPUT_TEXT_OUTPUT_ENDPOINT;
        // }
        // const ai_res = await axios.post(`${process.env.AI_URL}/${AI_ENDPOINT}`, {user_input});
        const ai_res = await text_input_mock(user_input, responseType);
        if (ai_res) {
            chat.messages.push({
                userMessage: user_input,
                botMessage: ai_res,
                createdAt: new Date(),
            });
            await chat.save();
            return res
                .status(200)
                .json({ message: { userMessage: user_input, botMessage: ai_res } });
        }
        return res.status(500).json({ error: "Failed to send message" });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "unkwon error accured" });
        }
    }
};
export const clearChat = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .json({ error: "no session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .json({ error: "No Chat associated to this session ID" });
        // const ai_res = await axios.post(`${process.env.AI_URL}/${process.env.AI_CLEAR_CHAT_ENDPOINT}`, {clear_chat: true});
        const ai_res = true;
        // add messages to delete queue
        await bulkDelete(chat.messages);
        if (ai_res) {
            chat.messages = [];
            await chat.save();
            return res.status(200).json({ message: "Chat Cleared" });
        }
        return res.status(500).json({ error: "Failed to clear chat" });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "unkwon error accured" });
        }
    }
};
export const saveAudioMessage = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            return res.status(401).json({
                success: false,
                error: "No session ID found. Authentication required.",
            });
        }
        const chat = await Chat.findOne({ sessionId });
        if (!chat) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            return res.status(404).json({
                success: false,
                error: "No chat found for this session",
            });
        }
        const audio = req.file;
        if (!audio) {
            return res.status(400).json({
                success: false,
                error: "No audio file provided",
            });
        }
        const allowedTypes = [
            "audio/mp3",
            "audio/wav",
            "audio/mpeg",
            "audio/webm",
            "audio/ogg",
        ];
        if (!allowedTypes.includes(audio.mimetype)) {
            await fs.unlink(audio.path);
            return res.status(400).json({
                success: false,
                error: "Invalid audio file type",
            });
        }
        try {
            const relativePath = extractPublicPath(audio.path);
            console.log("relative path", relativePath);
            const newMessage = {
                userMessage: relativePath,
                botMessage: " ",
                createdAt: new Date(),
            };
            chat.messages.push(newMessage);
            await chat.save();
            return res
                .status(200)
                .json({
                message: {
                    userMessage: newMessage.userMessage,
                    botMessage: "",
                    createdAt: newMessage.createdAt,
                    index: chat.messages.length - 1,
                },
            });
        }
        catch (error) {
            throw new Error("Error extracting public path");
        }
    }
    catch (error) {
        console.error("Error saving audio message:", error);
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            }
            catch (unlinkError) {
                console.error("Error deleting file:", unlinkError);
            }
        }
        return res.status(500).json({ error: error.message });
    }
};
export const sendAudioMessage = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .send({ error: "No session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .send({ error: "No Chat associated to this session ID" });
        const { index, responseType } = req.body;
        const message = chat.messages[index];
        if (!message)
            return res.status(404).send({ error: "No message found at this index" });
        // if (responseType === "audio") {
        //     const AI_ENDPOINT = process.env.AI_AUDIO_INPUT_AUDIO_OUTPUT_ENDPOINT;
        // } else {
        //     const AI_ENDPOINT = process.env.AI_AUDIO_INPUT_TEXT_OUTPUT_ENDPOINT;
        // }
        // const formData = new FormData();
        //
        // formData.append('user_input', fs.createReadStream(`${process.env.PUBLIC_PATH}/${message.userMessage}`));
        //
        // const ai_res = await axios.post(`${process.env.AI_URL}/${AI_ENDPOINT}`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        //     responseType: 'stream',
        // });
        // const timestamp = Date.now();
        // const randomString = Math.random().toString(36).substring(7);
        // const fileName = `ai-response-${timestamp}-${randomString}.mp3`;
        // const dirPath = fileURLToPath(dirname(import.meta.url));
        // const outputFilePath = join(dirPath, `../../../${process.env.FRONTEND_PUBLIC_DIR}/sessions/${sessionId}/${fileName}`);
        // const writer = createWriteStream(outputFilePath);
        // ai_res.data.pipe(writer);
        // await new Promise((resolve, reject) => {
        //         writer.on('finish', resolve);
        //         writer.on('error', reject);
        //     });
        // console.log('Audio file saved locally:', outputFilePath);
        // const relativePath = extractPublicPath(outputFilePath);
        // message.botMessage = relativePath;
        // await chat.save();
        // return res.status(200).send({ message });
        const ai_res = await text_input_mock(message.userMessage, responseType);
        if (ai_res) {
            message.botMessage = ai_res;
            await chat.save();
            return res.status(200).send({ message });
        }
        return res.status(500).send({ error: "Failed to send message" });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).send({ error: error.message });
        }
        else {
            return res.status(500).send({ error: "unkwon error accured" });
        }
    }
};
export const toAudio = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .json({ error: "No session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .json({ error: "No Chat associated to this session ID" });
        const { index } = req.params;
        console.log(index);
        const message = chat.messages[index];
        if (!message)
            return res.status(404).json({ error: "No message found at this index" });
        const ai_res = await text_input_mock(message.botMessage, "audio");
        if (ai_res) {
            const newMessage = {
                userMessage: message.userMessage,
                botMessage: ai_res,
                createdAt: new Date(),
            };
            chat.messages.push(newMessage);
            await chat.save();
            return res.status(200).json({ message: newMessage });
        }
        return res.status(500).json({ error: "Failed to send message" });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "unkwon error accured" });
        }
    }
};
export const getMessage = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .json({ error: "No session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .json({ error: "No Chat associated to this session ID" });
        const { index } = req.params;
        const message = chat.messages[parseInt(index)];
        if (!message)
            return res.status(404).json({ error: "No message found at this index" });
        return res.status(200).json({ message });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "unkwon error accured" });
        }
    }
};
export const retryMessage = async (req, res, next) => {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            return res
                .status(401)
                .json({ error: "No session ID, can not send message" });
        const chat = await Chat.findOne({ sessionId });
        if (!chat)
            return res
                .status(401)
                .json({ error: "No Chat associated to this session ID" });
        const { index } = req.params;
        const message = chat.messages[parseInt(index)];
        if (!message)
            return res.status(404).json({ error: "No message found at this index" });
        const newMessage = {
            userMessage: message.userMessage,
            botMessage: " ",
            createdAt: new Date(),
        };
        chat.messages.push(newMessage);
        await chat.save();
        return res
            .status(200)
            .json({
            message: {
                userMessage: newMessage.userMessage,
                botMessage: "",
                createdAt: newMessage.createdAt,
                index: chat.messages.length - 1,
            },
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "unkwon error accured" });
        }
    }
};
//# sourceMappingURL=chat.controller.js.map