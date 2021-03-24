import { Request, Response } from "express";
import { getConnection, SelectQueryBuilder } from "typeorm";
import { SysMemorandumTagScope } from "../entity/sys-memorandum-tag-scope.entity";
import { SysMemorandum } from "../entity/sys-memorandum.entity";
import { AjaxResult } from "../model/ajax-result";
import { SysMemorandumTag } from "../entity/sys-memorandum-tag.entity";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { ObjectUtils } from "../utils/object.utils";

export class SysMemorandumController {

  public static async get(req: Request, rsp: Response) {
    let id = req.params.id;
    let memorandum: SysMemorandum = null;
    try {
      memorandum = await SysMemorandum.findOneOrFail(id);
      const tagScopes = await SysMemorandumTagScope.find({
        where: {
          memorandumId: memorandum.id
        }
      });

      tagScopes.forEach(async v => {
        memorandum.tags.push(await SysMemorandumTag.findOneOrFail({
          where: {
            id: v.memorandumId
          }
        }));
      });

      // 需要得到标签名称和ID 和备忘录的基本信息
      //  result.tags = await SysMemorandumTag.findOneOrFail(tagScope.tagId);
    } catch (err) {
      rsp.send(AjaxResult.fail("获取失败"));
      return;
    }
    const ajaxResult = new AjaxResult();
    ajaxResult.setData(memorandum);
    rsp.send(ajaxResult);
  }

  public static async list(req: Request, rsp: Response) {
    const memo: SysMemorandum = ObjectUtils.JsonToClass(req.query.entity as string, SysMemorandum);
    const page = req.query.page as string;
    const uid = rsp.locals.jwtPayload.uid;
    memo.createId = uid;
    if (memo.tagId == "0") {
      memo.tagId = null;
    }
    const result = await DBUtils.list({ entityClass: SysMemorandum, entityData: memo }, page, (info: SelectQueryBuilder<unknown>) => {
      info.leftJoinAndMapOne("tb.scope", SysMemorandumTagScope, "sc", "tb.id = sc.memorandum_id");
      if (memo.tagId) {
        info.andWhere("sc.tag_id =:tagId", { tagId: memo.tagId });
      }
      return info;
    });
    const ajaxResult = new AjaxResult();
    ajaxResult.setData(result);
    rsp.send(ajaxResult);
  }

  public static async delete(req: Request, rsp: Response) {
    let id = req.params.id;
    const result = await DBUtils.transaction({
      handle: async () => {
        await SysMemorandum.delete(id);
        return  SysMemorandumTagScope.createQueryBuilder().delete().where("memorandumId = :memorandumId", { memorandumId: id });
      },
      error: () => {
        rsp.send(AjaxResult.fail("删除失败"));
        return;
      }
    })
    if (!result) {
      return;
    }
    rsp.send(AjaxResult.success("删除成功"));
  }


  public static async save(req: Request, rsp: Response) {
    let memorandum: SysMemorandum = req.body;
    if (await ClassValidateUtils.add(SysMemorandumTag, memorandum, rsp)) {
      return;
    }
    const aJaxResult = new AjaxResult();
    DBUtils.transaction({
      handle: async () => {
        const entity = await SysMemorandum.save(memorandum);
        memorandum.scope.memorandumId = entity.id;
        memorandum.scope.createId = entity.createId;
        await SysMemorandumTagScope.save(memorandum.scope);
        aJaxResult.setData(entity.id);
      },
      error: () => {
        rsp.send(AjaxResult.fail("添加失败"));
      }
    });

    // 批量添加标签
    rsp.send(aJaxResult);
  }


  public static async update(req: Request, rsp: Response) {
    let memorandum: SysMemorandum = req.body;
    if (await ClassValidateUtils.edit(SysMemorandumTag, memorandum, rsp)) {
      return;
    }
    DBUtils.transaction({
      handle: async () => {
        if (memorandum.scope.tagId == '0') {
          if(memorandum.scope.id){
            await SysMemorandumTagScope.delete(memorandum.scope.id);
          }
          memorandum.scope = null;
        } else {
          memorandum.scope.memorandumId = memorandum.id;
          await SysMemorandumTagScope.save(memorandum.scope);
        }
        
        await SysMemorandum.save(memorandum);
      },
      error: () => {
        rsp.send(AjaxResult.fail("修改失败"));
        return;
      }
    });
    rsp.send(AjaxResult.success("修改成功"));
  }
}