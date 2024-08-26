import { isNil } from 'lodash';
import { JsonExecutorSyntax } from 'src/types/json-executor.type';
import { EntityManager, ObjectType } from 'typeorm';

export class LottTableDefine<Entity, T extends object> {
  public readonly aliases: keyof T;
  public columns: string[];
  public relations: {
    [index: string]: {
      table: string;
      field: string;
    };
  } = {};
  constructor(
    private readonly em: EntityManager,
    private readonly entity: ObjectType<Entity>,
    public readonly data: T,
  ) {
    this.aliases = Object.keys(data) as unknown as keyof T;
    for (const alias in data) {
      (data[alias] as Record<string, unknown>)['__alias__'] = alias;
      const row = this.data[alias] as Record<string, unknown>;
      for (const field in row) {
        const cell = row[field];
        if (
          !Array.isArray(cell) &&
          typeof cell === 'object' &&
          !isNil((cell as Record<string, unknown>)['__alias__'])
        ) {
          row[field] = (cell as Record<string, unknown>)['__alias__'];
        }
      }
    }
  }

  public get name() {
    return this.entity.name;
  }

  public get metadata() {
    return this.em.connection.getMetadata(this.entity);
  }

  public sync() {
    this.columns = this.metadata.columns.map((item) => item.propertyName);
    for (const column of this.metadata.columns) {
      if (column.relationMetadata) {
        const [joinColumn] = column.relationMetadata.joinColumns;
        if (joinColumn && joinColumn.referencedColumn) {
          this.relations[column.propertyName] = {
            table: this.em.connection.getMetadata(
              joinColumn.referencedColumn.target,
            ).name,
            field: joinColumn.referencedColumn.propertyName,
          };
        }
      }
    }
  }

  link(alias: keyof T): keyof T {
    return alias;
  }
}

export class LottFrontEngine {
  private readonly tables: Map<
    string,
    LottTableDefine<unknown, { [index: string]: unknown }>
  > = new Map();
  constructor(private readonly em: EntityManager) {}

  public define<Entity, T extends object>(
    entity: ObjectType<Entity>,
    data: T,
  ): LottTableDefine<Entity, T> {
    return new LottTableDefine(this.em, entity, data);
  }

  public set(
    tables: LottTableDefine<
      unknown,
      /* eslint-disable */ any /* eslint-enable */
    >[],
  ) {
    tables.forEach((item, index) => {
      item.sync();
      this.tables.set(`${index}`, item);
    });
  }

  public run(command?: string): JsonExecutorSyntax {
    if (isNil(command)) {
      return [
        '==>',
        ...[...this.tables.values()].flatMap((table) => [
          ['==> orm.apply_table', table.name],
          ...Object.keys(table.relations).map((relationField) => [
            '==> orm.apply_relation',
            table.name,
            relationField,
            table.relations[relationField]!.table,
            table.relations[relationField]!.field,
          ]),
        ]),
        ...[...this.tables.values()].flatMap((table) => {
          return Object.keys(table.data).flatMap((alias) => {
            const data = table.data[alias] as { [index: string]: unknown };
            const findFields: [string, JsonExecutorSyntax][] = Object.keys(
              table.relations,
            )
              .map((relationField) =>
                isNil(data[relationField])
                  ? null
                  : [
                      relationField,
                      [
                        '==> orm.find_appointed_id',
                        table.relations[relationField]!.table,
                        table.relations[relationField]!.field,
                        alias,
                      ] as JsonExecutorSyntax,
                    ],
              )
              .filter(
                (item): item is [string, JsonExecutorSyntax] => item !== null,
              );
            const newData = {} as { [index: string]: unknown };
            for (const field in data) {
              if (
                field !== '__alias__' &&
                !findFields
                  .map(([findFieldName]) => findFieldName)
                  .includes(field)
              ) {
                newData[field] = data[field];
              }
            }
            return findFields.length > 0
              ? [
                  [
                    '==?>',
                    ...findFields.map(([_, syntax]) => syntax),
                    [
                      '/=>',
                      [...findFields.map(([field]) => field)],
                      [
                        '==> orm.apply_row',
                        table.name,
                        alias,
                        [
                          '::obj',
                          newData,
                          ...findFields.map(([findFieldName]) => [
                            '::',
                            findFieldName,
                            `@${findFieldName}`,
                          ]),
                        ],
                      ],
                    ],
                  ],
                ]
              : [['==> orm.apply_row', table.name, alias, newData]];
          });
        }),
      ];
    } else {
      return [];
    }
  }
}
