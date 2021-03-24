
import { promisify } from "util";
import { SmsConfig } from "../config/sms.config";

export class SmsUtils {

    public static async send(phone, params) {
        var QcloudSms = require("qcloudsms_js");
        var qcloudsms = QcloudSms(SmsConfig.appid, SmsConfig.appkey);
        var ssender = qcloudsms.SmsSingleSender();
        const send = promisify(ssender.sendWithParam).bind(ssender);
        return  await send("86", phone, SmsConfig.templateId, params, SmsConfig.smsSign, '', '');
    }
}
