import { Router } from "express";
import { checkSession, sendTextMessage, clearChat, saveAudioMessage, sendAudioMessage, retryMessage, toAudio, } from "../controllers/chat.controller.js";
import verifySessionJwt from "../midllewares/verifySessionJwt.js";
import { validate, user_ip_res_type_validator, } from "../midllewares/reqBodyValidation.js";
import checkSessionPublicDir from "../midllewares/checkSessionPublicDir.js";
import uploadAudioMiddleware from "../midllewares/audioUpload.js";
const chatRouter = Router();
chatRouter.get("/session-status", checkSession);
chatRouter.delete("/clear-chat", verifySessionJwt, clearChat);
chatRouter.post("/send-text-message", verifySessionJwt, validate(user_ip_res_type_validator), sendTextMessage);
chatRouter.post("/send-audio-message", verifySessionJwt, sendAudioMessage);
chatRouter.post("/save-audio-message", verifySessionJwt, checkSessionPublicDir, uploadAudioMiddleware, saveAudioMessage);
chatRouter.post("/retry-message/:index", verifySessionJwt, retryMessage);
chatRouter.post("/to-audio/:index", verifySessionJwt, toAudio);
export default chatRouter;
//# sourceMappingURL=chat.routes.js.map