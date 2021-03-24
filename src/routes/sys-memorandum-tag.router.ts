import { BaseRouter } from "./base.router";
import { SysMemorandumTagController } from "../controller/sys-memorandum-tag.controller";
import { checkMemorandumTag, checkToken } from "../middlewares";
class SysMemorandumTagRouter extends BaseRouter {
    constructor() {
        super("/memorandumTag", checkMemorandumTag, SysMemorandumTagController);
    }
    extend(){
    }
}
export default new SysMemorandumTagRouter().router;