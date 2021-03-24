import { ResultCodeEnum } from "../enums/result-code.enum";

export class AjaxResult {
    private code: string; // 0:成功 1:失败 2:权限验证失败 3:超时
    private message: string;
    private data: any;

    constructor(code?: string, message?: string) {
        this.code = code || '0';
        this.message = message;
        if(!this.message){
            if(this.code === ResultCodeEnum.SUCCESS){
                this.message = '操作成功';
            }
            if(this.code === ResultCodeEnum.FAIL){
                this.message = '操作失败';
            }
            if(this.code === ResultCodeEnum.UNAUTHORIZED){
                this.message = '权限验证失败';
            }
            if(this.code === ResultCodeEnum.TOKENEXPIREERROR){
                this.message = 'token过期，请重新登录';
            }
        }
    }

    public static success(message?: string): AjaxResult{
        return new AjaxResult(ResultCodeEnum.SUCCESS,message);
    }
    public static fail(message?: string): AjaxResult{
        return new AjaxResult(ResultCodeEnum.FAIL,message);
    }

    public setData(data: any){
        this.data = data;
    }
    public getData(): any{
        return this.data;
    }

    public setMessage(message: string){
        this.message = message;
    }

    public getMessage(): string{
        return this.message;
    }
    
    public setCode(code: string){
        this.code = code;
    }
    
    public getCode(): string{
        return this.code;
    }

}