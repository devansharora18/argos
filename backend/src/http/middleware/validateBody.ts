import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../../utils/errors';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        issue: issue.message,
      }));

      next(
        new AppError({
          code: 'VALIDATION_ERROR',
          message: 'Request body validation failed',
          httpStatus: 400,
          details,
        })
      );
      return;
    }

    req.body = result.data;
    next();
  };
}
