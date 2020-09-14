import { ValidationErrorItem, ValidationResult } from "@hapi/joi";
import { NextFunction, Response } from "express";
import { ResultCode, resultCode, ResultCodeValues } from "../../homework-3/types/results";

export async function safeRun(func: () => {}, next: NextFunction) {
    try {
      await func();
    } catch (err) {
      next(err);
    }
  }
  
export function sendResult<T>(
    result: T | null,
    response: Response<T>,
    next: NextFunction,
    okCode: number = 200,
  ) {
    if (result === null) {
      next(new Error("unexpected result"))
    } else {
      response.status(okCode).send(result);
    }
  }

export function validateReq(entity: Object, schema: any): ResultCode {
    const validationErrs: ValidationResult = schema.validate(entity, {
      abortEarly: false,
    });
    if (validationErrs.error && !!validationErrs.error.details.length) {
      return {
        code: ResultCodeValues.CODE_VALIDATION_ERROR,
        value: validationErrs.error.details.map((item: ValidationErrorItem) =>
          item.message.replace(/["]/g, "'")
        ),
      };
    }
    return resultCode(ResultCodeValues.CODE_OK);
  }