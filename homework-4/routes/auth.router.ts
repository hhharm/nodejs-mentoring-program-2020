import express, { NextFunction, Request, Response } from "express";
import { AppAuthService } from "../services/auth.service";
import { safeRun, sendResult } from "../utils/router.utils";

const authService = new AppAuthService();

const authRoutes = {
  login: "/login"
};

export const authRouter = express.Router();

// query param: username and password
// example: /login?username=kolya&password=123
// returns JWT token
authRouter.get(
  authRoutes.login,
  async (req: Request, res: Response, next: NextFunction) => {
    const login: string = (req.query.username ?? "").toString();
    const password: string = (req.query.password ?? "").toString();

    await safeRun(async () => {
      const token = await authService.getToken(login, password);
      if (token === null) {
        res.status(401).send(`Not found user with login "${login}" and password "${password}"`);
      } else {
        res.status(200).send({token});
      }
    }, next);
  }
);