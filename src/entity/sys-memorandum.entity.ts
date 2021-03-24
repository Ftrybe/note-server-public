import { IsNotEmpty, Length } from "class-validator";
import { Column, Entity } from "typeorm";
import { DEFAULTGROUP } from "../validator/group";
import SysBaseEntity from "./sys-base.entity";
import { SysMemorandumTag } from "./sys-memorandum-tag.entity";
import { SysMemorandumTagScope } from "./sys-memorandum-tag-scope.entity";

@Entity()
export class SysMemorandum extends SysBaseEntity {
    // 标题
    @Column({ type: "varchar", length: 20 })
    @Length(1, 20, { groups: DEFAULTGROUP, message: "标题需要在$constraint1以内" })
    title: string;
    // 内容
    @Column({ type: "text" })
    @IsNotEmpty({ groups: DEFAULTGROUP, message: "内容不能为空" })
    content: string;
    // 事件开始时间
    @Column({ name: "event_start_time", nullable: true })
    eventStartTime: Date;
    // 事件结束时间
    @Column({ name: "event_stop_time", nullable: true })
    eventStopTime: Date;
    
    // 非数据库字段
    tags: SysMemorandumTag[];

    scope: SysMemorandumTagScope;

    tagId: string;
}