import { Request, Response, NextFunction } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

interface SessionRequest extends Request {
  sessionData?: {
    sessionId: string;
    sessionPath: string;
  };
}

const checkSessionPublicDir = (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const sessionId = res.locals.sessionId;
    if (!sessionId) {
      return res.status(401).send({
        error: "no session ID, can not send message"
      });
    }

    const dirPath = fileURLToPath(dirname(import.meta.url));
    const sessionDirPath = join(dirPath, `../../../${process.env.PUBLIC_PATH}/sessions/${sessionId}`);

    if (!fs.existsSync(sessionDirPath)) {
      fs.mkdirSync(sessionDirPath, {
        recursive: true
      });
    }

    req.sessionData = {
      sessionId,
      sessionPath: sessionDirPath
    };

    next();

  } catch (error) {

    if (error instanceof Error) {
      return res.status(500).send({
        error: error.message
      });
    } else {
      return res.status(500).send({
        error: "unkwon error accured"
      });
    }
  }
};

export default checkSessionPublicDir;