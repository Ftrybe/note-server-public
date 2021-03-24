import { Request, Response } from "express";
import { AjaxResult } from "../model/ajax-result";
import { SysMemorandumTag } from "../entity/sys-memorandum-tag.entity";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { SysMemorandum } from "../entity/sys-memorandum.entity";
import { SysMemorandumTagScope } from "../entity/sys-memorandum-tag-scope.entity";
import { SelectQueryBuilder } from "typeorm";
import { ObjectUtils } from "../utils/object.utils";
import { SysMemorandumTagUserScope } from "../entity/sys-memorandum-tag-user-scope.entity";
import { UserUtils } from "../utils/user.utils";

export class SysMemorandumTagController {

    public static async get(req: Request, rsp: Response) {
        let tagId = req.params.id;
        const page = req.query.page as string;
        let result = null;
        if (tagId == "0") {
            tagId = null;
        }
        try {
            const memoIds = await SysMemorandumTagScope.find({
                select: ["memorandumId"],
                where: {
                    memorandumTagId: tagId
                }
            })
            result = await DBUtils.list({ entityClass: SysMemorandum }, page, async (info: SelectQueryBuilder<unknown>) => {
                return info.andWhereInIds(memoIds);
            })

        } catch (err) {
            rsp.send(AjaxResult.fail("获取失败"));
            return;
        }
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(result);
        rsp.send(ajaxResult);
    }

    public static async list(req: Request, rsp: Response) {
        const uid = UserUtils.getUserId(rsp);
        const userTag = new SysMemorandumTagUserScope();
        userTag.userId = uid;
        const result = await SysMemorandumTag.createQueryBuilder("mt")
            .select("mt").leftJoinAndSelect(SysMemorandumTagUserScope, "mu", "mu.tag_id = mt.id").where("mu.user_id = :userId ", { userId: uid })
            .getMany();
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(result);
        rsp.send(ajaxResult);
    }

    public static async delete(req: Request, rsp: Response) {
        let id = req.params.id;
        const result = await DBUtils.transaction({
            handle: async () => {
                await SysMemorandumTag.delete(id);
                return await SysMemorandumTagScope.createQueryBuilder().delete().where("tag_id = :tagId", { tagId: id }).execute();
            },
            error: () => {
                rsp.send(AjaxResult.fail("删除失败"));
                return;
            }
        })
        if (result) {
            rsp.send(AjaxResult.success("删除成功"));
        }
    }


    public static async save(req: Request, rsp: Response) {
        let memorandumTag: SysMemorandumTag = req.body;
        if (await ClassValidateUtils.add(SysMemorandumTag, memorandumTag, rsp)) {
            return;
        }
        const result = await DBUtils.transaction({
            handle: async () => {
                let memoTags = await SysMemorandumTag.findOne({ where: { name: memorandumTag.name } });
                if (ObjectUtils.isEmpty(memoTags)) {
                    memoTags = await SysMemorandumTag.save(memorandumTag);
                }

                const userTags = await SysMemorandumTagUserScope.find({
                    where: {
                        userId: UserUtils.getUserId(rsp),
                        tagId: memoTags.id
                    }
                })
                if (ObjectUtils.isNotEmpty(userTags)) {
                    rsp.send(AjaxResult.fail("已添加该标签"));
                    return;
                }
                const userTag = new SysMemorandumTagUserScope();
                userTag.userId = UserUtils.getUserId(rsp);
                userTag.createId = UserUtils.getUserId(rsp);
                userTag.tagId = memoTags.id;
                return await SysMemorandumTagUserScope.insert(userTag)
            },
            error: () => {
                rsp.send(AjaxResult.fail("添加失败"));
                return;
            }
        })
        if (result) {
            rsp.send(AjaxResult.success("添加成功"));
        }
    }


    public static async update(req: Request, rsp: Response) {
        let memorandumTag: SysMemorandumTag = req.body;
        if (await ClassValidateUtils.edit(SysMemorandumTag, memorandumTag, rsp)) {
            return;
        }
        try {
            await SysMemorandumTag.save(memorandumTag);
        } catch (err) {
            rsp.send(AjaxResult.fail("修改失败"));
            return;
        }
        rsp.send(AjaxResult.success("修改成功"));
    }

}