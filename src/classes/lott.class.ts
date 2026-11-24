import { LottRelationsEntity } from 'src/entities/lott-relations.entity';
import { LottRowRelationsEntity } from 'src/entities/lott-row-relations.entity';
import { LottRowsEntity } from 'src/entities/lott-rows.entity';
import { LottTablesEntity } from 'src/entities/lott-tables.entity';
import {
  DataSource,
  DataSourceOptions,
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';

export default class Lott {
  public static from(options: DataSourceOptions) {
    const lott = new Lott(options);
    return { lott, em: lott.em };
  }

  private readonly ds: DataSource;
  public readonly em: EntityManager;
  constructor(options: DataSourceOptions) {
    this.ds = new DataSource({
      ...options,
      entities: [
        LottTablesEntity,
        LottRelationsEntity,
        LottRowsEntity,
        LottRowRelationsEntity,
        ...(Array.isArray(options.entities) ? options.entities : []),
      ],
    });
    this.em = this.ds.manager;
  }

  public async connect() {
    await this.ds.initialize();
    // this.em = this.ds.manager;
    // console.log(await this.tableExists('wow'));
  }

  public async disconnect() {
    await this.ds.destroy();
  }

  public getEntityManager() {
    return this.em;
  }

  public async insert<
    Entity extends ObjectLiteral,
    EntityLike extends DeepPartial<Entity>,
  >(EntityInstance: new () => Entity, rows: EntityLike[]) {
    const entities = this.em.create(EntityInstance, rows);
    await this.em.save(entities);
  }

  public find<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ) {
    return this.em.find(entityClass, options);
  }

  // private async initLottTables() {
  //   await Promise.all([this.tableExists('wow')]);
  // }

  // private async tableExists(tableName: string) {
  //   return tableName !== ''
  //     ? ((
  //         (await this.em.query(
  //           `SELECT exists (
  //             SELECT * FROM "information_schema"."tables"
  //               WHERE  table_schema = '${this.lottSchemaName}'
  //               AND    table_name   = '${tableName}'
  //           )`,
  //         )) as { exists: boolean }[] | undefined
  //       )?.[0]?.exists ?? false)
  //     : false;
  // }
}
