import { LottRowRelationsEntity } from './lott-row-relations.entity';
import { LottTablesEntity } from './lott-tables.entity';
import { NAME_PREFIX } from 'src/constants/prefix';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: `${NAME_PREFIX}_rows` })
export class LottRowsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  tableId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  appointedId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  alias: string;

  @ManyToOne(() => LottTablesEntity, (table) => table.manySourceRelations)
  @JoinColumn({ name: 'tableId' })
  table: LottTablesEntity;

  @OneToMany(
    () => LottRowRelationsEntity,
    (rowRelation) => rowRelation.sourceRow,
    {
      nullable: true,
    },
  )
  manySourceRowRelations?: LottRowRelationsEntity[];

  @OneToMany(
    () => LottRowRelationsEntity,
    (rowRelation) => rowRelation.targetRow,
    {
      nullable: true,
    },
  )
  manyTargetRowRelations?: LottRowRelationsEntity[];
}
