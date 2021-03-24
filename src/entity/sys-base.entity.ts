import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column } from "typeorm";

export default class SysBaseEntity extends BaseEntity {

    // uuid主键
    @PrimaryGeneratedColumn("uuid")
    // @IsEmpty({groups: DEFAULTGROUP, message: "主键不可修改"})
    id: string;

    // 创建时间
    @CreateDateColumn({ name: "create_time" })
    // @IsEmpty({groups: DEFAULTGROUP, message: "创建时间不可修改"})
    createTime: Date;

    // 修改时间
    @UpdateDateColumn({ name: "modify_time" })
    // @IsEmpty({groups: DEFAULTGROUP, message: "修改时间将自动生成"})
    modifyTime: Date;

    @Column({ type: "varchar", name: "create_id", length: 36, nullable: true })
    createId: string;

    @Column({type: "boolean",name:"del_flag",default: false})
    delFlag: Boolean;
}