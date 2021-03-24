import * as bcrypt from "bcryptjs";
export class BcryptUtils{
   public static hashPassword(password:string): string {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);    
        return bcrypt.hashSync(password, salt);
    }
   public static checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, password:string) {
        return bcrypt.compareSync(unencryptedPassword, password);
    }

}