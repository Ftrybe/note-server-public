import { IsIn, IsNotEmpty, MaxLength } from "class-validator";
import { Column, Entity } from "typeorm";
import { DiaryTagEnum } from "../enums/diary-tag.enum";
import { DEFAULTGROUP } from "../validator/group";
import SysBaseEntity from "./sys-base.entity";
import { SysUser } from "./sys-user.entity";

@Entity()
export class SysDiary extends SysBaseEntity {
    // 标题
    @Column({ type: "varchar", length: 20 })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "标题不能为空" })
    @MaxLength(20, { groups: DEFAULTGROUP, message: "标题长度不能超过$constraint1个字符" })
    title: string;

    //内容
    @Column({ type: "text" })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "内容不能为空" })
    content: string;
    //显示状态
    @Column({ type: "char", length: 3 })
    // @IsBoolean({gmessage: "错误的可见类型"})
    visible: boolean;

    @Column({type:"char",length:3})
    @IsIn([DiaryTagEnum.DEFAULT,DiaryTagEnum.ESSAY,DiaryTagEnum.FELLING,DiaryTagEnum.JOKE,DiaryTagEnum.MOOD,DiaryTagEnum.STORY],{groups: DEFAULTGROUP,message: "选择的状态无效"})
    tag: DiaryTagEnum;

    @Column({type: "datetime",name: "unknow_date"})
    @IsNotEmpty({groups:DEFAULTGROUP,message: "日期不可为空"})
    unKnowDate:Date;

    userInfo: SysUser;
}