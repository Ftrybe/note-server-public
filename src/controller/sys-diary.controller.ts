import { Request, Response } from "express";
import { SysDiary } from "../entity/sys-diary.entity";
import { DisplayStateEnum } from "../enums/display-state.enum";
import { AjaxResult } from "../model/ajax-result";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { ObjectUtils } from "../utils/object.utils";
/* 
    日记接口
*/
export class SysDiaryController {

    //显示所有日记
    public static async list(req: Request, rsp: Response) {

        let sysDiary = ObjectUtils.JsonToClass(req.query.entity as string, SysDiary);
        let page = req.query.page as string;
        sysDiary.createId = rsp.locals.jwtPayload.uid;
        const result = await DBUtils.list({ entityClass: SysDiary, entityData: sysDiary }, page);
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(result);
        rsp.send(ajaxResult);
    }

    //根据ID获取
    public static async get(req: Request, rsp: Response) {
        let id = req.params.id;
        let diary = null;
        try {
            diary = await SysDiary.findOneOrFail(id);
        } catch (error) {
            rsp.send(AjaxResult.fail("无当前日记"));
            return;
        }

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(diary);
        rsp.send(ajaxResult);
    }

    //根据ID删除
    public static async delete(req: Request, rsp: Response) {
        let id = req.params.id;
        let sysDiary:SysDiary = null;
        try {
            sysDiary = await SysDiary.findOneOrFail(id);
            sysDiary.delFlag = true;
            await SysDiary.update(id, sysDiary);
        } catch (error) {
            rsp.send(AjaxResult.fail("删除失败"));
            return;
        }
        rsp.send(AjaxResult.success("删除成功"));
    }

    // 批量删除
    public static async batchDelete(req: Request, rsp: Response) {
        const ids = req.query;
        try {
            await SysDiary.delete(ids)
        } catch (error) {
            rsp.send(AjaxResult.fail("删除失败"));
            return;
        }
        rsp.send(AjaxResult.success("删除成功"));
    }


    //保存
    public static async save(req: Request, rsp: Response) {
        let diary: SysDiary = req.body;
        if (await ClassValidateUtils.add(SysDiary, diary, rsp, false)) {
            return;
        }
        let id = null;
        try {
            id = await SysDiary.insert(diary);
        } catch (err) {
            console.warn(err);
            rsp.send(AjaxResult.fail("添加失败"));
            return;
        }
        let result = new AjaxResult();
        result.setData(id);
        rsp.send(result);
    }

    // 编辑
    public static async update(req: Request, rsp: Response) {
        // const id = req.params.id;
        let diary: SysDiary = req.body;
        if (await ClassValidateUtils.edit(SysDiary, diary, rsp, false)) {
            return;
        }
        try {
            await SysDiary.update({
                id: diary.id
            }, diary);
        } catch (error) {
            console.warn(error);
            rsp.send(AjaxResult.fail("更新失败"));
            return;
        }
        rsp.send(AjaxResult.success("更新成功"));
    }

}

