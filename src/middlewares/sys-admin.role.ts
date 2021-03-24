import { NextFunction, Request, Response } from "express";
import { AjaxResult } from "../model/ajax-result";
import { ResultCodeEnum } from "../enums/result-code.enum";
import { RoleEnum } from "../enums/role.enum";

export const checkAdmin = () => {
    return async (req: Request, rsp: Response, next: NextFunction) => {
        //Get the user ID from previous middleware
        const role = rsp.locals.jwtPayload.role;
        if (role === RoleEnum.ADMIN) {
            next();
            return;
        } 
        rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED, "您无当前操作权限"));
        return;
    };
};