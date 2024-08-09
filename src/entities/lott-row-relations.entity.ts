import { LottRelationsEntity } from './lott-relations.entity';
import { LottRowsEntity } from './lott-rows.entity';
import { NAME_PREFIX } from 'src/constants/prefix';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: `${NAME_PREFIX}_row_relations` })
export class LottRowRelationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  sourceRowId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  targetRowId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  relationId: number;

  @ManyToOne(() => LottRowsEntity, (row) => row.manySourceRowRelations)
  @JoinColumn({ name: 'sourceRowId' })
  sourceRow: LottRowsEntity;

  @ManyToOne(() => LottRowsEntity, (row) => row.manyTargetRowRelations)
  @JoinColumn({ name: 'targetRowId' })
  targetRow: LottRowsEntity;

  @ManyToOne(() => LottRelationsEntity, (relation) => relation.manyRowRelations)
  @JoinColumn({ name: 'relationId' })
  relation: LottRelationsEntity;
}
