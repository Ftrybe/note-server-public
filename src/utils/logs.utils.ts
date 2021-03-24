import { Request } from "express";
import SysAccessLog from "../entity/sys-acccess-log.entity";
import { JWTUtils } from "./jwt.utils";

export default class LogsUtils{

    public static async info(req: Request): Promise<Boolean> {
        let log:SysAccessLog = new SysAccessLog();
        try{
            let headers =  req.headers;
            log.ip = headers['x-forwarded-for'] as string;
            log.userAgent = headers['user-agent'];
            log.method = req.method;
            log.router = req.url; 
            log.createId = JWTUtils.getUserId(req);
            let result = await SysAccessLog.save(log);
            if(result){
                return true;
            }
            return false;
        }catch(e){
            return false;
        }
    }
}