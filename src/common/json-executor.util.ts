import { isNil } from 'lodash';
import {
  JsonExecutorCallbackNode,
  JsonExecutorNode,
} from 'src/classes/json-executor.class';
import { define } from 'src/decorators/json-executor.decorator';
import { JsonExecutorNodeVariantEnum } from 'src/enum/json-executor.enum';
import {
  type JsonExecutorConstantType,
  type JsonExecutorNextFunctionType,
  type JsonExecutorReturnType,
  JsonExecutorReturnWithErrorType,
} from 'src/types/json-executor.type';

export class JsonExecutorBasicOperationsUtil {
  @define({
    pattern: '==>',
  })
  public static exec(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    ...nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[]
  ): void {
    const localNext = (
      nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[],
      lastResult: JsonExecutorConstantType | null,
    ) => {
      const [firstNode, ...splitNodes] = nodes;
      if (firstNode) {
        firstNode.exec(
          (result) => {
            if (result instanceof Error) {
              next(result);
            } else {
              localNext(splitNodes, result);
            }
          },
          commonVariables,
          localVariables,
        );
      } else {
        next(lastResult);
      }
    };
    localNext(nodes, null);
  }

  @define({
    pattern: '==?',
  })
  public static ifelse(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    condition: JsonExecutorNode<JsonExecutorNodeVariantEnum>,
    thenCond: JsonExecutorNode<JsonExecutorNodeVariantEnum>,
    elseCond?: JsonExecutorNode<JsonExecutorNodeVariantEnum>,
  ): void {
    condition.exec(
      (conditionResult) => {
        if (conditionResult instanceof Error) {
          next(conditionResult);
        } else {
          if (conditionResult === false || isNil(conditionResult)) {
            if (elseCond) {
              elseCond.exec(
                (result) => {
                  next(result);
                },
                commonVariables,
                localVariables,
              );
            } else {
              next(null);
            }
            return;
          } else if (conditionResult === true || !isNil(conditionResult)) {
            thenCond.exec(
              (result) => {
                next(result);
              },
              commonVariables,
              localVariables,
            );
            return;
          } else {
            next(null);
            return;
          }
        }
      },
      commonVariables,
      localVariables,
    );
  }

  @define({
    pattern: '==??',
    wrapper: 'accumulator',
  })
  public static sequence(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    result: JsonExecutorReturnType,
    ...nodes: JsonExecutorCallbackNode[]
  ) {
    const sequenceRec = (nodes: JsonExecutorCallbackNode[]) => {
      const [node, ...splitNodes] = nodes;
      if (node) {
        const [variableName] = node.possibleVariableNames;
        node.exec(
          (cbResult) => {
            if (cbResult instanceof Error || !isNil(cbResult)) {
              next(cbResult);
            } else {
              sequenceRec(splitNodes);
            }
          },
          commonVariables,
          localVariables,
          variableName ? new Map().set(variableName, result) : undefined,
        );
      } else {
        next(null);
      }
    };
    sequenceRec(nodes);
  }

  @define({
    pattern: '==?>',
    wrapper: 'accumulator',
  })
  public static pipeline(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    resultInp: JsonExecutorReturnType,
    ...nodes: JsonExecutorCallbackNode[]
  ) {
    const pipelineRec = (
      result: JsonExecutorReturnWithErrorType,
      nodes: JsonExecutorCallbackNode[],
    ) => {
      if (result instanceof Error || isNil(result)) {
        next(result);
      } else {
        const [node, ...splitNodes] = nodes;
        if (node) {
          const [variableName] = node.possibleVariableNames;
          node.exec(
            (cbResult) => {
              pipelineRec(cbResult, splitNodes);
            },
            commonVariables,
            localVariables,
            variableName ? new Map().set(variableName, result) : undefined,
          );
        } else {
          next(result);
        }
      }
    };
    pipelineRec(resultInp, nodes);
  }
}

export class JsonExecutorFormatterUtil {
  @define({ pattern: '::', wrapper: 'simple' })
  public static arr(...nodeResults: JsonExecutorReturnType[]): unknown[] {
    const arrValues = (...input: unknown[]): Array<unknown> =>
      input.flatMap((item) => {
        if (Array.isArray(item)) {
          return arrValues(...item);
        } else {
          return isNil(item) ? [] : [item];
        }
      });
    return arrValues(...nodeResults);
  }

  @define({ pattern: '::num', wrapper: 'simple' })
  public static num(...nodeResults: JsonExecutorReturnType[]): number[] {
    return nodeResults
      .map((item) => {
        const num = Number(item);
        return Number.isNaN(num) ? null : num;
      })
      .filter((item) => item !== null);
  }

  @define({ pattern: '::num.+', wrapper: 'simple' })
  public static numSum(
    ...nodeResults: JsonExecutorReturnType[]
  ): number | null {
    const [first, ...other] = JsonExecutorFormatterUtil.num(...nodeResults);
    return first
      ? other.reduce((acc: number, curr) => acc + curr, first)
      : null;
  }

  @define({ pattern: '::num.-', wrapper: 'simple' })
  public static numDiff(
    ...nodeResults: JsonExecutorReturnType[]
  ): number | null {
    const [first, ...other] = JsonExecutorFormatterUtil.num(...nodeResults);
    return first
      ? other.reduce((acc: number, curr) => acc - curr, first)
      : null;
  }
}
