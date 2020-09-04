import express, { NextFunction, Request, Response } from "express";
import { defaultTo } from "lodash";
import { UserController } from "../controllers/user.controller";
import { ResultCodeValues } from "../types/results";
import { UserResponse } from "../types/user";
import { sendResult, safeRun, validateReq } from "../utils/router.utils";
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

    await safeRun(async () => {
      const users = await userController.getSuggestString(
        loginSubstring,
        limit
      );
      sendResult(users, res, next);
    }, next);
  }
);

userRouter.get(
  UserRoutes.user_id,
  async (req: Request, res: Response<UserResponse>, next:NextFunction) => {
    const userId = req.params.id;    
    await safeRun(async () => {
      const user = await userController.getUser(userId);
      sendResult(user, res, next);
    }, next);
  }
);

userRouter.put(
  UserRoutes.user_id,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = validateReq(
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
    const user = {id,
      age,
      login,
      password};

    await safeRun(async () => {
      const updatedUser: boolean | null = await userController.updateUser(user);
      sendResult(updatedUser, res, next);
    }, next);
  }
);

userRouter.post(
  UserRoutes.user,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = validateReq(
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

    await safeRun(async () => {
      const createdUser = await userController.createUser({
        age,
        login,
        password,
      });
      sendResult(createdUser, res, next, 201);
    }, next);
  }
);

userRouter.delete(
  UserRoutes.user_id,
  async (req: Request, res: Response<{ message: string }>, next) => {
    const userId = req.params.id;
    await safeRun(async () => {
      const result: any = await userController.deleteUser(userId);
      if (result !== null) {
        res.status(200).send({
          message: `User with id ${userId} was deleted.`,
        });
      } else {
        next();
      }
    }, next);
  }
);
