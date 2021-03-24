import { AliyunController } from "../controller/aliyun.controller";
import { checkToken } from "../middlewares";
import { BaseRouter } from "./base.router";
class AliyunRouter extends BaseRouter{
    constructor() {
        super();
    }

    get(): void {
        this.router.get("/oss/sts",checkToken(),AliyunController.getSts);
    }

    post(): void {}

    put(): void {}

    delete(): void {}

    mount(){
        this.get();
    }
}
export default new AliyunRouter().router;