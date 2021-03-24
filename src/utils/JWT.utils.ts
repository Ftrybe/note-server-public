import { Request } from 'express';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import JwtConfig from '../config/jwt.config';
import { SysLocalAuth } from '../entity/sys-local-auth.entity';
import { PathUtils } from './path.utils';

export class JWTUtils {

    public static generateToken(auth: SysLocalAuth): string {
        const privateKey = JWTUtils.getPrivateKey();
        let token = jwt.sign(
            {
                uid: auth.userId,
                usr: auth.username || auth.phone,
                role: auth.role,
            }, privateKey, JwtConfig.JWT_SIGN_OPTIONS);
        return token;
    }

    public static decodeToken(token: string): any {
        const result = jwt.decode(token, { complete: true, json: true });
        return result;
    }

    public static getToken(req: Request) {
        let token: string = <string>req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        try {
            if (token) {
                if (token.startsWith('Bearer ')) {
                    // Remove Bearer from string
                    token = token.slice(7, token.length);
                }
            }
        }
        catch (e) {
            console.error("");
        }
        return token;
    }
    public static getPublicKey(): Buffer {
        return readFileSync(PathUtils.getRootDir() + 'resources/cert/public.key');
    }

    public static getPrivateKey(): Buffer {
        return readFileSync(PathUtils.getRootDir() + 'resources/cert/private.key');
    }

    public static getUserInfo(req: Request): {uid:string,usr:string,role:string} | null {
        const token = JWTUtils.getToken(req);
        const publicKey = JWTUtils.getPublicKey();
        let result = null;
        if (token) {
            jwt.verify(token, publicKey, JwtConfig.JWT_VERIFY_OPTIONS, (err, decoded: any) => {
                result = decoded
            });
        }
        return result;
    }

    public static getUserId(req:Request): string {
         const decode = JWTUtils.getUserInfo(req);
         if(decode){
            return decode.uid;
        }
        return "";
    }
}