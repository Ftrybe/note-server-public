import { IsIn, IsNotEmpty, MaxLength } from "class-validator";
import { group } from "console";
import { Column, Entity } from "typeorm";
import { DEFAULTGROUP } from "../validator/group";
import SysBaseEntity from "./sys-base.entity";

@Entity()
export class SysFile extends SysBaseEntity {
    // 标题
    @Column({ type: "varchar", length: 20 })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "标题不能为空" })
    @MaxLength(20, { groups: DEFAULTGROUP, message: "标题长度不能超过$constraint1个字符" })
    title: string;

    //类型
    @Column({ type: "varchar", length: 30 })
    @IsIn(["audio", "photo", "video", "word","excel","other"], { groups: DEFAULTGROUP, message: "文件类型不正确" })
    type: string;

    @Column({ type: "text", nullable: true })
    content: string;
    //路径
    @Column({ type: "varchar", length: 500 })
    url: string;

    //目标用户   all 全部可见 only 仅自己可见 xxxx，制定用户可见
    @Column({ type: "varchar",length:500, name: "target_user",default: 'all'})
    targetUser: string;

       //目标用户   all 全部可见 only 仅自己可见 xxxx，制定用户可见
    @Column({ type: "varchar",length:255,nullable:true, name: "password"})
    password: string;
   
    //目标用户   all 全部可见 only 仅自己可见 xxxx，制定用户可见
    @Column({ type: "varchar",length:255,nullable:true, name: "filename"})
    filename: string;
}

