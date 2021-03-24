import { NextFunction, Request, Response } from "express";
import { SysUser } from "../entity/sys-user.entity";
import { AjaxResult } from "../model/ajax-result";
import { ResultCodeEnum } from "../enums/result-code.enum";
import { RoleEnum } from "../enums/role.enum";

export const checkUser = (params?: any) => {
    return async (req: Request, rsp: Response, next: NextFunction) => {
        //Get the user ID from previous middleware
        let id = req.params.id;
        const role = rsp.locals.jwtPayload.role;
        if (role === RoleEnum.ADMIN) {
            next();
            return;
        } else {
            const uid = rsp.locals.jwtPayload.uid;
            let user: SysUser = null;
            try {
                user = await SysUser.findOneOrFail(id, {
                    select: ['id']
                });
            } catch (error) {
                rsp.send(AjaxResult.fail("获取失败"));
                return;
            }
            if (user.id === uid) {
                next();
                return;
            }
        }
        rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED, "您无当前操作权限"));
        return;
    };
};