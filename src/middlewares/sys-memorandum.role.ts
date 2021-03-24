import { NextFunction, Request, Response } from "express";
import { SysMemorandum } from "../entity/sys-memorandum.entity";
import { AjaxResult } from "../model/ajax-result";
import { ResultCodeEnum } from "../enums/result-code.enum";
import { RoleEnum } from "../enums/role.enum";
import { SysMemorandumTagScope } from "../entity/sys-memorandum-tag-scope.entity";
import { ObjectUtils } from "../utils/object.utils";

export const checkMemorandum = (params?: any) => {
    return async (req: Request, rsp: Response, next: NextFunction) => {
        //Get the user ID from previous middleware
        let id = req.params.id;

        const role = rsp.locals.jwtPayload.role;
        if (role === RoleEnum.ADMIN) {
            next();
            return;
        } else {
            const uid = rsp.locals.jwtPayload.uid;
            let memorandumTagScopes: SysMemorandumTagScope[] = null;
            try {
                memorandumTagScopes =await SysMemorandumTagScope.find({
                    where:{
                        userId: uid,
                        memorandumId: id
                    }
                })

            } catch (error) {
                rsp.send(AjaxResult.fail("获取失败"));
                return;
            }
            if (ObjectUtils.isNotEmpty(memorandumTagScopes)) {
                next();
                return;
            }
        }
        rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED, "您无当前操作权限"));
        return;
    };
};