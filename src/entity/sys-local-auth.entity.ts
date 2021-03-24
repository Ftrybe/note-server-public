import { IsMobilePhone, Length, IsEmpty, IsNotEmpty, IsEnum } from "class-validator";
import { Column, Entity } from "typeorm";
import { ActiveStateEnum } from "../enums/active-state.enum";
import { DEFAULTGROUP, EDITGROUP, ADDGROUP,  } from "../validator/group";
import SysBaseEntity from "./sys-base.entity";
import { RoleEnum } from "../enums/role.enum";
@Entity()
export class SysLocalAuth extends SysBaseEntity {
    @Column({ type: "varchar", length: 36, name: "user_id" })
    userId: string;

    @Column({ type: "varchar", length: 11, nullable: true })
    @Length(4, 11, { groups: ADDGROUP, message: "用户名长度在 $constraint1 - $constraint2 之间 " })
    @IsEmpty({groups:EDITGROUP, message: "违规操作，用户名不可修改"})
    username: string;

    @Column({ type: "varchar", name: "password" })
    @Length(5, 16, { groups: DEFAULTGROUP, message: "密码长度在 $constraint1 - $constraint2 之间 " })
    password: string;

    @Column({ type: "char", length: 11, nullable: true })
    @IsMobilePhone("zh-CN", { groups: ADDGROUP, message: "手机号码不正确，请输入正确的大陆手机号码" })
    @IsNotEmpty({groups: EDITGROUP,message:"当前操作不可修改手机号码"})
    phone: string;

    @Column({type:"char",length:3})
    @IsEmpty({groups: EDITGROUP, message: "您无权进行此设置"})
    role: RoleEnum;

    @Column({ type: "char", length: 3, default: ActiveStateEnum.STANDARD })
    @IsEmpty({groups: EDITGROUP, message: "您无权进行此设置"})
    state: ActiveStateEnum;

    //非数据库字段
    @IsNotEmpty({groups:ADDGROUP,message:"验证码不能为空"})
    captcha:string;
} 