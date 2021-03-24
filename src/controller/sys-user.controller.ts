
import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { SysLocalAuth } from "../entity/sys-local-auth.entity";
import { SysUser } from "../entity/sys-user.entity";
import { ActiveStateEnum } from "../enums/active-state.enum";
import { AjaxResult } from "../model/ajax-result";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { ObjectUtils } from "../utils/object.utils";

export class SysUserController {

    // 获得所有用户 分页处理
    public static async list(req: Request, rsp: Response) {
        const sysUser: SysUser = ObjectUtils.JsonToClass(req.query.entity as string, SysUser);
        let page = req.query.page as string;
        //  负页默认第一页
        const list = await DBUtils.list({ entityClass: SysUser, entityData: sysUser }, page);
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(list);
        rsp.send(ajaxResult);
    }

    public static async get(req: Request, rsp: Response) {
        let id = req.params.id;
        let user = null;
        try {
            user = await SysUser.findOneOrFail(id, {
                where: { state: ActiveStateEnum.STANDARD }
            });
        } catch (err) {
            rsp.send(AjaxResult.fail("获取用户信息失败"));
            return;
        }

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(user);
        rsp.send(ajaxResult);
    }


    // 修改资料
    public static async update(req: Request, rsp: Response) {
        const id = rsp.locals.jwtPayload.uid;
        let user = req.body;
        const sysuser = plainToClass(SysUser, user);
        if (await ClassValidateUtils.edit(SysUser, user, rsp)) {
            return;
        }
        DBUtils.transaction({
            handle: async () => {
                await SysUser.update(id, sysuser);
            }, error: () => {
                rsp.send(AjaxResult.fail("信息修改失败"));
                return;
            }
        })
        rsp.send(AjaxResult.success("修改成功"));
    };

    public static async photo(req: Request, rsp: Response) {
        
    }
    
    // 注销用户
    public static async delete(req: Request, rsp: Response) {
        let id = req.params.id;

        await SysUser.delete(id);
        await SysLocalAuth.delete({ userId: id });

        rsp.send(AjaxResult.success("注销成功"));
    }
    // 添加用户
    public static async save(req: Request, rsp: Response) {

        rsp.send(AjaxResult.success("添加成功"));
    }


    // 禁用用户
    public static async disable(req: Request, rsp: Response) {
        let id = req.params.id;
        let auth = await SysLocalAuth.findOneOrFail({
            select: ["id", "state"],
            where: {
                userId: id
            }
        });
        let state = (auth.state == ActiveStateEnum.DISABLE ? ActiveStateEnum.STANDARD : ActiveStateEnum.DISABLE);
        await SysLocalAuth.update(auth.id, { state: state });
        rsp.send(AjaxResult.success("修改成功"));
    }

    public static async currentUser(req: Request, rsp: Response) {
        const id = rsp.locals.jwtPayload.uid;
        const info = await DBUtils.transaction({
            handle: async () => {
                const user = await SysUser.findOneOrFail(id, {
                    where: { state: ActiveStateEnum.STANDARD }
                });

                const auth = await SysLocalAuth.findOneOrFail({
                    where: {
                        userId: id
                    }
                });
                user.phone = auth.phone;
                user.username = auth.username;
                user.role = auth.role;
                return user;
            },
            error: () => {
                rsp.send(AjaxResult.fail("获取用户信息失败"));
            }
        });

        const ajaxResult = new AjaxResult();
        ajaxResult.setData(info);
        rsp.send(ajaxResult);
    }

};

