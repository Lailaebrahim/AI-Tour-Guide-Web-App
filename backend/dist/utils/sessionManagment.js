import jwt from "jsonwebtoken";
const createSessionJwt = (id) => {
    const payload = { id };
    const sessionJwt = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return sessionJwt;
};
const removeCookie = (res) => {
    res.clearCookie("sessionJwt", {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        domain: process.env.DOMAIN,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res;
};
const setCookie = (res, id) => {
    const sessionJwt = createSessionJwt(id);
    res.cookie("sessionJwt", sessionJwt, {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        domain: process.env.DOMAIN,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res;
};
export { setCookie, removeCookie };
//# sourceMappingURL=sessionManagment.js.map