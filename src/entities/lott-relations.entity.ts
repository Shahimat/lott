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

@Entity({ name: `${NAME_PREFIX}_relations` })
export class LottRelationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  sourceId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  targetId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  sourceColumnName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  targetColumnName: string;

  @ManyToOne(() => LottTablesEntity, (table) => table.manySourceRelations)
  @JoinColumn({ name: 'sourceId' })
  sourceTable: LottTablesEntity;

  @ManyToOne(() => LottTablesEntity, (table) => table.manyTargetRelations)
  @JoinColumn({ name: 'targetId' })
  targetTable: LottTablesEntity;

  @OneToMany(
    () => LottRowRelationsEntity,
    (rowRelation) => rowRelation.relation,
    {
      nullable: true,
    },
  )
  manyRowRelations?: LottRowRelationsEntity[];
}
