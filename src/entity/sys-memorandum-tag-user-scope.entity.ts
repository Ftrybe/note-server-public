import { BaseEntity, Column, Entity } from "typeorm";
import SysBaseEntity from "./sys-base.entity";
@Entity()
export class SysMemorandumTagUserScope extends SysBaseEntity{
    @Column({ type: "varchar", length: 36, name: "user_id" })
    userId: string;

    @Column({ type: "varchar", length: 36, name: "tag_id" })
    tagId: string;
}
