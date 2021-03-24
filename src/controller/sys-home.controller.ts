import { Request, Response } from "express";
import { SysHome } from "../entity/sys-home.entity";
import { DisplayStateEnum } from "../enums/display-state.enum";
import { AjaxResult } from "../model/ajax-result";
import ClassValidateUtils from "../utils/class-validate.utils";

export class SysHomeController {

    //根据ID获取
    public static async get(req: Request, rsp: Response) {
        let id = req.params.id;
        let home = null;
        try {
            home = await SysHome.findOneOrFail(id);
        } catch (error) {
            rsp.send(AjaxResult.fail("无"));
            return;
        }

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(home);
        rsp.send(ajaxResult);
    }

    //根据ID删除
    public static async delete(req: Request, rsp: Response) {
        let id = req.params.id;
        let SysHome = null;
        try {
            SysHome = await SysHome.findOneOrFail(id);
            SysHome.state = DisplayStateEnum.DELETE;
            await SysHome.update(id, SysHome);
        } catch (error) {
            rsp.send(AjaxResult.fail("删除失败"));
            return;
        }
        rsp.send(AjaxResult.success("删除成功"));
    }

    //保存
    public static async save(req: Request, rsp: Response) {
        let home: SysHome = req.body;

        if (await ClassValidateUtils.add(SysHome, home, rsp, false)) {
            return;
        }
        try {
            await SysHome.insert(home);
        } catch (err) {
            console.warn(err);
            rsp.send(AjaxResult.fail("添加失败"));
            return;
        }
        rsp.send(AjaxResult.success("添加成功"));
    }

    // 编辑
    public static async update(req: Request, rsp: Response) {
        // const id = req.params.id;
        const home: SysHome = req.body;
        if (await ClassValidateUtils.edit(SysHome, home, rsp, false)) {
            return;
        }
        try {
            await SysHome.update(home.id, home);
        } catch (error) {
            rsp.send(AjaxResult.fail("更新失败"));
        }
        rsp.send(AjaxResult.success("更新成功"));
    }

}
