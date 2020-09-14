import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import { userRouter } from "./routes/user.router";
import { groupRouter } from "./routes/group.router";

const SERVER_PORT = process.env.SERVER_PORT || 3000;


export function startServer() {
  const app = express();

  // without this express always see req.body as undefined
  app.use(express.json());

  // logs (task 5.1)
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.json()),
      meta: false,
    })
  );

  app.use("/", userRouter);
  app.use("/", groupRouter);

  // needs to be added !after! the express router and !before! error handlers
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

  // task 5.2, p.1
  app.use(function (err:any, req:any, res:any, next:any) {
    const message = err.message || "something went wrong";
    res.status(500).send({ error: message});
  })

  app.listen(SERVER_PORT, function () {
    console.log("Server has started app listening on port 3000!");
  });
}
