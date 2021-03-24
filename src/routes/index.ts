import { Router } from "express";
import sysAuthRouter from "./sys-auth.router";
import sysDiaryRouter from "./sys-diary.router";
import sysMemorandumTagRouter from "./sys-memorandum-tag.router";
import sysMemorandumRouter from "./sys-memorandum.router";
import sysUserRouter from "./sys-user.router";
import publicRouter from "./public.router";
import fileRouter from "./file.router";
import aliyunRouter from "./aliyun.router";
import sysFileRouter from "./sys-file.router";

class RootRouter {
    public routes:Router;
    public array = [
        sysDiaryRouter,
        sysUserRouter,
        sysMemorandumRouter,
        sysMemorandumTagRouter,
        sysAuthRouter,
        publicRouter,
        fileRouter,
        aliyunRouter,
        sysFileRouter
        
    ];
    constructor() {
        this.routes = Router();
        this.mountChildrenRoutes();
    }

    mountChildrenRoutes(): void {
        this.array.forEach(route => {
            this.routes.use("/", route);
        });
    }
}
export default new RootRouter().routes;