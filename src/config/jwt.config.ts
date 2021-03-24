import { VerifyOptions, SignOptions } from "jsonwebtoken";

/* 
  JWT配置类
*/
export default class JwtConfig{
  public static readonly JWT_EXPIRATION = "30d";  // 过期时间30天
  public static readonly JWT_ISSUER = 'ftrybe'; 
  public static readonly JWT_HEADER = 'Authorization';
  public static readonly JWT_SUBJECT = "bujishi";
  public static readonly JWT_ALG = "RS256";

  public static readonly JWT_VERIFY_OPTIONS:VerifyOptions = {
    issuer:  JwtConfig.JWT_ISSUER,
    subject:  JwtConfig.JWT_SUBJECT,
    algorithms:  [JwtConfig.JWT_ALG]
   };

   public static readonly JWT_SIGN_OPTIONS:SignOptions = {
    issuer:  JwtConfig.JWT_ISSUER,
    subject:  JwtConfig.JWT_SUBJECT,
    expiresIn:  JwtConfig.JWT_EXPIRATION,
    algorithm:  JwtConfig.JWT_ALG
   };
}