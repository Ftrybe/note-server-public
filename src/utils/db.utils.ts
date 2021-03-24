import { getConnection, SelectQueryBuilder } from "typeorm";
import Page from "../model/Page";
import { ObjectUtils } from "./object.utils";
import PageUtils from "./page.utils";
import { Response } from "express";
import { plainToClass } from "class-transformer";
export class DBUtils {
    // 事物处理
    public static async transaction({ handle: handle, error: error = null, beforeTransaction: beforeTransaction = null }) {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        let result = null;
        let beforeResult = null;
        if (beforeTransaction) {
            beforeResult = await beforeTransaction(queryRunner);
        }
        await queryRunner.startTransaction();
        try {
            result = handle(beforeResult);
            await queryRunner.commitTransaction();
        } catch (err) {
            error(err);
            console.warn(err);
            await queryRunner.rollbackTransaction();
            return;
        } finally {
            await queryRunner.release();
        }
        return result;
    }

    // 分页获取数据
    public static async list({ entityClass: entityClass, entityData: entityData = null, select: select = "tb", alias: alias = "tb" ,delFlag:delFlag = false}, pageSetting: string, expand?): Promise<Page | void> {
        let list = null;
        let page: Page = null;
        try {
            let info: SelectQueryBuilder<unknown> = getConnection().createQueryBuilder().select(select).from(entityClass, alias);
            if(entityData){
                entityData.delFlag = delFlag;
                info.where(entityData); 
            }
            expand ? info = expand(info) : null;
            page = ObjectUtils.JsonToClass(pageSetting, Page);
            list = await info.skip(PageUtils.startPage(page.currPage, page.pageSize))
                .take(PageUtils.pageSize(page.pageSize))
                .orderBy(PageUtils.order(page.order))
                .getManyAndCount();
        } catch (error) {
            console.warn(error);
            return new Page();
        }
        return PageUtils.setData(list, page);
    }
}