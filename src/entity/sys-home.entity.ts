import SysBaseEntity from './sys-base.entity';
import { Column } from 'typeorm';

export class SysHome extends SysBaseEntity{
    @Column({name:"type",type:"varchar"})
    type: string;

    @Column({name:"other_id",type:"varchar",length:36})
    otherId: string;

    @Column({})
    image_id:string;
}
