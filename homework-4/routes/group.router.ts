import express, { NextFunction, Request, Response } from "express";
import { GroupController } from "../controllers/group.controller";
import { GroupResponse } from "../types/group";
import { ResultCodeValues } from "../types/results";
import { UserResponse } from "../types/user";
import { safeRun, sendResult, validateReq } from "../utils/router.utils";
import { GroupCreateSchema, GroupUpdateSchema, GroupUsersSchema } from "./validations/group-validation";

const groupController = new GroupController();

const GroupRoutes = {
  group_id: "/group/:id",
  group: "/group",
  groupUsers: "/group/:id/users"
};

export const groupRouter = express.Router();

groupRouter.param(
  "id",
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { id } = req.params;
    const groupExist: boolean | null = await groupController.exists(id);

    if (!groupExist) {
      res.status(404).send({
        message: `Group with id ${req.params.id} is not found.`,
      });
    } else {
      next();
    }
  }
);

groupRouter.get(
  GroupRoutes.group,
  async (req: Request, res: Response<GroupResponse>, next: NextFunction) => {
    await safeRun(async () => {
      const groups = await groupController.getAll();
      sendResult(groups, res, next);
    }, next);
  }
);
groupRouter.get(
  GroupRoutes.group_id,
  async (req: Request, res: Response<GroupResponse>, next: NextFunction) => {
    const groupId = req.params.id;
    await safeRun(async () => {
      const group = await groupController.get(groupId);
      sendResult(group, res, next);
    }, next);
  }
);

groupRouter.put(
  GroupRoutes.group_id,
  async (req: Request, res: Response<GroupResponse>, next: NextFunction) => {
    const validationResult = validateReq(
      req.body,
      GroupUpdateSchema
    );
    if (validationResult.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(400).send({
        message: "validation requirements are not met",
        errors: validationResult.value,
      });
    }

    const id = req.params.id;
    const { name, permissions } = req.body;

    await safeRun(async () => {
      const updatedGroup: boolean | null = await groupController.update({
        id,
        name,
        permissions
      });
      if (updatedGroup !== null) {
        res.status(200).send({
          message: `Group with id ${updatedGroup} was updated.`,
        });
      } else {
        next();
      }
    }, next);
  }
);

groupRouter.post(
  GroupRoutes.group,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = validateReq(
      req.body,
      GroupCreateSchema
    );
    if (validationResult.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(400).send({
        message: "validation requirements are not met",
        errors: validationResult.value,
      });
    }

    const { name, permissions } = req.body;
    const group = {name, permissions};

    await safeRun(async () => {
      const createdGroup = await groupController.create(group);
      sendResult(createdGroup, res, next, 201);
    }, next);
  }
);

groupRouter.delete(
  GroupRoutes.group_id,
  async (req: Request, res: Response<{ message: string }>, next: NextFunction) => {
    const groupId = req.params.id;
    
    await safeRun(async () => {
      const result = await groupController.delete(groupId);
      if (result !== null) {
        res.status(200).send({
          message: `Group with id ${groupId} was deleted.`,
        });
      } else {
        next();
      }
    }, next);
  }
);


groupRouter.post(
  GroupRoutes.groupUsers,
  async (req: Request, res: Response<UserResponse>, next) => {
    const validationResult = validateReq(
      req.body,
      GroupUsersSchema
    );
    if (validationResult.code === ResultCodeValues.CODE_VALIDATION_ERROR) {
      res.status(400).send({
        message: "validation requirements are not met. You should pass array of user ids",
        errors: validationResult.value,
      });
    }

    const users: string[] = req.body.ids;
    const {id} = req.params;

    await safeRun(async () => {
      const result: boolean | null = await groupController.addUsers(id, users);
      sendResult(result, res, next);
    }, next);
  }
);


