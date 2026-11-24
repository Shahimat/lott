import { JsonExecutorNodeBuilder } from './classes/json-executor.class';

export default async function () {
  const jsonExecutor = new JsonExecutorNodeBuilder();
  const { root, error } = jsonExecutor.build(['==>', 1]);
  console.log('Hello LOTT!');
  console.log(error);
  console.log(await root.solve(new Map(), new Map()));
}
