import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import { userRouter } from "./routes/user.router";

const SERVER_PORT = process.env.SERVER_PORT || 3000;

export function startServer() {
  const app = express();

  // without this express always see req.body as undefined
  app.use(express.json());

  // logs
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.json()),
      meta: false,
    })
  );

  app.use("/", userRouter);

  app.listen(SERVER_PORT, function () {
    console.log("User REST API app listening on port 3000!");
  });
}
