import { BaseRouter } from "./base.router";
import { SysAuthController } from "../controller/sys-auth.controller";
import { checkToken, checkUser } from "../middlewares";
class SysAuthRouter extends BaseRouter{
    constructor(){
        super();
    }
    get(): void {
        this.router.get("/captcha",SysAuthController.captcha);
        this.router.get("/smscode",SysAuthController.getSmsCode);
        this.router.get("/verifyPhone",checkToken(),SysAuthController.verifyPhone);
    }

    post(): void {
        this.router.post("/tokens",SysAuthController.tokens);
        this.router.post("/register",SysAuthController.register);
        this.router.post("/phone",checkToken(), SysAuthController.bindPhone);
    }

    put():void{
        this.router.put("/tokens",checkToken(),SysAuthController.update);
        this.router.put("/phone",checkToken(),SysAuthController.updatePhone);

    }

    mount():void{
        this.get();
        this.post();
        this.put();
    }
}
export default new SysAuthRouter().router;