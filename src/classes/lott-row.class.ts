import { LottTablesEntity } from 'src/entities/lott-tables.entity';
import { EntityManager } from 'typeorm';

export class LottRow {
  constructor(
    private readonly em: EntityManager,
    private readonly table: LottTablesEntity,
  ) {}
}
