import { JWTUtils } from "./jwt.utils";
import { Request, Response } from "express";
import { SysLocalAuth } from "../entity/sys-local-auth.entity";
import { ActiveStateEnum } from "../enums/active-state.enum";
/* 
    用户信息工具类，获得用户信息
*/
export class UserUtils {

    // 获得用户ID
    public static getUserId(rsp: Response) {
        const uid = rsp.locals.jwtPayload.uid;
        return uid;
    }

    // 获取payload
    private static getPayload(req) {
        const token = JWTUtils.getToken(req);
        return token ? JWTUtils.decodeToken(token).payload : null;

    }

    // 判断用户是否禁用
    public static isDisable(id):boolean{
        let isDisable = false;
          SysLocalAuth.findOne(id,{
            select: ["state"]
        }).then(
            result => isDisable = (result.state === ActiveStateEnum.DISABLE)
        );
        return isDisable;
    }
}