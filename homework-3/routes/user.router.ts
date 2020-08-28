import express, { Request, Response } from "express";
import { defaultTo } from "lodash";
import { UsersModel } from "../models/users.model";
import { ResultCodeValues } from "../types/results";
import { UserResponse } from "../types/user";
import { UserController } from "./controllers/user.controller";
import {
  UserCreateSchema,
  UserUpdateSchema
} from "./validations/user-validation";

const userController = new UserController();

const UserRoutes = {
  suggest: "/user/suggest",
  user_id: "/user/:id",
  user: "/user",
};

export const userRouter = express.Router();

userRouter.param(
  "id",
  async (req: express.Request, res: express.Response, next) => {
    const { id } = req.params;

    const userExist: boolean = await userController.userExists(id);

    if (!userExist) {
      res.status(404).send({
        message: `User with id ${req.params.id} is not found.`,
      });
    } else {
      next();
    }
  }
);

// query param: loginSubstring and limit
// example: /user/suggest?limit=5&loginSubstring=har
// returns array of found users
userRouter.get(
  UserRoutes.suggest,
  async (req: Request, res: Response<UserResponse>, next) => {
    const loginSubstring: string = defaultTo(req.query.loginSubstring, "")
      .toString()
      .toLowerCase();
    const limit: number = +defaultTo(req.query.limit, "");

    try {
      const users = await userController.getSuggestString(
        loginSubstring,
        limit
      );
      if (users === null) {
        next();
      } else {
        res.status(200).send({ users });
      }
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  UserRoutes.user_id,
  async (req: Request, res: Response<UserResponse>, next) => {
    const userId = req.params.id;
    try {
      const user = await userController.getUser(userId);
      if (user === null) {
        next();
      } else {
        res.status(200).json(user);
      }
    } catch (err) {
      next(err);
    }
  }
);

userRouter.put(
  UserRoutes.user_id,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = userController.validateReq(
      req.body,
      UserUpdateSchema
    );
    if (validationResult.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(400).send({
        message: "validation requirements are not met",
        errors: validationResult.value,
      });
    }

    const id = req.params.id;
    const { age, login, password } = req.body;

    try {
      const updatedUser: boolean | null = await userController.updateUser({
        id,
        age,
        login,
        password,
      });
      if (!updatedUser) {
        next;
      } else {
        res.status(200).send();
      }
    } catch (err) {
      next(err);
    }
  }
);

userRouter.post(
  UserRoutes.user,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = userController.validateReq(
      req.body,
      UserCreateSchema
    );
    if (validationResult.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(400).send({
        message: "validation requirements are not met",
        errors: validationResult.value,
      });
    }

    const { age, login, password } = req.body;

    try {
      const createdUser = await userController.createUser({
        age,
        login,
        password,
      });

      if (createdUser === null) {
        next();
      } else {
        res.status(201).send(createdUser);
      }
    } catch (err) {
      next(err);
    }
  }
);

userRouter.delete(
  UserRoutes.user_id,
  async (req: Request, res: Response<{ message: string }>, next) => {
    const userId = req.params.id;
    try {
      const result: any = await userController.deleteUser(userId);

      if (result !== null) {
        res.status(200).send({
          message: `User with id ${userId} was deleted.`,
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
);
