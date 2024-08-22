import { RelationTestEntity, TestEntity } from '../entities/test.entity';
import { JsonExecutorNodeBuilder } from 'src/classes/json-executor.class';
import { DbUtil } from 'src/common/db.util';
import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'sqlite',
  database: ':memory:', // :memory:, test.db
  dropSchema: true,
  entities: [TestEntity, RelationTestEntity],
  synchronize: true,
  logging: false,
});
const em = ds.manager;
const dbUtil = new DbUtil(em);
const jsonExecutor = new JsonExecutorNodeBuilder(...dbUtil.functions);

beforeEach(async () => {
  await ds.initialize();
  await em.save([
    em.create(TestEntity, { name: 'test1' }),
    em.create(TestEntity, { name: 'test2', desc: 'some test' }),
    em.create(TestEntity, { name: 'test3' }),
  ]);
  await em.save([
    em.create(RelationTestEntity, {
      source: (await em.findOne(TestEntity, { where: { name: 'test1' } }))!,
      name: 'rel test1',
    }),
    em.create(RelationTestEntity, {
      source: (await em.findOne(TestEntity, { where: { name: 'test3' } }))!,
      name: 'rel test2',
    }),
  ]);
});

afterEach(async () => {
  await ds.destroy();
});

describe('db utils', () => {
  test('base functions', async () => {
    expect(await jsonExecutor.test(['==> orm.find', 'TestEntity'])).toEqual([
      {
        id: 1,
        desc: null,
        name: 'test1',
      },
      {
        id: 2,
        desc: 'some test',
        name: 'test2',
      },
      {
        id: 3,
        desc: null,
        name: 'test3',
      },
    ]);
    expect(
      await jsonExecutor.test([
        '==> orm.create',
        'TestEntity',
        { name: 'createdTest' },
      ]),
    ).toEqual({ name: 'createdTest' });
    expect(
      await jsonExecutor.test([
        '==> orm.save',
        ['==> orm.create', 'TestEntity', { name: 'createdTest' }],
      ]),
    ).toEqual([{ id: 4, name: 'createdTest', desc: null }]);
  });
});
