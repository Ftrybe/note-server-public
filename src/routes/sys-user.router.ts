import { SysUserController } from "../controller/sys-user.controller";
import { BaseRouter } from "./base.router";
import { checkUser } from "../middlewares/sys-user.role";
import { checkToken } from "../middlewares";

class SysUserRouter extends BaseRouter{
    constructor() {
        super("/user",checkUser,SysUserController);
    }
    extend(){
        this.router.get("/users",checkToken(),SysUserController.list);
        this.router.get("/currentUser",checkToken(),SysUserController.currentUser);
    }
}

export default new SysUserRouter().router;
