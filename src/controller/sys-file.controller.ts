import { Request, Response } from "express";
import { SelectQueryBuilder } from "typeorm";
import { SysFile } from "../entity/sys-file.entity";
import { AjaxResult } from "../model/ajax-result";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { JWTUtils } from "../utils/jwt.utils";
import { ObjectUtils } from "../utils/object.utils";
import LogsUtils from "../utils/logs.utils";
import { BcryptUtils } from "../utils/bcrypt.utils";
import { RoleEnum } from "../enums/role.enum";
import  OSSClient from "../config/ali-oss.config";
import OSS, { Credentials } from "ali-oss";

export class SysFileController {

    //根据ID获取
    public static async get(req: Request, rsp: Response) {
        LogsUtils.info(req);
        let id = req.params.id;
        let password = req.query.password as string;
        let file:SysFile = null;
        const decode = JWTUtils.getUserInfo(req);
       
        try {
            file = await SysFile.findOneOrFail(id);
            if(decode){
                if(decode.role == RoleEnum.ADMIN){
                    file.password = null
                }
             }
            if(ObjectUtils.isNotEmpty(file.password)){
              if (!BcryptUtils.checkIfUnencryptedPasswordIsValid(password,file.password)){
                 rsp.send(AjaxResult.fail("密码不正确"));
                 return;
              }
            }
        } catch (error) {
            rsp.send(AjaxResult.fail("获取失败"));
            return;
        }

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(file);
        rsp.send(ajaxResult);
    }

    public static async getPrivateFile(req: Request, rsp: Response) {
        let userId = rsp.locals.jwtPayload.uid;
        const { type } = req.query;
        let id = req.params.id;
        let file:SysFile = null;
       
        try {
            file = await SysFile.findOneOrFail(id);
            const oss = new OSSClient();
            const token: Credentials = await oss.getToken(type + "/" + userId, "session" + userId, false);
    
            const client = oss.client({
                region: oss.Region,
                accessKeyId: token.AccessKeyId,
                accessKeySecret: token.AccessKeySecret,
                stsToken: token.SecurityToken,
                bucket: oss.Bucket
            });
             const url = client.signatureUrl(file.filename);
             file.url = url;
            
        } catch (error) {
            rsp.send(AjaxResult.fail("获取失败"));
            return;
        }

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(file);
        rsp.send(ajaxResult);
    }
    
    //显示所有日记
    public static async list(req: Request, rsp: Response) {

        let sysFile = ObjectUtils.JsonToClass(req.query.entity as string, SysFile);
        let page = req.query.page as string;
       
        if(sysFile.type == ""){
            sysFile.type = "audio";
        }
   
        const result = await DBUtils.list({ entityClass: SysFile, entityData: sysFile,select: ""}, page, (info:SelectQueryBuilder<unknown>)=>{
            info.addSelect("tb.id");
            info.addSelect("tb.createTime");
            info.addSelect("tb.title");
            info.addSelect("tb.password");
            info.addSelect("tb.type");
            let uid = JWTUtils.getUserId(req);
            
            if(!uid){
                info.andWhere("tb.targetUser = :target",{target: 'all'});
                return info;
            }
            if(sysFile.targetUser == undefined || sysFile.targetUser == null || sysFile.targetUser == ""){
                info.andWhere("(tb.targetUser = :target or tb.targetUser = :uid or tb.createId = :uid)",{
                    target: 'all',
                    uid: uid
                })
                return info;
            }
            
            return info;
        } );
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(result);
        rsp.send(ajaxResult);
    }


    //根据ID删除
    public static async delete(req: Request, rsp: Response) {
        let id = req.params.id;
        let sysFile = null;
        try {
            sysFile = await SysFile.findOneOrFail(id);
            await SysFile.delete(id);
        } catch (error) {
            rsp.send(AjaxResult.fail("删除失败"));
            return;
        }
        rsp.send(AjaxResult.success("删除成功"));
    }

    //保存
    public static async save(req: Request, rsp: Response) {
        let file: SysFile = req.body;

        if (await ClassValidateUtils.add(SysFile, file, rsp, false)) {
            return;
        }
        try {
            if(ObjectUtils.isNotEmpty(file.password)){
                file.password = BcryptUtils.hashPassword(file.password);
            }
            await SysFile.insert(file);
        } catch (err) {
            rsp.send(AjaxResult.fail("添加失败"));
            return;
        }
        rsp.send(AjaxResult.success("添加成功"));
    }

    // 编辑
    public static async update(req: Request, rsp: Response) {
        // const id = req.params.id;
        const file: SysFile = req.body;
        if (await ClassValidateUtils.edit(SysFile, file, rsp, false)) {
            return;
        }
        try {
            if(ObjectUtils.isNotEmpty(file.password) && file.password.length < 20){
                file.password = BcryptUtils.hashPassword(file.password);
            }
            await SysFile.update(file.id, file);
        } catch (error) {
            rsp.send(AjaxResult.fail("更新失败"));
        }
        rsp.send(AjaxResult.success("更新成功"));
    }

}
