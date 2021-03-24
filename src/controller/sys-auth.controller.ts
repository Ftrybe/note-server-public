import { Request, Response } from "express-serve-static-core";
import * as captcha from "svg-captcha";
import * as util from 'util';
import redis from "../config/redis.config";
import { SysLocalAuth } from "../entity/sys-local-auth.entity";
import { SysMemorandumTagUserScope } from "../entity/sys-memorandum-tag-user-scope.entity";
import { SysUser } from "../entity/sys-user.entity";
import { ActiveStateEnum } from "../enums/active-state.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";
import { AjaxResult } from "../model/ajax-result";
import { BcryptUtils } from "../utils/bcrypt.utils";
import ClassValidateUtils from "../utils/class-validate.utils";
import { DBUtils } from "../utils/db.utils";
import { JWTUtils } from "../utils/jwt.utils";
import { ObjectUtils } from "../utils/object.utils";
import { SmsUtils } from "../utils/sms.utils";
import { RegExpValidator } from "../validator/reg-exp.validator";


/*  
    用户身份验证接口
*/
export class SysAuthController {

    // 登录
    public static async tokens(req: Request, rsp: Response) {
        let auth: SysLocalAuth = req.body;
        // 验证数据格式是否正确
        if (await ClassValidateUtils.add(SysLocalAuth, auth, rsp)) {
            return;
        };
        if (RegExpValidator.isMobile(auth.username)) {
            auth.phone = auth.username;
            auth.username = null;
        }
        let result;
        try {
            if (auth.username) {
                result = await SysLocalAuth.findOneOrFail({
                    select: ["username", "userId", "password", "state", "role"], //We don't want to send the password on response
                    where: {
                        username: auth.username
                    }
                });
            } else if (auth.phone) {
                result = await SysLocalAuth.findOneOrFail({
                    select: ["phone", "userId", "password", "state", "role"], //We don't want to send the password on response
                    where: {
                        phone: auth.phone
                    }
                });
            } else {
                rsp.send(AjaxResult.fail("用户名不能为空"));
                return;
            }
        } catch (e) {
            rsp.send(AjaxResult.fail("账户不存在"));
            return;
        }
        if (result.state === ActiveStateEnum.DISABLE) {
            rsp.send(AjaxResult.fail("该账户已被禁用，请联系管理员"));
            return;
        }
        if (BcryptUtils.checkIfUnencryptedPasswordIsValid(auth.password, result.password)) {
            const token = JWTUtils.generateToken(result);
            const ajaxResult = new AjaxResult();
            ajaxResult.setData(token);
            ajaxResult.setMessage("登录成功");
            rsp.send(ajaxResult);
            return;
        }
        rsp.send(AjaxResult.fail("密码输入不正确"));
    }

    public static async register(req: Request, rsp: Response) {
        const auth: SysLocalAuth = req.body;

        let account = "";
        let type = "";
        let redisKey = "captcha::";
        const isMobile = RegExpValidator.isMobile(auth.username);
        if (isMobile) {
            account = auth.phone;
            type = "phone";
            redisKey += auth.username;
            auth.phone = auth.username;
            auth.username = null;
        } else {
            account = auth.username;
            type = "username";
            redisKey += req.query.captchaTime;
        };

        if (await ClassValidateUtils.add(SysLocalAuth, auth, rsp)) {
            return;
        }
        // 验证码验证
        // const captchaTime = req.query.t;
        const redisGet = util.promisify(redis.get).bind(redis);
        const reply = await redisGet(redisKey);
        if (!reply || auth.captcha.toLocaleLowerCase() !== reply.toLocaleLowerCase()) {
            rsp.send(AjaxResult.fail("验证码错误"));
            return;
        }

        // 加密密码
        auth.password = BcryptUtils.hashPassword(auth.password);
        // 创建连接对象
        const result = await DBUtils.transaction({
            beforeTransaction: async (queryRunner) => {

                const hasUser = await queryRunner.query("SELECT user_id FROM sys_local_auth WHERE " + type + '="' + account + '"');
                if (ObjectUtils.isNotEmpty(hasUser)) {
                    if (!isMobile) {
                        rsp.send(AjaxResult.fail("该用户名已经被注册"));
                        return;
                    } else {
                        rsp.send(AjaxResult.success("该手机号已经注册，将为您重置密码"));
                    }
                }

                let user = new SysUser();
                user.birthday = new Date();
                user.gender = GenderEnum.NONE;
                user.nickname = "佚名";
                user.photo = "images/user/default.png";
                return user;
            },
            handle: async (user:SysUser) => {
                // 权限
                const userInfo = await SysUser.save(user);
                auth.userId = userInfo.id;
                auth.role = RoleEnum.USER;
                auth.state = ActiveStateEnum.STANDARD;

                const userMemoTags =new SysMemorandumTagUserScope();
                userMemoTags.tagId = "0";
                userMemoTags.userId = userInfo.id;
                userMemoTags.createId = userInfo.id;
                await SysMemorandumTagUserScope.save(userMemoTags);

                return await SysLocalAuth.save(auth);
            },
            error: () => {
                rsp.send(AjaxResult.fail("注册失败"));
                return;
            }
        });
        if (ObjectUtils.isEmpty(result)) {
            return;
        }
        const token = JWTUtils.generateToken(result);
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(token);
        ajaxResult.setMessage("注册成功");
        rsp.send(ajaxResult);
    }

