import express from "express";
import { Request, Response } from "express";
import { defaultTo } from "lodash";

import { User } from "../types/user";
import { UserController } from "./controllers/user.controller";
import { ResultCode, CODE_OK } from "../types/results";

const userController = new UserController();

const UserRoutes = {
  suggest: "/user/suggest",
  user_id: "/user/:id",
  user: "/user",
};

export const userRouter = express.Router();
// query param: loginSubstring and limit
// example: /user/suggest?limit=5&loginSubstring=har
// returns array of found users
userRouter.get(
  UserRoutes.suggest,
  (req: Request, res: Response<{ users: User[] }>) => {
    const loginSubstring: string = defaultTo(req.query.loginSubstring, "")
      .toString()
      .toLowerCase();
    const limit: number = +defaultTo(req.query.limit, "");

    const users = userController.getSuggestString(loginSubstring, limit);

    res.status(200).send({ users });
  }
);

userRouter.get(
  UserRoutes.user_id,
  (req: Request, res: Response<User | { message: string }>) => {
    const userId = req.params.id;

    const user = userController.getUser(userId);

    if (!user) {
      res.status(404).send({
        message: `User with id ${userId} is not found.`,
      });
    } else {
      res.status(200).json(user);
    }
  }
);

userRouter.put(
  UserRoutes.user_id,
  (req: Request, res: Response<User | { message: string }>) => {
    const id = req.params.id;
    const { age, login, password } = req.body;

    const updatedUser: User | undefined = userController.updateUser({
      id,
      age,
      login,
      password,
    });

    if (!updatedUser) {
      const body = {
        message: `User with id ${req.params.id} is not found.`,
      };
      res.status(404).send(body);
    } else {
      res.status(200).send(updatedUser);
    }
  }
);

userRouter.post(UserRoutes.user, (req: Request, res: Response<User>) => {
  const { age, login, password } = req.body;

  const createdUser: User = userController.createUser({ age, login, password });

  res.status(201).json(createdUser);
});

userRouter.delete(
  UserRoutes.user_id,
  (req: Request, res: Response<{ message: string }>) => {
    const userId = req.params.id;

    const resultCode: ResultCode = userController.deleteUser(userId);

    if (resultCode.code === CODE_OK) {
      res.status(200).send({
        message: `User with id ${userId} was deleted.`,
      });
    } else {
      res.status(404).send({
        message: `User with id ${userId} is not found.`,
      });
    }
  }
);
