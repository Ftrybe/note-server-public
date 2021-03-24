import { BaseRouter } from "./base.router";
import { PublicController } from "../controller/public.controller";
import { SysDiary } from "../entity/sys-diary.entity";
class PublicRouter extends BaseRouter {
    constructor() {
        super("/public", SysDiary, PublicController);
    }

    mount() {
        this.list();
    }
    list():void{
        this.router.get("/publics",PublicController.list);
    }
}
export default new PublicRouter().router;