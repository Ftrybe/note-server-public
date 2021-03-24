import SysBaseEntity from "./sys-base.entity";
import { Entity, Column } from "typeorm";

@Entity()
export class SysOAuth extends SysBaseEntity {

    @Column({ type: "uuid", name: "user_id" })
    userId: string;

    @Column({ type: "varchar", name: "oauth_name" })
    oauthName: string;

    @Column({ type: "varchar", name: "oauth_id" })
    oauthId: string;

    @Column({ type: "varchar", name: "oauth_access_token" })
    oauthAccessToken: string;
    
    @Column({ type: "varchar", name: "oauth_expires" })
    oauthExpires: string;
}