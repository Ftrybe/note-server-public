import { OrderByCondition } from "typeorm";

export default class Page {
     currPage: number;
     order: OrderByCondition;
     pageSize: number;
     total: number;
     list: any;
}