import { Router } from "express";
import { getAllUsers, userSignUp, userLogIn, userLogOut, verifyUser } from "../controllers/users.controller.js";
import { validate, signupValidator, loginValidator } from "../midllewares/validators/auth.js";
import { verifyToken } from "../utils/token-manager.js";
const userRouter = Router();
userRouter.get("/", getAllUsers);
userRouter.post("/signup", validate(signupValidator), userSignUp);
userRouter.post("/login", validate(loginValidator), userLogIn);
userRouter.get("/logout", userLogOut);
userRouter.get("/auth-status", verifyToken, verifyUser);
export default userRouter;
//# sourceMappingURL=user.routes.js.map