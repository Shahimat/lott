// const { lott, em } = Lott.from({
//   type: 'sqlite',
//   database: ':memory:',
//   // database: 'some.db',
//   dropSchema: true,
//   entities: [],
//   synchronize: true,
//   logging: false,
// });

// beforeEach(async () => {
//   await lott.connect();
// });

// afterEach(async () => {
//   await lott.disconnect();
// });

describe('simple test', () => {
  test('adds 1 + 2 to equal 3', async () => {
    // // const da = await Util.csvParse();
    // const data = em.create(LottTablesEntity, [
    //   {
    //     // id: 10,
    //     // updatedAt: new Date(),
    //     // createdAt: new Date(),
    //     name: 'wow',
    //     updatedBy: 'da',
    //   },
    // ]);
    // await em.save(data);

    // // await lott.insert(LottTablesEntity, [
    // //   {
    // //     // id: 10,
    // //     // updatedAt: new Date(),
    // //     // createdAt: new Date(),
    // //     name: 'wow',
    // //     // updatedBy: 'da',
    // //   },
    // // ]);
    // const result = await em.find(LottTablesEntity);
    // console.log(result);
    // console.log(JsonExecutorStringUtil.str.prototype.pattern);
    expect(1 + 2).toBe(3);
  });

  // test('some test', async () => {
  //   const builder = new JsonExecutorNodeBuilder();
  //   const root = builder.build(['==>', [1, 2, 3]]);
  //   if (root instanceof Error) {
  //     console.error(root);
  //   } else {
  //     const result = await root.solve();
  //     console.log(
  //       'RESULT: ',
  //       result,
  //       [...(root.node?.nodes.values() ?? [])].map((item) => item.value),
  //     );
  //     console.log('TREE: ', JSON.stringify(root.tree(), null, 2));
  //   }
  //   expect(1 + 2).toBe(3);
  // });
});
