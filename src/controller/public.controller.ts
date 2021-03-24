import { Request, Response } from "express";
import { SelectQueryBuilder } from "typeorm";
import { SysDiary } from "../entity/sys-diary.entity";
import { SysUser } from "../entity/sys-user.entity";
import { AjaxResult } from "../model/ajax-result";
import { DBUtils } from "../utils/db.utils";
import { ObjectUtils } from "../utils/object.utils";
export class PublicController {

    public static async list(req: Request, rsp: Response) {
        // 没有body
        let sysDiary: SysDiary = ObjectUtils.JsonToClass(req.query.entity as string, SysDiary);
        let page = req.query.page as string;
        sysDiary.visible = true;
        const result = await DBUtils.list({ entityClass: SysDiary, entityData: sysDiary }, page, (info: SelectQueryBuilder<SysDiary>) => {
            info.leftJoinAndMapOne("tb.userInfo", SysUser, "user", "tb.create_id = user.id");
            return info;
        });
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(result);
        rsp.send(ajaxResult);
    }

}
