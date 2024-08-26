import {
  CircularTestEntity,
  RelationTestEntity,
  TestEntity,
} from '../entities/test.entity';
import { LottFrontEngine } from 'src/classes/lott-front-engine.class';
import { DataSource } from 'typeorm';

const ds = new DataSource({
  type: 'sqlite',
  database: ':memory:', // :memory:, test.db
  dropSchema: true,
  entities: [TestEntity, RelationTestEntity, CircularTestEntity],
  synchronize: true,
  logging: false,
});
const em = ds.manager;

const lottFrontEngine = new LottFrontEngine(em);

const testTable = lottFrontEngine.define(TestEntity, {
  alias1: {
    name: 'first',
    desc: 'first desc',
  },
  alias2: {
    name: 'second',
  },
  alias3: {
    name: 'third',
  },
});

const testRelTable = lottFrontEngine.define(RelationTestEntity, {
  alias1: {
    name: 'alias1',
  },
  alias2: {
    name: 'alias2',
    sourceId: testTable.data.alias2,
  },
  alias3: {
    name: 'alias3',
  },
});

const testCirTable = lottFrontEngine.define(CircularTestEntity, {
  alias1: {
    name: 'alias1',
  },
  alias2: {
    name: 'alias2',
    parentId: 'alias1',
  },
});

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
  const first = em.create(CircularTestEntity, { name: 'first' });
  await em.save(first);
  const second = em.create(CircularTestEntity, {
    name: 'second',
    parent: first,
  });
  await em.save(second);
  lottFrontEngine.set([testTable, testRelTable, testCirTable]);
});

afterEach(async () => {
  await ds.destroy();
});

describe('Front testTable', () => {
  test('first test', () => {
    expect(lottFrontEngine.run()).toEqual([
      '==>',
      ['==> orm.apply_table', 'TestEntity'],
      ['==> orm.apply_table', 'RelationTestEntity'],
      [
        '==> orm.apply_relation',
        'RelationTestEntity',
        'sourceId',
        'TestEntity',
        'id',
      ],
      ['==> orm.apply_table', 'CircularTestEntity'],
      [
        '==> orm.apply_relation',
        'CircularTestEntity',
        'parentId',
        'CircularTestEntity',
        'id',
      ],
      [
        '==> orm.apply_row',
        'TestEntity',
        'alias1',
        {
          name: 'first',
          desc: 'first desc',
        },
      ],
      [
        '==> orm.apply_row',
        'TestEntity',
        'alias2',
        {
          name: 'second',
        },
      ],
      [
        '==> orm.apply_row',
        'TestEntity',
        'alias3',
        {
          name: 'third',
        },
      ],
      [
        '==> orm.apply_row',
        'RelationTestEntity',
        'alias1',
        {
          name: 'alias1',
        },
      ],
      [
        '==?>',
        ['==> orm.find_appointed_id', 'TestEntity', 'id', 'alias2'],
        [
          '/=>',
          ['sourceId'],
          [
            '==> orm.apply_row',
            'RelationTestEntity',
            'alias2',
            [
              '::obj',
              {
                name: 'alias2',
              },
              ['::', 'sourceId', '@sourceId'],
            ],
          ],
        ],
      ],
      [
        '==> orm.apply_row',
        'RelationTestEntity',
        'alias3',
        {
          name: 'alias3',
        },
      ],
      [
        '==> orm.apply_row',
        'CircularTestEntity',
        'alias1',
        {
          name: 'alias1',
        },
      ],
      [
        '==?>',
        ['==> orm.find_appointed_id', 'CircularTestEntity', 'id', 'alias2'],
        [
          '/=>',
          ['parentId'],
          [
            '==> orm.apply_row',
            'CircularTestEntity',
            'alias2',
            [
              '::obj',
              {
                name: 'alias2',
              },
              ['::', 'parentId', '@parentId'],
            ],
          ],
        ],
      ],
    ]);
  });
});
