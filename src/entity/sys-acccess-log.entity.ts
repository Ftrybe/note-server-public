import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import SysBaseEntity from "./sys-base.entity";

@Entity()
export default class SysAccessLog extends SysBaseEntity {

    @Column({ type: "varchar", length: 36, nullable: true })
    ip: string;

    @Column({ type: "varchar", length: 500, name: "user_agent", nullable: true })
    userAgent: string;

    @Column({ type: "varchar", length: 36,nullable: true })
    method: string;

    @Column({ type: "varchar", length: 500,nullable: true })
    router: string;
}