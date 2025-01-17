import { Router } from "express";
import { getAllUsers } from "../controller/users.controller.js";
const userRouter = Router();
userRouter.get("/", getAllUsers);
export default userRouter;
//# sourceMappingURL=users.routes.js.map