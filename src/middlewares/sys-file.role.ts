import { Request, Response, NextFunction } from "express";
import { SysFile } from "../entity/sys-file.entity";
import { AjaxResult } from "../model/ajax-result";
import { RoleEnum } from "../enums/role.enum";
import { ResultCodeEnum } from "../enums/result-code.enum";

export const checkFile = (params?: any) => {
  return async (req: Request, rsp: Response, next: NextFunction) => {
    //Get the user ID from previous middleware
    let id = req.params.id;
    const role = rsp.locals.jwtPayload.role;
    if (role === RoleEnum.ADMIN) {
      next();
      return;
    } else {
      const uid = rsp.locals.jwtPayload.uid;
      let file: SysFile = null;
      try {
        file = await SysFile.findOneOrFail(id);
      } catch (error) {
        console.log(error);
        rsp.send(AjaxResult.fail("获取失败"));
        return;
      }
      const target = file.targetUser;
      let isShow = false;
      if(target == "only" && file.createId === uid){
          isShow = true;
      }
      else if(target == "all" || target.split(",").includes(uid)){
          isShow = true;
      } 

      if (isShow) {
        next();
        return;
      }
    }
    rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED, "您无当前操作权限"));
    return;
  };
};