import { BaseRouter } from "./base.router";
import { SysMemorandumController } from "../controller/sys-memorandum.controller";
import { checkMemorandum, checkToken } from "../middlewares";
class SysMemorandumRouter extends BaseRouter {
  constructor() {
    super("/memorandum", checkMemorandum, SysMemorandumController);
  }
  extend() {
  }
}
export default new SysMemorandumRouter().router;