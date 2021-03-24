import { Request, Response, NextFunction } from "express";
import { SysDiary } from "../entity/sys-diary.entity";
import { AjaxResult } from "../model/ajax-result";
import { RoleEnum } from "../enums/role.enum";
import { DisplayStateEnum } from "../enums/display-state.enum";
import { Not } from "typeorm";
import { ResultCodeEnum } from "../enums/result-code.enum";

export const checkDiary = (params?: any) => {
  return async (req: Request, rsp: Response, next: NextFunction) => {
    //Get the user ID from previous middleware
    let id = req.params.id;
    const role = rsp.locals.jwtPayload.role;
    if (role === RoleEnum.ADMIN) {
      next();
      return;
    } else {
      const uid = rsp.locals.jwtPayload.uid;
      let diary: SysDiary = null;
      try {
        diary = await SysDiary.findOneOrFail(id, {
          where: {
            delFlag: false
          }
        });
      } catch (error) {
        rsp.send(AjaxResult.fail("获取失败"));
        return;
      }
      if (diary.createId === uid) {
        next();
        return;
      }
    }
    rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED, "您无当前操作权限"));
    return;
  };
};