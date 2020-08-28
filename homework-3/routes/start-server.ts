import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import { userRouter } from "./user.router";

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const handleError = (err: { statusCode: any; message: any }, res: any) => {
  const { statusCode = 500, message = "Ooops! Something went wrong" } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};
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

  app.use((err: any, req: any, res: any, next: any) => {
    handleError(err, res);
  });

  app.listen(SERVER_PORT, function () {
    console.log("Server has started app listening on port 3000!");
  });
}
