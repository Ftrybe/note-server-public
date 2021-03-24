import { Column, Entity } from "typeorm";
import SysBaseEntity from "./sys-base.entity";
@Entity()
export class SysMemorandumTagScope extends SysBaseEntity {
    @Column({ type: "varchar", length: 36, name: "memorandum_id" })
    memorandumId: string;

    @Column({ type: "varchar", length: 36, name: "tag_id" })
    tagId: string;
}