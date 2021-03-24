import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWTUtils } from "../utils/jwt.utils";
import { AjaxResult } from "../model/ajax-result";
import { ResultCodeEnum } from "../enums/result-code.enum";
import JwtConfig from "../config/jwt.config";
export const checkToken = () => {
  return async (req: Request, rsp: Response, next: NextFunction) => {
    const token = JWTUtils.getToken(req);
    const publicKey = JWTUtils.getPublicKey();
    if (token) {
     
      jwt.verify(token, publicKey, JwtConfig.JWT_VERIFY_OPTIONS, (err, decoded: any) => {
        if (err || !decoded) {
          if(err.name == "TokenExpiredError"){
            return rsp.send(new AjaxResult(ResultCodeEnum.TOKENEXPIREERROR));
          }
          return rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED));
        }
        rsp.locals.jwtPayload = decoded;
        next();
      });
    } else {
      return rsp.send(new AjaxResult(ResultCodeEnum.UNAUTHORIZED));
    }
    return;
  }
};
