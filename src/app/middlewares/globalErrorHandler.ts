import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../helper/AppError";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  // 1️⃣ Handle Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // 2️⃣ Handle Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error";

    error = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }
  // 3️⃣ Handle Prisma Known Errors
  else if (err instanceof PrismaClientKnownRequestError) {
    // Duplicate record (unique constraint)
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = `${err.meta?.target} already exists.`;
    }

    // Record not found
    if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "Record not found";
    }
  }
  // 4️⃣ Handle Native JS Errors
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
