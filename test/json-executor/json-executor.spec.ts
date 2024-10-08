import { JsonExecutorNodeBuilder } from 'src/classes/json-executor.class';
import { JsonExecutorOperandWrapperEnum } from 'src/enum/json-executor.enum';
import { JsonExecutorReturnType } from 'src/types/json-executor.type';

describe('json executor parser', () => {
  test('parse string', () => {
    expect(JsonExecutorNodeBuilder.parseString('==>')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'exec',
      group: null,
      name: '==>',
    });
    expect(JsonExecutorNodeBuilder.parseString('/=>')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'callback',
      group: null,
      name: '/=>',
    });
    expect(JsonExecutorNodeBuilder.parseString('==?')).toEqual({
      type: 'operand',
      operand: '==?',
      category: 'condition',
      group: null,
      name: '==?',
    });
    expect(JsonExecutorNodeBuilder.parseString('==??')).toEqual({
      type: 'operand',
      operand: '==??',
      category: 'condition',
      group: null,
      name: '==??',
    });
    expect(JsonExecutorNodeBuilder.parseString('::')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: null,
      name: '::',
    });
    expect(JsonExecutorNodeBuilder.parseString('  ==>  ')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'exec',
      group: null,
      name: '==>',
    });
    expect(JsonExecutorNodeBuilder.parseString('  /=>  ')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'callback',
      group: null,
      name: '/=>',
    });
    expect(JsonExecutorNodeBuilder.parseString('  ==?  ')).toEqual({
      type: 'operand',
      operand: '==?',
      category: 'condition',
      group: null,
      name: '==?',
    });
    expect(JsonExecutorNodeBuilder.parseString('  ==??  ')).toEqual({
      type: 'operand',
      operand: '==??',
      category: 'condition',
      group: null,
      name: '==??',
    });
    expect(JsonExecutorNodeBuilder.parseString('  ::  ')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: null,
      name: '::',
    });
    expect(JsonExecutorNodeBuilder.parseString(' ==>   test_sum  ')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'command',
      group: null,
      name: 'test_sum',
    });
    expect(JsonExecutorNodeBuilder.parseString('==>  @test ')).toEqual({
      type: 'constant',
    });
    expect(
      JsonExecutorNodeBuilder.parseString('==> testTEST1230_+-*/=^<>?(){}[]'),
    ).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'command',
      group: null,
      name: 'testTEST1230_+-*/=^<>?(){}[]',
    });
    expect(JsonExecutorNodeBuilder.parseString('==>>a')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'command',
      group: null,
      name: '>a',
    });
    expect(JsonExecutorNodeBuilder.parseString('==>a>')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'command',
      group: null,
      name: 'a>',
    });
    expect(JsonExecutorNodeBuilder.parseString('==> parent.child')).toEqual({
      type: 'operand',
      operand: '==>',
      category: 'command',
      group: 'parent',
      name: 'child',
    });
    expect(JsonExecutorNodeBuilder.parseString('  /=>   test_sum  ')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'custom',
      group: null,
      name: 'test_sum',
    });
    expect(JsonExecutorNodeBuilder.parseString('/=>  @test ')).toEqual({
      type: 'constant',
    });
    expect(
      JsonExecutorNodeBuilder.parseString('/=> testTEST1230_+-*/=^<>?(){}[]'),
    ).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'custom',
      group: null,
      name: 'testTEST1230_+-*/=^<>?(){}[]',
    });
    expect(JsonExecutorNodeBuilder.parseString('/=>>a')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'custom',
      group: null,
      name: '>a',
    });
    expect(JsonExecutorNodeBuilder.parseString('/=>a>')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'custom',
      group: null,
      name: 'a>',
    });
    expect(
      JsonExecutorNodeBuilder.parseString('==? testTEST1230_+-*/=^<>?(){}[]'),
    ).toEqual({
      type: 'operand',
      operand: '==?',
      category: 'condition',
      group: null,
      name: 'testTEST1230_+-*/=^<>?(){}[]',
    });
    expect(JsonExecutorNodeBuilder.parseString('/=> parent.child')).toEqual({
      type: 'operand',
      operand: '/=>',
      category: 'custom',
      group: 'parent',
      name: 'child',
    });
    expect(
      JsonExecutorNodeBuilder.parseString('==?? testTEST1230_+-*/=^<>?(){}[]'),
    ).toEqual({
      type: 'operand',
      operand: '==??',
      category: 'condition',
      group: null,
      name: 'testTEST1230_+-*/=^<>?(){}[]',
    });
    expect(JsonExecutorNodeBuilder.parseString('==?>a')).toEqual({
      type: 'operand',
      operand: '==?>',
      category: 'condition',
      group: null,
      name: 'a',
    });
    expect(JsonExecutorNodeBuilder.parseString('==??a')).toEqual({
      type: 'operand',
      operand: '==??',
      category: 'condition',
      group: null,
      name: 'a',
    });
    expect(JsonExecutorNodeBuilder.parseString('==?a>')).toEqual({
      type: 'operand',
      operand: '==?',
      category: 'condition',
      group: null,
      name: 'a>',
    });
    expect(JsonExecutorNodeBuilder.parseString('==? parent.child')).toEqual({
      type: 'operand',
      operand: '==?',
      category: 'condition',
      group: 'parent',
      name: 'child',
    });
    expect(JsonExecutorNodeBuilder.parseString('==?? parent.child')).toEqual({
      type: 'operand',
      operand: '==??',
      category: 'condition',
      group: 'parent',
      name: 'child',
    });
    expect(JsonExecutorNodeBuilder.parseString('==?> parent.child')).toEqual({
      type: 'operand',
      operand: '==?>',
      category: 'condition',
      group: 'parent',
      name: 'child',
    });
    expect(JsonExecutorNodeBuilder.parseString('::test')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: 'test',
      name: '::test',
    });
    expect(JsonExecutorNodeBuilder.parseString('::.test')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: null,
      name: 'test',
    });
    expect(JsonExecutorNodeBuilder.parseString('::  test')).toEqual({
      type: 'constant',
    });
    expect(
      JsonExecutorNodeBuilder.parseString(
        '::test_category.testTEST1230_+-*/=^<>?(){}[]',
      ),
    ).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: 'test_category',
      name: 'testTEST1230_+-*/=^<>?(){}[]',
    });
    expect(JsonExecutorNodeBuilder.parseString('::>a')).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString('::.>a')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: null,
      name: '>a',
    });
    expect(JsonExecutorNodeBuilder.parseString('::a>')).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString('::.a>')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: null,
      name: 'a>',
    });
    expect(JsonExecutorNodeBuilder.parseString('::a.>')).toEqual({
      type: 'operand',
      operand: '::',
      category: 'formatter',
      group: 'a',
      name: '>',
    });
    expect(JsonExecutorNodeBuilder.parseString('::a.>.w.d')).toEqual({
      type: 'constant',
    });
    expect(
      JsonExecutorNodeBuilder.parseString('::test_category .test_name'),
    ).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString('@test')).toEqual({
      type: 'local_var',
      name: 'test',
    });
    expect(JsonExecutorNodeBuilder.parseString('@')).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString(' @test ')).toEqual({
      type: 'local_var',
      name: 'test',
    });
    expect(JsonExecutorNodeBuilder.parseString(' @ test ')).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString('#test')).toEqual({
      type: 'common_var',
      name: 'test',
    });
    expect(JsonExecutorNodeBuilder.parseString('#')).toEqual({
      type: 'constant',
    });
    expect(JsonExecutorNodeBuilder.parseString(' #test ')).toEqual({
      type: 'common_var',
      name: 'test',
    });
    expect(JsonExecutorNodeBuilder.parseString(' # test ')).toEqual({
      type: 'constant',
    });
  });

  test('parse input', () => {
    expect(JsonExecutorNodeBuilder.parseInput('some str')).toEqual({
      type: 'constant',
      value: 'some str',
    });
    expect(JsonExecutorNodeBuilder.parseInput(1)).toEqual({
      type: 'constant',
      value: 1,
    });
    expect(JsonExecutorNodeBuilder.parseInput(true)).toEqual({
      type: 'constant',
      value: true,
    });
    expect(JsonExecutorNodeBuilder.parseInput({ some: 'str' })).toEqual({
      type: 'constant',
      value: { some: 'str' },
    });
    expect(JsonExecutorNodeBuilder.parseInput([1, 2, 3])).toEqual({
      type: 'constant',
      value: [1, 2, 3],
    });
    expect(JsonExecutorNodeBuilder.parseInput('==>')).toEqual({
      type: 'constant',
      value: '==>',
    });
    expect(JsonExecutorNodeBuilder.parseInput(['==>'])).toEqual({
      type: 'operand',
      category: 'exec',
      operand: '==>',
      group: null,
      name: '==>',
      additions: null,
      args: [],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput(['==>', ['==>', ['==>']]]),
    ).toEqual({
      type: 'operand',
      category: 'exec',
      operand: '==>',
      group: null,
      name: '==>',
      additions: null,
      args: [
        {
          type: 'operand',
          category: 'exec',
          operand: '==>',
          group: null,
          name: '==>',
          additions: null,
          args: [
            {
              type: 'operand',
              category: 'exec',
              operand: '==>',
              group: null,
              name: '==>',
              additions: null,
              args: [],
            },
          ],
        },
      ],
    });
    expect(JsonExecutorNodeBuilder.parseInput(['==>', 1, 2])).toEqual({
      type: 'operand',
      category: 'exec',
      operand: '==>',
      group: null,
      name: '==>',
      additions: null,
      args: [
        { type: 'constant', value: 1 },
        { type: 'constant', value: 2 },
      ],
    });
    expect(JsonExecutorNodeBuilder.parseInput(['::', ['::str', 2, 3]])).toEqual(
      {
        type: 'constant',
        value: ['::str', 2, 3],
      },
    );
    expect(
      JsonExecutorNodeBuilder.parseInput(['::', ['::str', 2, 3], []]),
    ).toEqual({
      type: 'operand',
      category: 'formatter',
      operand: '::',
      group: null,
      name: '::',
      additions: null,
      args: [
        {
          type: 'operand',
          category: 'formatter',
          operand: '::',
          group: 'str',
          name: '::str',
          additions: null,
          args: [
            { type: 'constant', value: 2 },
            { type: 'constant', value: 3 },
          ],
        },
        { type: 'constant', value: [] },
      ],
    });
    expect(JsonExecutorNodeBuilder.parseInput(['::str', '@variable'])).toEqual({
      type: 'constant',
      value: '@variable',
    });
    expect(
      JsonExecutorNodeBuilder.parseInput(['::str', '@variable', 123]),
    ).toEqual({
      type: 'operand',
      category: 'formatter',
      operand: '::',
      group: 'str',
      name: '::str',
      additions: null,
      args: [
        { type: 'local_var', name: 'variable' },
        { type: 'constant', value: 123 },
      ],
    });
    expect(JsonExecutorNodeBuilder.parseInput(['::num', '10'])).toEqual({
      type: 'constant',
      value: 10,
    });
    expect(JsonExecutorNodeBuilder.parseInput(['::num', '@variable'])).toEqual({
      type: 'operand',
      category: 'formatter',
      operand: '::',
      group: 'num',
      name: '::num',
      additions: null,
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput(['/=>', 'variable', '@variable']),
    ).toEqual({
      type: 'operand',
      category: 'callback',
      operand: '/=>',
      group: null,
      name: '/=>',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput(['/=>', ['variable'], '@variable']),
    ).toEqual({
      type: 'operand',
      category: 'callback',
      operand: '/=>',
      group: null,
      name: '/=>',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=>',
        'variable',
        '@variable',
        'removed',
        'removed',
      ]),
    ).toEqual({
      type: 'operand',
      category: 'callback',
      operand: '/=>',
      group: null,
      name: '/=>',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=>',
        ['variable1', 'variable2'],
        ['::num.+', '@variable1', '@variable2'],
      ]),
    ).toEqual({
      type: 'operand',
      category: 'callback',
      operand: '/=>',
      group: null,
      name: '/=>',
      additions: ['variable1', 'variable2'],
      args: [
        {
          type: 'operand',
          category: 'formatter',
          operand: '::',
          group: 'num',
          name: '+',
          additions: null,
          args: [
            { type: 'local_var', name: 'variable1' },
            { type: 'local_var', name: 'variable2' },
          ],
        },
      ],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=> fun_custom',
        'variable',
        '@variable',
      ]),
    ).toEqual({
      type: 'operand',
      category: 'custom',
      operand: '/=>',
      group: null,
      name: 'fun_custom',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=> fun_custom',
        ['variable'],
        '@variable',
      ]),
    ).toEqual({
      type: 'operand',
      category: 'custom',
      operand: '/=>',
      group: null,
      name: 'fun_custom',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=> fun_custom',
        'variable',
        '@variable',
        'removed',
        'removed',
      ]),
    ).toEqual({
      type: 'operand',
      category: 'custom',
      operand: '/=>',
      group: null,
      name: 'fun_custom',
      additions: ['variable'],
      args: [{ type: 'local_var', name: 'variable' }],
    });
    expect(
      JsonExecutorNodeBuilder.parseInput([
        '/=> fun_custom',
        ['variable1', 'variable2'],
        ['::num.+', '@variable1', '@variable2'],
      ]),
    ).toEqual({
      type: 'operand',
      category: 'custom',
      operand: '/=>',
      group: null,
      name: 'fun_custom',
      additions: ['variable1', 'variable2'],
      args: [
        {
          type: 'operand',
          category: 'formatter',
          operand: '::',
          group: 'num',
          name: '+',
          additions: null,
          args: [
            { type: 'local_var', name: 'variable1' },
            { type: 'local_var', name: 'variable2' },
          ],
        },
      ],
    });
    expect(JsonExecutorNodeBuilder.parseInput(['==?', true, 1, 2])).toEqual({
      type: 'operand',
      category: 'condition',
      operand: '==?',
      group: null,
      name: '==?',
      additions: null,
      args: [
        { type: 'constant', value: true },
        { type: 'constant', value: 1 },
        { type: 'constant', value: 2 },
      ],
    });
  });

  test('jsonExecutor works', async () => {
    const jsonExecutor = new JsonExecutorNodeBuilder();
    const { root, error } = jsonExecutor.build(['==>', 1, 2, 3]);
    expect(error).toEqual(null);
    expect(await root.solve(new Map(), new Map())).toEqual(3);
    root.tree(
      (nodeTree) => {
        expect(nodeTree).toEqual({
          node: 'root',
          value: 3,
          nodes: [
            {
              node: 'operation',
              category: 'exec',
              name: '==>',
              value: 3,
              nodes: [
                {
                  node: 'constant',
                  value: 1,
                },
                {
                  node: 'constant',
                  value: 2,
                },
                {
                  node: 'constant',
                  value: 3,
                },
              ],
            },
          ],
        });
      },
      new Map(),
      new Map(),
    );
    expect(await jsonExecutor.tree(['==?', true, 1, 2])).toEqual({
      node: 'root',
      value: 1,
      nodes: [
        {
          node: 'operation',
          category: 'condition',
          name: '==?',
          value: 1,
          nodes: [
            {
              node: 'constant',
              value: true,
            },
            {
              node: 'constant',
              value: 1,
            },
            {
              node: 'constant',
              value: 2,
            },
          ],
        },
      ],
    });
    expect(await jsonExecutor.tree(['==?', false, 1, 2])).toEqual({
      node: 'root',
      value: 2,
      nodes: [
        {
          node: 'operation',
          category: 'condition',
          name: '==?',
          value: 2,
          nodes: [
            {
              node: 'constant',
              value: false,
            },
            {
              node: 'constant',
              value: 1,
            },
            {
              node: 'constant',
              value: 2,
            },
          ],
        },
      ],
    });
    expect(await jsonExecutor.tree(['==>', new Error('text')])).toEqual({
      node: 'root',
      value: 'Error: text',
      nodes: [
        {
          node: 'operation',
          category: 'exec',
          name: '==>',
          value: 'Error: text',
          nodes: [
            {
              node: 'constant',
              value: 'Error: text',
            },
          ],
        },
      ],
    });
  });

  test('define custom functions', async () => {
    const jsonExecutor = new JsonExecutorNodeBuilder(
      JsonExecutorNodeBuilder.define({
        pattern: 'test_sum',
        wrapper: JsonExecutorOperandWrapperEnum.simple,
        fn: (...nodeResults: JsonExecutorReturnType[]) =>
          nodeResults.reduce((acc: number, curr) => acc + Number(curr), 0),
      }),
    );
    const { root, error } = jsonExecutor.build([
      '==> test_sum',
      1,
      ['==> test_sum', 1, 1],
      3,
    ]);
    expect(error).toEqual(null);
    expect(await root.solve(new Map(), new Map())).toEqual(6);

    expect(
      await jsonExecutor.tree([
        '==>',
        ['/=> solve', ['var1', 'var2'], ['==> test_sum', '@var1', '@var2']],
        ['==> solve', 3, 4],
      ]),
    ).toEqual({
      node: 'root',
      value: 7,
      nodes: [
        {
          category: 'exec',
          name: '==>',
          node: 'operation',
          value: 7,
          nodes: [
            {
              category: 'command',
              name: 'solve',
              node: 'operation',
              value: 7,
              nodes: [
                { node: 'constant', value: 3 },
                { node: 'constant', value: 4 },
              ],
            },
          ],
        },
      ],
    });
  });

  const jsonExecutor = new JsonExecutorNodeBuilder();

  test('common variable', async () => {
    expect(
      await jsonExecutor.test(
        ['==>', '#variable1'],
        undefined,
        new Map().set('variable1', 10),
      ),
    ).toEqual(10);
  });

  test('test base functions', async () => {
    /* === OPERATION === */
    expect(await jsonExecutor.test(['==>', 1, 2, 3, 4, 5])).toEqual(5);
    expect(await jsonExecutor.test(['==>', 1, 2, 3, 4, ['==>', 5]])).toEqual(5);
    expect(
      await jsonExecutor.test([
        '==>',
        ['==>', ['==>', ['==>', ['==>', true]]]],
      ]),
    ).toEqual(true);

    /* === FORMATTER === */
    expect(
      await jsonExecutor.test([
        '::',
        1,
        2,
        null,
        [3],
        [[['text']], { test: true }],
        new Date('2024-08-20T09:05:52.061Z'),
        new Map(),
        new Set([1, 2]),
      ]),
    ).toEqual([
      1,
      2,
      3,
      'text',
      { test: true },
      new Date('2024-08-20T09:05:52.061Z'),
      new Map(),
      1,
      2,
    ]);
    expect(
      await jsonExecutor.test([
        '::num',
        1,
        2,
        [3],
        ['3', 'text', true, { object: true }, 4],
      ]),
    ).toEqual([1, 2, 3, 3, 4]);
    expect(await jsonExecutor.test(['::num.+', 1, 2, [3], [3, 4]])).toEqual(13);
    expect(await jsonExecutor.test(['::num.-', 1, 2, [3], [3, 4]])).toEqual(
      -11,
    );
    expect(await jsonExecutor.test(['::obj', 1, 2])).toEqual({});
    expect(await jsonExecutor.test(['::obj', { field: 'test' }])).toEqual({
      field: 'test',
    });
    expect(
      await jsonExecutor.test(['::obj', { field: 'test' }, { test: 'field' }]),
    ).toEqual({
      field: 'test',
      test: 'field',
    });
    expect(
      await jsonExecutor.test(['::obj', ['field', 'test'], ['test', true]]),
    ).toEqual({
      field: 'test',
      test: true,
    });
    expect(
      await jsonExecutor.test([
        '::obj',
        [{ field: 'test' }, { test: 'field' }],
        [{ test: 10 }, { test2: true }],
      ]),
    ).toEqual({
      field: 'test',
      test: 10,
      test2: true,
    });
    expect(
      await jsonExecutor.test([
        '::obj',
        ['::', 'field', 'test'],
        new Date('2024-08-20T09:05:52.061Z'),
        new Map(),
        new Set([1, 2]),
      ]),
    ).toEqual({
      field: 'test',
    });
    expect(await jsonExecutor.test(['::err', 1])).toEqual(new Error('1'));
    expect(await jsonExecutor.test(['::err', 1, 'text', true])).toEqual(
      new Error('1,text,true'),
    );
    expect(await jsonExecutor.test(['::err', { obj: true }])).toEqual(
      new Error('[object Object]'),
    );
    expect(await jsonExecutor.test(['::err', [[]]])).toEqual(new Error());
    expect(
      await jsonExecutor.test(['::set', 1, 2, 3, [[[4]]], new Set(['a', 'b'])]),
    ).toEqual(new Set([1, 2, 3, 4, 'a', 'b']));

    /* === CONDITION === */
    expect(await jsonExecutor.test(['==?', true, 1, 2])).toEqual(1);
    expect(await jsonExecutor.test(['==?', false, 1])).toEqual(null);
    expect(await jsonExecutor.test(['==??', 1])).toEqual(null);
    expect(await jsonExecutor.test(['==??', 1, 2, 3, 4, 5])).toEqual(null);
    expect(
      await jsonExecutor.test(['==??', 1, ['/=>', 'res', '@res']]),
    ).toEqual(1);
    expect(
      await jsonExecutor.test(['==??', 2, ['/=>', 'res', '@res']]),
    ).toEqual(2);
    expect(
      await jsonExecutor.test(['==??', 1, 2, ['/=>', 'res', '@res']]),
    ).toEqual([1, 2]);
    expect(
      await jsonExecutor.test(['==??', null, 2, ['/=>', 'res', '@res']]),
    ).toEqual([null, 2]);
    expect(
      await jsonExecutor.test([
        '==??',
        1,
        ['/=>', 'res', '@res'],
        ['/=>', 'res', '@res'],
        ['/=>', 'res', '@res'],
      ]),
    ).toEqual(1);
    expect(
      await jsonExecutor.test([
        '==??',
        1,
        ['/=>', 'res', null],
        ['/=>', 'res', null],
        ['/=>', 'res', 'some_text'],
      ]),
    ).toEqual('some_text');
    expect(await jsonExecutor.test(['==?>', 1])).toEqual(1);
    expect(await jsonExecutor.test(['==?>', 1, 2, 3, 4, 5])).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(await jsonExecutor.test(['==?>', 1, 2, 3, null, 5])).toEqual([
      1,
      2,
      3,
      null,
      5,
    ]);
    expect(
      await jsonExecutor.test(['==?>', 1, ['/=>', 'res', '@res']]),
    ).toEqual(1);
    expect(
      await jsonExecutor.test([
        '==?>',
        1,
        ['/=>', 'res', ['::num.+', '@res', 2]],
        ['/=>', 'res', ['::num.+', '@res', 2]],
      ]),
    ).toEqual(5);
  });
});
