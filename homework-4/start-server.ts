import express, { NextFunction, Request, Response } from "express";
import * as core from "express-serve-static-core";
import expressWinston from "express-winston";
import winston from "winston";
import cors from "cors";

import { groupRouter } from "./routes/group.router";
import { userRouter } from "./routes/user.router";
import { authRouter } from "./routes/auth.router";
import { AppAuthService } from "./services/auth.service";
import { ResultCode, ResultCodeValues } from "./types/results";

const SERVER_PORT = process.env.SERVER_PORT || 3000;

export function startServer() {
  const app = express();

  // without this express always see req.body as undefined
  app.use(express.json());

  app.use(cors());

  addLogger(app);

  // needs to be before addAuthCheck
  app.use("/", authRouter);

  addAuthCheck(app);

  app.use("/", userRouter);
  app.use("/", groupRouter);

  // needs to be added !after! the express router and !before! error handlers
  addErrorLogger(app);

  addErrorHandler(app);

  app.listen(SERVER_PORT, function () {
    console.log("Server has started app listening on port 3000!");
  });
}

function addLogger(app: core.Express): void {
  // logs (task 5.1)
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.json()),
      meta: false,
    })
  );
}

function addAuthCheck(app: core.Express): void {
  const authService = new AppAuthService();

  app.use(function (req: Request, res: Response, next: NextFunction) {
    const token: string = req.headers['n-access-token'] as string ?? "";
    const isValid: ResultCode = authService.checkToken(token);

    if (isValid.code === ResultCodeValues.CODE_NOT_FOUND) {
      res.status(401).send({message: "Unauthorized"});
    } else if (isValid.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(403).send({message: "Forbidden"});
    } else {
      next();
    }
  });
}

function addErrorLogger(app: core.Express): void {
  // task 5.2, p.1
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  }));
}

function addErrorHandler(app: core.Express) {
  // task 5.2, p.1
  app.use(function (err:any, req:any, res:any, next:any) {
    const message = err.message || "something went wrong";
    res.status(500).send({ error: message});
  })
}
