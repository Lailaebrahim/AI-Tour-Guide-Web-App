import multer, { diskStorage } from "multer";
import { extname } from "path";
import { NextFunction, Request, Response } from "express";

interface SessionRequest extends Request {
  sessionData?: {
    sessionId: string;
    sessionPath: string;
  };
}

const audioStorage = diskStorage({
  destination: function (req: SessionRequest, file, cb: Function) {
    if (req.sessionData?.sessionPath) {
      cb(null, req.sessionData.sessionPath);
    } else {
      cb(new Error("Session path not found"), null);
    }
  },
  filename: function (req: Request, file, cb: Function) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${file.fieldname}-${timestamp}-${randomString}${extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const audioFilter = (req: Request, file, cb: Function) => {
  const mimetype = file.mimetype.split("/")[0];
  if (mimetype === "audio" || mimetype === "blob") {
    return cb(null, true);
  } else {
    return cb(new Error("File must be an audio file"), false);
  }
};

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max limit
  },
}).single("audio");

const uploadAudioMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploadAudio(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

export default uploadAudioMiddleware;