    // 更新用户信息
    public static async update(req: Request, rsp: Response) {
        let auth: SysLocalAuth = req.body;

        const uid = rsp.locals.jwtPayload.uid;
        if (await ClassValidateUtils.edit(SysLocalAuth, auth, rsp)) {
            return;
        }
        if (auth.password) {
            auth.password = BcryptUtils.hashPassword(auth.password)
        }
        try {
            await SysLocalAuth.update({
                userId: uid
            }, auth);
        } catch (err) {
            rsp.send(AjaxResult.fail("修改失败"));
            return;
        }
        auth.userId = uid;
        const token = JWTUtils.generateToken(auth);
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(token);
        ajaxResult.setMessage("修改成功");
        rsp.send(ajaxResult);
    }

    public static async captcha(req: Request, rsp: Response) {
        const captchaTime = req.query.captchaTime;
        let svg = captcha.create({
            height: 32,
            width: 80
        });

        redis.set("captcha::" + captchaTime, svg.text);
        redis.expire("captcha::" + captchaTime, 300);
        const ajaxResult = new AjaxResult();
        ajaxResult.setData(svg.data);
        rsp.send(ajaxResult);
    }

    public static async getSmsCode(req: Request, rsp: Response) {
        const username = req.query.phone as string;
        const code = Math.floor(Math.random() * 9000) + 1000;
        redis.set("captcha::" + username, code.toString());
        redis.expire("captcha::" + username, 300);
        if (RegExpValidator.isMobile(username)) {
            const a = await SmsUtils.send(username, [code.toString(), "5"]);
            rsp.send(AjaxResult.success("验证码已发送"));
        } else {
            rsp.send(AjaxResult.fail("手机号码不正确"));
        }
    }

    public static async verifyPhone(req: Request, rsp: Response) {
        const code = req.query.code;
        const phone = req.query.phone;
        const redisGet = util.promisify(redis.get).bind(redis);
        const reply = await redisGet("captcha::" + phone);
        const uid = rsp.locals.jwtPayload.uid;

        if (code == reply) {
            rsp.send(AjaxResult.success("验证通过"));
            redis.set("ableModifyPhone::" + phone, uid);
            redis.expire("ableModifyPhone::" + phone, 300);
            return;
        }
        rsp.send(AjaxResult.fail("验证码错误"));
    }

    public static async updatePhone(req: Request, rsp: Response) {
        const phone: { oldPhone: string, newPhone: string } = req.body;
        if (!phone.oldPhone || !phone.newPhone) {
            rsp.send(AjaxResult.fail("修改失败"));
            return;
        }
        if(await SysAuthController.findPhone(phone.newPhone)){
            rsp.send(AjaxResult.fail("该手机号码已被绑定（注册）"));
            return;
        }
        const uid = rsp.locals.jwtPayload.uid;
        const redisGet = util.promisify(redis.get).bind(redis);
        const oldReply = await redisGet("ableModifyPhone::" + phone.oldPhone);
        const newReply = await redisGet("ableModifyPhone::" + phone.newPhone);
        if (oldReply == newReply && oldReply == uid && newReply == uid) {
            try {
                await SysLocalAuth.update({
                    userId: oldReply
                }, {
                    phone: phone.newPhone
                })
            } catch (error) {
                rsp.send(AjaxResult.fail("更新失败,ps:请确定当前手机号码未被注册"));
            }
            rsp.send(AjaxResult.success("更新成功"));
            return;
        }
        rsp.send(AjaxResult.fail("更新失败"));

    }

    public static async bindPhone(req: Request, rsp: Response) {
        const phone = req.body.phone;
        if (phone) {
             if(await SysAuthController.findPhone(phone)){
                 rsp.send(AjaxResult.fail("该手机号码已被绑定（注册）"));
                 return;
             }
            const uid = rsp.locals.jwtPayload.uid;
            const redisGet = util.promisify(redis.get).bind(redis);
            const reply = await redisGet("ableModifyPhone::" + phone);
            if (reply == uid) {
                try {
                    await SysLocalAuth.update({
                        userId: uid

                    }, {
                        phone: phone

                    })
                } catch (error) {
                    rsp.send(AjaxResult.fail("更新失败"));
                }
                rsp.send(AjaxResult.success("更新成功"));
                return;
            }
        }
        rsp.send(AjaxResult.fail("更新失败"));

    }

    private static async findPhone(phone: string): Promise<Boolean> {

        const num = await SysLocalAuth.count({ where: { phone: phone }});
        if(num && num > 0){
            return true;
        }
        return false;
    }

}   