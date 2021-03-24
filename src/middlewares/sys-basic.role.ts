import { NextFunction, Request, Response } from "express";
import { RequestTypeEnum } from "../enums/request-type.enum";

export const addInfo = (params?: RequestTypeEnum) => {
    return async (req: Request, rsp: Response, next: NextFunction) => {
        const token = rsp.locals.jwtPayload;
        try {
            if (params == RequestTypeEnum.POST) {
                req.body.createId = token.uid;
            }
        } catch (error) {
            console.log(error);
        }
        next();
        return;
    };
};