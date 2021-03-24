import { IsNotEmpty, MaxLength } from "class-validator";
import { Column, Entity } from "typeorm";
import { DEFAULTGROUP } from "../validator/group";
import SysBaseEntity from "./sys-base.entity";

@Entity()
export class SysMemorandumTag extends SysBaseEntity {
    // 标签名称
    @Column({ type: "varchar", length: 8 })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "标签名称不能为空" })
    @MaxLength(8, { groups: DEFAULTGROUP, message: "标签名称在$constraint1字符内" })
    name: String;
}