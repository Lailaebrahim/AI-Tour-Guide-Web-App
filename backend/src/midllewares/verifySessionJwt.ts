import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

const verifySessionJwt = (req: Request, res: Response, next: NextFunction) => {
    const sessionJwt = req.signedCookies.sessionJwt;

    // If no session JWT exists, return unauthorized
    if (!sessionJwt || sessionJwt.trim() === "") {
        return res.status(401).send({ error: "No session JWT" });
    }

    // If session JWT exists, verify it
    try {
        const sessionId = jwt.verify(sessionJwt, process.env.JWT_SECRET!) as string;
        
        if (!sessionId) {
            return res.status(401).send({ error: "Invalid session JWT" });
        }

        res.locals.sessionId = sessionId;
        
        return next();

    } catch (jwtError) {
        return res.status(401).json({
            error: "Invalid session token"
        });
    }
};

export default verifySessionJwt;