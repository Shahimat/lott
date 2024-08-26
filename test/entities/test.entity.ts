import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'test' })
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  desc?: string;

  @OneToMany(() => RelationTestEntity, (relationTest) => relationTest.source, {
    nullable: true,
  })
  manyRelationTest?: RelationTestEntity[];
}

@Entity({ name: 'relation_test' })
export class RelationTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  sourceId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => TestEntity, (table) => table.manyRelationTest)
  @JoinColumn({ name: 'sourceId' })
  source: TestEntity;
}

@Entity({ name: 'circular_test' })
export class CircularTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  parentId?: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => CircularTestEntity, (table) => table.many, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent?: CircularTestEntity;

  @OneToMany(() => CircularTestEntity, (table) => table.parent, {
    nullable: true,
  })
  many?: CircularTestEntity[];
}
