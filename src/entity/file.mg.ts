import { Entity, ObjectID, ObjectIdColumn, Column} from "typeorm";
import { IsIn } from "class-validator";
import { ADDGROUP } from "../validator/group";

@Entity()
export class File {
    @ObjectIdColumn({name:"id"})
    id: ObjectID;

    @Column()
    data: string;

    @Column()
    name: string;

    @Column()
    type:string;

    @IsIn(['profile','notice' ],{message:"违法操作",groups:ADDGROUP})
    bucketName:string;
}
