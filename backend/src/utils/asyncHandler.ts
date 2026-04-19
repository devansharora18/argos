import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRouteHandler<TReq extends Request = Request, TRes extends Response = Response> = (
	req: TReq,
	res: TRes,
	next: NextFunction,
) => Promise<void>;

export function asyncHandler<TReq extends Request = Request, TRes extends Response = Response>(
	handler: AsyncRouteHandler<TReq, TRes>,
): RequestHandler {
	return (req, res, next) => {
		handler(req as TReq, res as TRes, next).catch(next);
	};
}
