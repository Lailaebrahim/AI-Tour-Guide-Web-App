import { Router } from "express";
import chatRouter from "./chat.routes.js";
const appRouter = Router();
appRouter.use("/chat", chatRouter);
export default appRouter;
//# sourceMappingURL=index.routes.js.map