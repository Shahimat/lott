import {
  JsonExecutorCallbackNode,
  JsonExecutorNode,
} from 'src/classes/json-executor.class';
import {
  JsonExecutorNodeVariantEnum,
  JsonExecutorOperandCategoryEnum,
  JsonExecutorOperandWrapperEnum,
} from 'src/enum/json-executor.enum';

/* eslint-disable */
export type JsonExecutorRawFunctionType = (...nodes: any[]) => any | void;
/* eslint-enable */
export type JsonExecutorOperationConstructorType = new () => void;

export type JsonExecutorConstantType =
  | number
  | string
  | boolean
  | Record<string, unknown>
  | Array<unknown>;

export type JsonExecutorReturnType = JsonExecutorConstantType | null;
export type JsonExecutorReturnWithErrorType = JsonExecutorReturnType | Error;

export type JsonExecutorAbstractSyntaxTreeType =
  | {
      type: 'operand';
      category: JsonExecutorOperandCategoryEnum;
      operand: string;
      name: string | null;
      additions: string[] | null;
      args: JsonExecutorAbstractSyntaxTreeType[];
    }
  | { type: 'local_var' | 'common_var'; name: string }
  | {
      type: 'constant';
      value: JsonExecutorConstantType | null;
    };

export type JsonExecutorFunctionOptions = {
  category: JsonExecutorOperandCategoryEnum;
  name?: string;
} & (
  | {
      wrapper?: JsonExecutorOperandWrapperEnum.none;
      fn: JsonExecutorOperationFunctionType;
    }
  | {
      wrapper: JsonExecutorOperandWrapperEnum.simple;
      fn: JsonExecutorOperationFunctionSimpleType;
    }
  | {
      wrapper: JsonExecutorOperandWrapperEnum.accumulator;
      fn: JsonExecutorOperationFunctionAccumulatorType;
    }
);

export type JsonExecutorNextFunctionType = (
  result: JsonExecutorReturnWithErrorType,
) => void;

export type JsonExecutorOperationFunctionType = (
  next: JsonExecutorNextFunctionType,
  commonVariables: Map<string, JsonExecutorConstantType | null>,
  localVariables: Map<string, JsonExecutorConstantType | null>,
  ...nodes: JsonExecutorNode<JsonExecutorNodeVariantEnum>[]
) => void;

export type JsonExecutorOperationFunctionSimpleType = (
  ...nodeResults: JsonExecutorReturnType[]
) => JsonExecutorReturnWithErrorType;

export type JsonExecutorOperationFunctionAccumulatorType = (
  next: JsonExecutorNextFunctionType,
  commonVariables: Map<string, JsonExecutorConstantType | null>,
  localVariables: Map<string, JsonExecutorConstantType | null>,
  nodeResult: JsonExecutorReturnType,
  ...nodes: JsonExecutorCallbackNode[]
) => void;

export type JsonExecutorNodeTreeOptionsType = {
  timer?: boolean;
};

export type JsonExecutorNodeTreeType = {
  node: JsonExecutorNodeVariantEnum;
  name?: string;
  category?: JsonExecutorOperandCategoryEnum;
  nodes?: JsonExecutorNodeTreeType[];
  value: JsonExecutorConstantType | Error | null;
  time?: string;
};

export type JsonExecutorNextTreeFunctionType = (
  result: JsonExecutorNodeTreeType,
) => void;
