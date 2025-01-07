import jwt from "jsonwebtoken";
import { Response } from "express";


const createSessionJwt = (id: string) =>{
    const payload ={id};
    const sessionJwt = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return sessionJwt;
}

const removeCookie = (res: Response) => {
    res.clearCookie("sessionJwt", {
        path: "/",
        domain: process.env.DOMAIN,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: "none"
    });
    return res;
}

const setCookie = (res: Response, id: string) => {
    const sessionJwt = createSessionJwt(id);

    res.cookie('sessionJwt', sessionJwt, {
        path: "/",
        domain:  process.env.DOMAIN,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        signed: true,
        secure: true,
        sameSite: "none"
    });

    return res;
}

export {setCookie, removeCookie};