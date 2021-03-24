import OSS from "ali-oss";
import { Request, Response } from "express";
import AliyunConfig from "../config/ali-oss.config";
import { AjaxResult } from "../model/ajax-result";

export class AliyunController {

    public static async getSts(req: Request, rsp: Response) {
        let userId = rsp.locals.jwtPayload.uid;
        const { type,read } = req.query;
        let client = new AliyunConfig();
        let isWrite = true;
        if(read){
            isWrite = false
        }
        const token = await client.getToken(type + "/" + userId, "session" + userId,isWrite);
        if (token) {
            const ajaxResult = new AjaxResult();
            ajaxResult.setData(token);
            rsp.send(ajaxResult);
        } else {
            rsp.send(AjaxResult.fail("获取临时签名失败"));
        }
    }

}