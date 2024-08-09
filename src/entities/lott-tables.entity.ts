import { LottRelationsEntity } from './lott-relations.entity';
import { LottRowsEntity } from './lott-rows.entity';
import { NAME_PREFIX } from 'src/constants/prefix';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: `${NAME_PREFIX}_tables` })
export class LottTablesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: false,
  })
  createdAt: Date = new Date();

  @UpdateDateColumn({
    nullable: false,
  })
  updatedAt: Date = new Date();

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  updatedBy: string | null;

  @OneToMany(() => LottRelationsEntity, (relation) => relation.sourceTable, {
    nullable: true,
  })
  manySourceRelations?: LottRelationsEntity[];

  @OneToMany(() => LottRelationsEntity, (relation) => relation.targetTable, {
    nullable: true,
  })
  manyTargetRelations?: LottRelationsEntity[];

  @OneToMany(() => LottRowsEntity, (row) => row.table, {
    nullable: true,
  })
  manyRows?: LottRowsEntity[];
}
