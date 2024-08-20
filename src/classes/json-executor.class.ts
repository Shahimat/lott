import {
  JsonExecutorBasicOperationsUtil,
  JsonExecutorFormatterUtil,
} from 'src/common/json-executor.util';
import { Util } from 'src/common/util';
import {
  JsonExecutorNodeVariantEnum,
  JsonExecutorOperandCategoryEnum,
  JsonExecutorOperandWrapperEnum,
} from 'src/enum/json-executor.enum';
import {
  JsonExecutorAbstractSyntaxTreeType,
  JsonExecutorConstantType,
  JsonExecutorFunctionOptions,
  JsonExecutorNextFunctionType,
  JsonExecutorNextTreeFunctionType,
  JsonExecutorNodeTreeOptionsType,
  JsonExecutorNodeTreeType,
  JsonExecutorOperationConstructorType,
  JsonExecutorOperationFunctionAccumulatorType,
  JsonExecutorOperationFunctionSimpleType,
  JsonExecutorOperationFunctionType,
  JsonExecutorRawFunctionType,
  JsonExecutorReturnType,
  JsonExecutorReturnWithErrorType,
} from 'src/types/json-executor.type';

/**
 * CLASS:
 * - PARSER OF JSON_EXECUTOR FORMAT
 * - BUILD ROOT NODE
 * - CONFIGURES BASE & CUSTOM OPERATIONS FOR USING IN FORMAT
 */
