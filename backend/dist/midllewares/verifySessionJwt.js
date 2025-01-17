import jwt from "jsonwebtoken";
const verifySessionJwt = (req, res, next) => {
    const sessionJwt = req.signedCookies.sessionJwt;
    // If no session JWT exists, return unauthorized
    if (!sessionJwt || sessionJwt.trim() === "") {
        return res.status(401).send({ error: "No session JWT" });
    }
    // If session JWT exists, verify it
    try {
        const sessionId = jwt.verify(sessionJwt, process.env.JWT_SECRET);
        if (!sessionId) {
            return res.status(401).send({ error: "Invalid session JWT" });
        }
        res.locals.sessionId = sessionId;
        return next();
    }
    catch (jwtError) {
        return res.status(401).json({
            error: "Invalid session token"
        });
    }
};
export default verifySessionJwt;
//# sourceMappingURL=verifySessionJwt.js.map