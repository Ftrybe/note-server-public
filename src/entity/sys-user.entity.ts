
import {  IsEnum, IsNotEmpty, MaxLength, IsDateString } from 'class-validator';
import { Column, Entity } from "typeorm";
import { GenderEnum } from "../enums/gender.enum";
import { DEFAULTGROUP } from '../validator/group';
import SysBaseEntity from "./sys-base.entity";
import { Exclude } from 'class-transformer';
@Entity()
export class SysUser extends SysBaseEntity {

    @Column({ type: "varchar", length: 11, nullable: true })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "昵称不能为空" })
    @MaxLength(11, { message: "昵称最大长度不能超过constraint1字" })
    nickname: string;

    @Column({ nullable: true })
    @IsDateString({ groups: DEFAULTGROUP, message: "时间类型不正确" })
    birthday: Date;

    @Column({ nullable: true })
    @IsNotEmpty({ groups: DEFAULTGROUP })
    photo: string;

    @Column({ type: "char", length: 3 })
    @IsEnum(GenderEnum, { message: "性别选择错误" })
    gender: GenderEnum;

    // 非数据库字段
    // @Expose({groups: ["ignore"]})
    @Exclude()
    phone:string;
    // 非数据库字段
    // @Expose({groups: ["ignore"]})
    @Exclude()
    username: string;

    @Exclude()
    role: string;
}
