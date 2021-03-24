import Page from "../model/Page";
import { OrderByCondition } from "typeorm";

export default class PageUtils {
    public static currPage(currPage): number {
        return currPage > 0 ? parseInt(currPage) : 1;
    }

    public static startPage(currPage: number, pageSize: number) {
        return (this.currPage(currPage) - 1) * this.pageSize(pageSize);
    }

    public static pageSize(pageSize): number {
        return pageSize || 20;
    }

    public static order(condition: OrderByCondition) {
        return condition ? condition : { tb_id: "ASC" } as OrderByCondition;
    }

    public static setData(list: any, pagex: Page): Page {
        const page = new Page();
        page.list = list[0];
        page.total = list[1];
        page.currPage = this.currPage(pagex.currPage);
        page.pageSize = this.pageSize(pagex.pageSize);
        return page;
    }
}