export class JsonExecutorNodeBuilder {
  public static readonly PATTERN_OPERATOR = /^(::|==>|\/=>|==\?[?>]?).*$/;
  public static readonly DEFAULT_OPERATOR =
    /^(==>|\/=>|==\?[?>]?)\s*((\w+)\.)?([\w+\-*/=^<>?(){}[\]]*)?$/;
  public static readonly FORMATTER_OPERATOR =
    /^(::\w*)\.?([\w+\-*/=^<>?(){}[\]]*)?$/;
  public static readonly PATTERN_VARIABLE = /^([@#])(\w+)$/;

  public static matchCategory(
    operand: string,
  ): JsonExecutorOperandCategoryEnum {
    if (/^::\w*(\.[\w+\-*/=^<>?(){}[\]]*)?$/.test(operand)) {
      return JsonExecutorOperandCategoryEnum.formatter;
    } else if (/^==>$/.test(operand)) {
      return JsonExecutorOperandCategoryEnum.exec;
    } else if (/^==>\s*((\w+)\.)?([\w+\-*/=^<>?(){}[\]]*)?$/.test(operand)) {
      return JsonExecutorOperandCategoryEnum.command;
    } else if (/^\/=>$/.test(operand)) {
      return JsonExecutorOperandCategoryEnum.callback;
    } else if (/^\/=>\s*((\w+)\.)?([\w+\-*/=^<>?(){}[\]]*)?$/.test(operand)) {
      return JsonExecutorOperandCategoryEnum.custom;
    } else if (
      /^==\?[?>]?\s*((\w+)\.)?([\w+\-*/=^<>?(){}[\]]*)?$/.test(operand)
    ) {
      return JsonExecutorOperandCategoryEnum.condition;
    } else {
      return JsonExecutorOperandCategoryEnum.unknown;
    }
  }

  public static parseString(input: unknown | string):
    | {
        type: 'operand';
        category: JsonExecutorOperandCategoryEnum;
        operand: string;
        name: string | null;
      }
    | { type: 'local_var' | 'common_var'; name: string }
    | { type: 'constant' } {
    if (typeof input !== 'string') {
      return { type: 'constant' };
    }
    const inputTrim = input.trim();
    if (JsonExecutorNodeBuilder.PATTERN_VARIABLE.test(inputTrim)) {
      const match = JsonExecutorNodeBuilder.PATTERN_VARIABLE.exec(inputTrim);
      if (!match) {
        throw new Error(
          `unknown string: "${inputTrim}", pattern: "${JsonExecutorNodeBuilder.PATTERN_VARIABLE}"`,
        );
      } else {
        const variableVariant = match![1] as string;
        const name = match![2] as string;
        if (name) {
          return {
            type: variableVariant === '#' ? 'common_var' : 'local_var',
            name,
          };
        } else {
          return {
            type: 'constant',
          };
        }
      }
    } else if (JsonExecutorNodeBuilder.PATTERN_OPERATOR.test(inputTrim)) {
      const category = JsonExecutorNodeBuilder.matchCategory(inputTrim);
      if (category === JsonExecutorOperandCategoryEnum.unknown) {
        return {
          type: 'constant',
        };
      } else if (category === JsonExecutorOperandCategoryEnum.formatter) {
        const match =
          JsonExecutorNodeBuilder.FORMATTER_OPERATOR.exec(inputTrim);
        if (!match) {
          throw new Error(
            `unknown string: "${inputTrim}", pattern: "${JsonExecutorNodeBuilder.FORMATTER_OPERATOR}"`,
          );
        } else {
          const operand = match[1] as string;
          const name = (match[2] ?? null) as string | null;
          return {
            type: 'operand',
            operand,
            category,
            name: name === '' ? null : name,
          };
        }
      } else {
        const match = JsonExecutorNodeBuilder.DEFAULT_OPERATOR.exec(inputTrim);
        if (!match) {
          throw new Error(
            `unknown string: "${inputTrim}", pattern: "${JsonExecutorNodeBuilder.DEFAULT_OPERATOR}"`,
          );
        } else {
          const operand = match[1] as string;
          const group = (match[3] ?? null) as string | null;
          const name = (match[4] ?? null) as string | null;
          return {
            type: 'operand',
            operand: group ? `${operand}${group}` : operand,
            category,
            name: name === '' ? null : name,
          };
        }
      }
    } else {
      return {
        type: 'constant',
      };
    }
  }

  public static parseInput(
    input: unknown | unknown[],
  ): JsonExecutorAbstractSyntaxTreeType {
    if (Array.isArray(input)) {
      const [first, ...args] = input as unknown[];
      const parsed = JsonExecutorNodeBuilder.parseString(first);
      if (parsed.type === 'operand') {
        if (
          parsed.category === JsonExecutorOperandCategoryEnum.formatter &&
          args.length === 1
        ) {
          const [firstArg] = args;
          if (parsed.operand === '::') {
            return {
              type: 'constant',
              value: Array.isArray(firstArg) ? firstArg : [firstArg],
            };
          }
          if (
            firstArg &&
            typeof firstArg !== 'object' &&
            !Array.isArray(firstArg)
          ) {
            if (parsed.operand === '::str') {
              return {
                type: 'constant',
                value: String(firstArg),
              };
            }
            const parsedFirstArg =
              typeof firstArg === 'string'
                ? JsonExecutorNodeBuilder.parseString(firstArg)
                : null;
            if (
              parsed.operand === '::num' &&
              (parsedFirstArg ? parsedFirstArg.type === 'constant' : true)
            ) {
              const result = Number(firstArg);
              return {
                type: 'constant',
                value: Number.isNaN(result) ? null : result,
              };
            }
            if (
              parsed.operand === '::bool' &&
              (parsedFirstArg ? parsedFirstArg.type === 'constant' : true)
            ) {
              return {
                type: 'constant',
                value: Boolean(firstArg),
              };
            }
          }
        }
        if (
          parsed.category === JsonExecutorOperandCategoryEnum.callback ||
          parsed.category === JsonExecutorOperandCategoryEnum.custom
        ) {
          const [possibleVariableNames, body] = args;
          return {
            ...parsed,
            additions:
              typeof possibleVariableNames === 'string'
                ? [possibleVariableNames]
                : Array.isArray(possibleVariableNames)
                  ? possibleVariableNames.filter(
                      (item) => typeof item === 'string',
                    )
                  : [],
            args: [JsonExecutorNodeBuilder.parseInput(body)],
          };
        }
        return {
          ...parsed,
          additions: null,
          args: args.map((arg) => JsonExecutorNodeBuilder.parseInput(arg)),
        };
      } else {
        return {
          type: 'constant',
          value: input ?? null,
        };
      }
    } else {
      const parsed = JsonExecutorNodeBuilder.parseString(input);
      if (parsed.type === 'local_var' || parsed.type === 'common_var') {
        return parsed;
      } else {
        return {
          type: 'constant',
          value: (input ?? null) as JsonExecutorConstantType | null,
        };
      }
    }
  }

  public static simplifyValue(
    value: JsonExecutorReturnWithErrorType,
  ): JsonExecutorConstantType | null {
    if (value instanceof Error) {
      return `Error: ${value.message}`;
    } else if (value instanceof Set) {
      return [...value];
    } else {
      return value;
    }
  }

  protected static buildNodes(
    input: JsonExecutorAbstractSyntaxTreeType,
    operations: Map<
      JsonExecutorOperandCategoryEnum,
      Map<string, JsonExecutorFunction>
    >,
    root: JsonExecutorRootNode,
    parentNode:
      | JsonExecutorOperationNode
      | JsonExecutorCallbackNode
      | JsonExecutorRootNode,
    customDeclarationFunctions: Map<string, JsonExecutorCallbackNode>,
  ): Error | null {
    const applyNode = (
      node: JsonExecutorNode<JsonExecutorNodeVariantEnum>,
      args?: (Error | null)[],
    ): Error | null => {
      if (parentNode.variant === JsonExecutorNodeVariantEnum.callback) {
        parentNode.setNodes([node]);
      } else {
        parentNode.addNode(node);
      }
      const [error] = args?.filter((item) => item !== null) ?? [];
      return error ?? null;
    };

    const getError = (text: string) => {
      const params: Record<string, unknown> = { ...input };
      if (input.type === 'operand') {
        params['args'] = input.args.length;
      }
      return new Error(
        [text, `Params: ${JSON.stringify(params, null, 2)}`].join('\n'),
      );
    };

    if (/* === CONSTANT? === */ input.type === 'constant') {
      return applyNode(new JsonExecutorConstantNode(input.value));
    } else if (
      /* === VARIABLE? === */ input.type === 'local_var' ||
      input.type === 'common_var'
    ) {
      return applyNode(
        new JsonExecutorVariableNode(
          input.type === 'local_var'
            ? JsonExecutorNodeVariantEnum.local_var
            : JsonExecutorNodeVariantEnum.common_var,
          input.name,
        ),
      );
    } else if (/* === OPERAND? === */ input.type === 'operand') {
      if (input.category === JsonExecutorOperandCategoryEnum.custom) {
        const name = input.name!;
        const [firstArg] = input.args;
        if (!firstArg) {
          return getError('Callback body not defined');
        }
        const node = new JsonExecutorCallbackNode(input.additions ?? []);
        customDeclarationFunctions.set(name, node);
        return JsonExecutorNodeBuilder.buildNodes(
          firstArg,
          operations,
          root,
          node,
          customDeclarationFunctions,
        );
      } else if (input.category === JsonExecutorOperandCategoryEnum.callback) {
        const [firstArg] = input.args;
        if (!firstArg) {
          return getError('Callback body not defined');
        }
        const node = new JsonExecutorCallbackNode(input.additions ?? []);
        return applyNode(node, [
          JsonExecutorNodeBuilder.buildNodes(
            firstArg,
            operations,
            root,
            node,
            customDeclarationFunctions,
          ),
        ]);
      } else if (
        input.category === JsonExecutorOperandCategoryEnum.exec ||
        input.category === JsonExecutorOperandCategoryEnum.formatter ||
        input.category === JsonExecutorOperandCategoryEnum.command ||
        input.category === JsonExecutorOperandCategoryEnum.condition
      ) {
        let node: JsonExecutorOperationNode | null = null;
        if (
          input.category === JsonExecutorOperandCategoryEnum.command &&
          input.name &&
          customDeclarationFunctions.has(input.name)
        ) {
          const cb = customDeclarationFunctions.get(input.name)!;
          node = new JsonExecutorOperationNode(
            JsonExecutorNodeVariantEnum.operation,
            JsonExecutorFunction.callCustomFunction(cb, input.name)!,
            null,
          );
          return applyNode(
            node,
            input.args.map((arg) =>
              JsonExecutorNodeBuilder.buildNodes(
                arg,
                operations,
                root,
                node!,
                customDeclarationFunctions,
              ),
            ),
          );
        }
        if (!node) {
          const operationCategory = operations.get(input.category);
          if (!operationCategory) {
            return getError('Operation category not defined');
          }

          const operation =
            operationCategory.get(input.name ?? input.operand) ?? null;
          if (!operation) {
            return getError('Operation not founded');
          }
          node = new JsonExecutorOperationNode(
            JsonExecutorNodeVariantEnum.operation,
            operation,
            null,
          );
        }
        return applyNode(
          node,
          input.args.map((arg) =>
            JsonExecutorNodeBuilder.buildNodes(
              arg,
              operations,
              root,
              node,
              customDeclarationFunctions,
            ),
          ),
        );
      } else {
        return getError('Unknown category');
      }
    } else {
      return getError('Unknown params');
    }
  }

  public static define(
    input: JsonExecutorFunctionOptions,
  ): JsonExecutorFunction | null {
    return JsonExecutorFunction.build(input);
  }

  public static root() {
    return new JsonExecutorRootNode();
  }

  private readonly operations: Map<
    JsonExecutorOperandCategoryEnum,
    Map<string, JsonExecutorFunction>
  > = new Map();
  constructor(
    ...args: (
      | JsonExecutorOperationConstructorType
      | JsonExecutorFunction
      | null
    )[]
  ) {
    this.operations = this.parseOperations(
      ...[JsonExecutorBasicOperationsUtil, JsonExecutorFormatterUtil, ...args],
    );
  }

  public build(
    input: unknown | unknown[],
    rootInp?: JsonExecutorRootNode,
    customDeclarationFunctionsInp?: Map<string, JsonExecutorCallbackNode>,
  ): {
    root: JsonExecutorRootNode;
    error: Error | null;
  } {
    const root = rootInp ? rootInp : JsonExecutorNodeBuilder.root();
    root.clear();
    const ast = JsonExecutorNodeBuilder.parseInput(input);
    let error: Error | null = null;
    if (ast.type === 'operand') {
      error = JsonExecutorNodeBuilder.buildNodes(
        ast,
        this.operations,
        root,
        root,
        customDeclarationFunctionsInp ?? new Map(),
      );
    } else {
      root.addNode(
        new JsonExecutorConstantNode(
          ast.type === 'constant' ? ast.value : null,
        ),
      );
    }
    return { root, error };
  }

  public async test(
    input: unknown | unknown[],
    rootInp?: JsonExecutorRootNode,
    commonVariables?: Map<string, JsonExecutorConstantType | null>,
  ): Promise<JsonExecutorReturnWithErrorType> {
    try {
      const { root, error } = this.build(input, rootInp);
      if (error) {
        return error;
      }
      const result = await root.solve(commonVariables ?? new Map(), new Map());
      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public tree(
    input: unknown | unknown[],
    options?: JsonExecutorNodeTreeOptionsType,
    rootInp?: JsonExecutorRootNode,
    commonVariables?: Map<string, JsonExecutorConstantType | null>,
  ): Promise<JsonExecutorNodeTreeType | Error> {
    return new Promise((res) => {
      try {
        const { root, error } = this.build(input, rootInp);
        if (error) {
          res(error);
        }
        root.tree(
          (nodeTree) => {
            res(nodeTree);
          },
          commonVariables ?? new Map(),
          new Map(),
          options,
        );
      } catch (error) {
        res(error as Error);
      }
    });
  }

  private parseOperations(
    ...args: (
      | JsonExecutorOperationConstructorType
      | JsonExecutorFunction
      | null
    )[]
  ): Map<JsonExecutorOperandCategoryEnum, Map<string, JsonExecutorFunction>> {
    return [
      ...args.filter(
        (item): item is JsonExecutorFunction =>
          item instanceof JsonExecutorFunction,
      ),
      ...args
        .filter(
          (item): item is JsonExecutorOperationConstructorType =>
            item !== null && !(item instanceof JsonExecutorFunction),
        )
        .flatMap((item) =>
          Object.getOwnPropertyNames(item)
            .map((name) => {
              const fn = (item[
                name as keyof JsonExecutorOperationConstructorType
              ] ?? null) as JsonExecutorOperationFunctionType | null;
              return JsonExecutorFunction.parse(fn);
            })
            .filter((item) => item !== null),
        ),
    ].reduce((prev, curr) => {
      const byCategory = prev.has(curr.category)
        ? prev.get(curr.category)!
        : prev.set(curr.category, new Map()).get(curr.category)!;

      if (!byCategory.has(curr.name ?? curr.category)) {
        byCategory.set(curr.name ?? curr.category, curr);
      }
      return prev;
    }, new Map<JsonExecutorOperandCategoryEnum, Map<string, JsonExecutorFunction>>());
  }
}

/**
 * CLASS CONTAINS ADDITIONAL FUNCTION PARAMETERS USED BY PARSER (SEE BUILDER)
 * CAN CREATE FUNCTIONS BY PATTERNS AND WRAPPERS
 */
export class JsonExecutorFunction {
  public static callCustomFunction(cb: JsonExecutorCallbackNode, name: string) {
    return JsonExecutorFunction.build({
      category: JsonExecutorOperandCategoryEnum.command,
      name: name,
      wrapper: JsonExecutorOperandWrapperEnum.accumulator,
      fn: (
        next: JsonExecutorNextFunctionType,
        commonVariables: Map<string, JsonExecutorConstantType | null>,
        localVariables: Map<string, JsonExecutorConstantType | null>,
        nodeResult: JsonExecutorReturnType,
      ) => {
        if (cb.possibleVariableNames.length > 0) {
          if (
            Array.isArray(nodeResult) &&
            nodeResult.length === cb.possibleVariableNames.length
          ) {
            cb.exec(
              next,
              commonVariables,
              localVariables,
              new Map(
                cb.possibleVariableNames.map((name, index) => [
                  name,
                  (nodeResult[index] ??
                    null) as JsonExecutorConstantType | null,
                ]),
              ),
            );
          } else {
            next(
              new Error(
                `Not all function argument values were passed. Arguments: ${cb.possibleVariableNames.map((item) => `"${item}"`).join(', ')}`,
              ),
            );
          }
        } else {
          cb.exec(next, commonVariables, localVariables);
        }
      },
    });
  }

  public static fromAccumulator(input: {
    category: JsonExecutorOperandCategoryEnum;
    name?: string;
    fn: JsonExecutorOperationFunctionAccumulatorType;
  }) {
    const exec: JsonExecutorOperationFunctionType = (
      next,
      commonVariables,
      localVariables,
      ...nodes
    ) => {
      const localNext = (
        nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[],
        acc: unknown[],
        callbacks: JsonExecutorCallbackNode[],
      ) => {
        const [node, ...splitNodes] = nodes;
        if (node) {
          if (node.variant === JsonExecutorNodeVariantEnum.callback) {
            localNext(splitNodes, acc, [
              ...callbacks,
              node as JsonExecutorCallbackNode,
            ]);
          } else {
            node.exec(
              (result) => {
                if (result instanceof Error) {
                  next(result);
                } else {
                  localNext(splitNodes, [...acc, result], callbacks);
                }
              },
              commonVariables,
              localVariables,
            );
          }
        } else {
          input.fn(
            next,
            commonVariables,
            localVariables,
            acc.length === 0
              ? null
              : acc.length === 1
                ? ((acc[0] ?? null) as JsonExecutorReturnType)
                : acc,
            ...callbacks,
          );
        }
      };
      localNext(nodes, [], []);
    };
    return JsonExecutorFunction.build({
      category: input.category,
      name: input.name,
      fn: exec,
    });
  }

  public static fromSimple(input: {
    category: JsonExecutorOperandCategoryEnum;
    name?: string;
    fn: JsonExecutorOperationFunctionSimpleType;
  }) {
    const exec: JsonExecutorOperationFunctionType = (
      next,
      commonVariables,
      localVariables,
      ...nodes
    ) => {
      const localNext = (
        nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[],
        values: JsonExecutorReturnType[],
      ) => {
        const [node, ...splitNodes] = nodes;
        if (node) {
          node.exec(
            (result) => {
              if (result instanceof Error) {
                next(result);
              } else {
                localNext(splitNodes, [...values, result]);
              }
            },
            commonVariables,
            localVariables,
          );
        } else {
          next(input.fn(...values));
        }
      };
      localNext(nodes, []);
    };
    return JsonExecutorFunction.build({
      category: input.category,
      name: input.name,
      fn: exec,
    });
  }

  public static parse(
    fn: JsonExecutorRawFunctionType | null,
  ): JsonExecutorFunction | null {
    if (
      fn &&
      typeof fn === 'function' &&
      fn.prototype &&
      fn.prototype.pattern &&
      typeof fn.prototype.pattern === 'string'
    ) {
      const pattern = fn.prototype.pattern as string;
      const wrapper =
        fn.prototype.wrapper ?? JsonExecutorOperandWrapperEnum.none;
      const parsed = JsonExecutorNodeBuilder.parseString(
        /^\s*\w/.test(pattern) ? `==> ${pattern}` : pattern,
      );
      if (parsed.type === 'operand') {
        return JsonExecutorFunction.build({
          category: parsed.category,
          wrapper,
          name: parsed.name ?? parsed.operand,
          fn,
        });
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public static build(
    input: JsonExecutorFunctionOptions,
  ): JsonExecutorFunction | null {
    return input.wrapper === JsonExecutorOperandWrapperEnum.accumulator
      ? JsonExecutorFunction.fromAccumulator(input)
      : input.wrapper === JsonExecutorOperandWrapperEnum.simple
        ? JsonExecutorFunction.fromSimple(input)
        : new JsonExecutorFunction(
            input.fn,
            input.category,
            input.name ?? input.category,
          );
  }

  constructor(
    public readonly exec: JsonExecutorOperationFunctionType,
    public readonly category: JsonExecutorOperandCategoryEnum,
    public readonly name: string | null = null,
  ) {}
}

/**
 * ABSTRACT CLASS FOR ALL NODES:
 * - CAN EXEC NODE
 * - CONTAINS CHILD NODES, VALUE OF NODE, ETC.
 * - CHECK EXECUTION TIME
 */
export abstract class JsonExecutorNode<
  TVariant extends JsonExecutorNodeVariantEnum,
> {
  private _executionTime: number = 0;
  public readonly nodes: Map<
    number,
    JsonExecutorNode<JsonExecutorNodeVariantEnum>
  > = new Map();
  constructor(
    public readonly variant: TVariant,
    protected readonly operation: JsonExecutorFunction,
    nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[] = [],
  ) {
    this.setNodes(nodes);
  }

  public addNode(node: JsonExecutorNode<JsonExecutorNodeVariantEnum>) {
    this.nodes.set(this.nodes.size, node);
  }

  public setNodes(nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[]) {
    this.clear();
    nodes.forEach((node, index) => {
      this.nodes.set(index, node);
    });
  }

  public get executionTime() {
    return this._executionTime;
  }

  public startTimer() {
    this._executionTime = new Date().valueOf();
  }

  public stopTimer() {
    this._executionTime = new Date().valueOf() - this._executionTime;
  }

  public clear() {
    this._executionTime = 0;
    this.nodes.forEach((node) => node.clear());
    this.nodes.clear();
  }

  public async solve(
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
  ): Promise<JsonExecutorReturnWithErrorType> {
    return new Promise((res) => {
      this.exec(
        (result) => {
          res(result);
        },
        commonVariables,
        localVariables,
      );
    });
  }

  public tree(
    next: JsonExecutorNextTreeFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    options?: JsonExecutorNodeTreeOptionsType,
  ) {
    const localNext = (
      treeResults: JsonExecutorNodeTreeType[],
      nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[],
    ) => {
      const [node, ...splitNodes] = nodes;
      if (node) {
        node.tree(
          (result) => {
            localNext([...treeResults, result], splitNodes);
          },
          commonVariables,
          localVariables,
          options,
        );
      } else {
        this.exec(
          (result) => {
            next(this.specificTree(result, treeResults, options));
          },
          commonVariables,
          localVariables,
        );
      }
    };
    localNext([], [...this.nodes.values()]);
  }

  public abstract exec(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
  ): void;
  protected abstract specificTree(
    value: JsonExecutorReturnWithErrorType,
    nodes: JsonExecutorNodeTreeType[],
    options?: JsonExecutorNodeTreeOptionsType,
  ): JsonExecutorNodeTreeType;
}

/**
 * ROOT NODE:
 * - BASE NODE CREATED BY JSON_EXECUTOR BUILDER
 */
export class JsonExecutorRootNode extends JsonExecutorNode<JsonExecutorNodeVariantEnum.root> {
  constructor() {
    super(
      JsonExecutorNodeVariantEnum.root,
      JsonExecutorFunction.build({
        category: JsonExecutorOperandCategoryEnum.unknown,
        fn: (next, commonVariables, localVariables, node) => {
          node.exec(next, commonVariables, localVariables);
        },
      })!,
      [],
    );
  }

  public get node(): JsonExecutorNode<JsonExecutorNodeVariantEnum> | null {
    return this.nodes.get(0) ?? null;
  }

  public set node(arg: JsonExecutorNode<JsonExecutorNodeVariantEnum> | null) {
    if (arg) {
      this.nodes.set(0, arg);
    }
  }

  public exec(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
  ): void {
    this.startTimer();
    const node = this.node;
    if (node) {
      this.operation.exec(
        (result) => {
          this.stopTimer();
          next(result);
        },
        commonVariables,
        localVariables,
        node,
      );
    } else {
      this.stopTimer();
      next(null);
    }
  }

  protected specificTree(
    value: JsonExecutorReturnWithErrorType,
    nodes: JsonExecutorNodeTreeType[],
    options?: JsonExecutorNodeTreeOptionsType,
  ): JsonExecutorNodeTreeType {
    return {
      node: this.variant,
      value: JsonExecutorNodeBuilder.simplifyValue(value),
      ...(options?.timer === true ? { time: `${this.executionTime} ms` } : {}),
      ...(nodes.length !== 0
        ? {
            nodes,
          }
        : {}),
    };
  }
}

/**
 * CONSTANT NODE:
 * - CONTAINS CONSTANT AS FUNCTION
 */
export class JsonExecutorConstantNode extends JsonExecutorNode<JsonExecutorNodeVariantEnum.constant> {
  constructor(constant: JsonExecutorReturnWithErrorType = null) {
    super(
      JsonExecutorNodeVariantEnum.constant,
      JsonExecutorFunction.build({
        category: JsonExecutorOperandCategoryEnum.unknown,
        fn:
          constant instanceof Error
            ? (next) => next(constant)
            : (next) => {
                next(Util.deepCopy(constant));
              },
      })!,
    );
  }

  public exec(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
  ) {
    this.operation.exec(next, commonVariables, localVariables);
  }

  protected specificTree(
    value: JsonExecutorReturnWithErrorType,
    _nodes: JsonExecutorNodeTreeType[],
    options?: JsonExecutorNodeTreeOptionsType,
  ): JsonExecutorNodeTreeType {
    return {
      node: this.variant,
      value: JsonExecutorNodeBuilder.simplifyValue(value),
      ...(options?.timer === true ? { time: `${this.executionTime} ms` } : {}),
    };
  }
}

/**
 * VARIABLE NODE:
 * - USING AS COMMON OR LOCAL VARIABLE
 * - IF LOCAL: GET VALUE FROM LOCAL VARIABLE MAP WITCH CHANGES VIA CALLBACK
 * - IF COMMON: GET VALUE FROM COMMON VARIABLE MAP
 */
export class JsonExecutorVariableNode<
  TVariant extends
    | JsonExecutorNodeVariantEnum.common_var
    | JsonExecutorNodeVariantEnum.local_var,
> extends JsonExecutorNode<TVariant> {
  constructor(
    variant: TVariant,
    public readonly name: string,
  ) {
    super(
      variant,
      JsonExecutorFunction.build({
        category: JsonExecutorOperandCategoryEnum.unknown,
        fn:
          variant === JsonExecutorNodeVariantEnum.common_var
            ? (next, commonVariables) => {
                next(commonVariables?.get(name) ?? null);
              }
            : (next, _, localVariables) => {
                next(localVariables?.get(name) ?? null);
              },
      })!,
    );
  }

  public exec(
    next: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
  ) {
    this.operation.exec(next, commonVariables, localVariables);
  }

  protected specificTree(
    value: JsonExecutorReturnWithErrorType,
    _nodes: JsonExecutorNodeTreeType[],
    options?: JsonExecutorNodeTreeOptionsType,
  ): JsonExecutorNodeTreeType {
    return {
      node: this.variant,
      name: this.name,
      value: JsonExecutorNodeBuilder.simplifyValue(value),
      ...(options?.timer === true ? { time: `${this.executionTime} ms` } : {}),
    };
  }
}

/**
 * OPERATION NODE:
 * - RUN BASIC OR CUSTOM OPERATION (SEE BUILDER)
 */
export class JsonExecutorOperationNode<
  TVariant extends
    | JsonExecutorNodeVariantEnum.operation
    | JsonExecutorNodeVariantEnum.callback = JsonExecutorNodeVariantEnum.operation,
> extends JsonExecutorNode<TVariant> {
  constructor(
    variant: TVariant,
    operation: JsonExecutorFunction,
    public readonly possibleVariableNames: TVariant extends JsonExecutorNodeVariantEnum.operation
      ? null
      : string[],
    nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[] = [],
  ) {
    super(variant, operation, nodes);
  }

  public exec(
    complete: JsonExecutorNextFunctionType,
    commonVariables: Map<string, JsonExecutorConstantType | null>,
    localVariables: Map<string, JsonExecutorConstantType | null>,
    values?: Map<string, JsonExecutorConstantType | null>,
  ): void {
    try {
      this.startTimer();
      const localVariablesCopy = new Map(localVariables);
      if (this.variant === JsonExecutorNodeVariantEnum.callback) {
        if (values) {
          this.applyValues(localVariablesCopy, values);
        } else {
          this.stopTimer();
          complete(
            new Error('Input values for callback arguments node not founded'),
          );
          return;
        }
      }
      this.operation.exec(
        (result) => {
          this.stopTimer();
          complete(result);
        },
        new Map(commonVariables),
        localVariablesCopy,
        ...[...this.nodes.values()],
      );
    } catch (error) {
      this.stopTimer();
      complete(error as Error);
    }
  }

  protected specificTree(
    value: JsonExecutorReturnWithErrorType,
    nodes: JsonExecutorNodeTreeType[],
    options?: JsonExecutorNodeTreeOptionsType,
  ): JsonExecutorNodeTreeType {
    return {
      node: this.variant,
      category: this.operation.category,
      ...(this.operation.name ? { name: this.operation.name } : {}),
      value: JsonExecutorNodeBuilder.simplifyValue(value),
      ...(options?.timer === true ? { time: `${this.executionTime} ms` } : {}),
      ...(nodes.length !== 0
        ? {
            nodes,
          }
        : {}),
    };
  }

  protected applyValues(
    localVariables: Map<string, JsonExecutorConstantType | null>,
    values: Map<string, JsonExecutorConstantType | null>,
  ) {
    values.forEach((value, key) => {
      if (this.possibleVariableNames?.includes(key)) {
        localVariables.set(key, value);
      }
    });
  }
}

/**
 * CALLBACK NODE:
 * - CONTAINS ONLY ONE CHILD NODE AS RESULT
 * - CAN USING AS CUSTOM FUNCTION DECLARATION
 */
export class JsonExecutorCallbackNode extends JsonExecutorOperationNode<JsonExecutorNodeVariantEnum.callback> {
  constructor(
    possibleVariableNames: string[] = [],
    node?: JsonExecutorNode<JsonExecutorNodeVariantEnum>,
  ) {
    super(
      JsonExecutorNodeVariantEnum.callback,
      JsonExecutorFunction.build({
        category: JsonExecutorOperandCategoryEnum.callback,
        fn: (next, commonVariables, localVariables, node) => {
          node.exec(next, commonVariables, localVariables);
        },
      })!,
      possibleVariableNames,
      node ? [node] : [],
    );
  }
}
