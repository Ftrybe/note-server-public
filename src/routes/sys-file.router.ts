import { SysFileController } from "../controller/sys-file.controller";
import { checkFile,checkToken } from "../middlewares";
import { BaseRouter } from "./base.router";

class SysFileRouter extends BaseRouter {
    constructor() {
        super("/oss/file", checkFile, SysFileController);
    }

    list(): void {
        this.router.get(this.url.plural, SysFileController.list);
    }

    get(): void {
        this.router.get(this.url.id,SysFileController.get);
        this.router.get("/oss/private/:id",[checkToken(), checkFile()],SysFileController.getPrivateFile)
    }

}

export default new SysFileRouter().router;