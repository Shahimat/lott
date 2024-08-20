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
export type JsonExecutorOperationConstructorType = new (...args: any[]) => void;
/* eslint-enable */

export type JsonExecutorConstantType =
  | number
  | string
  | boolean
  | Record<string, unknown>
  | Array<unknown>;

export type JsonExecutorConstantExtendedType =
  | JsonExecutorConstantType
  | Set<unknown>;

export type JsonExecutorReturnType = JsonExecutorConstantExtendedType | null;
export type JsonExecutorReturnWithErrorType = JsonExecutorReturnType | Error;

export type JsonExecutorAbstractSyntaxTreeType =
  | {
      type: 'operand';
      category: JsonExecutorOperandCategoryEnum;
      operand: string;
      group: string | null;
      name: string;
      additions: string[] | null;
      args: JsonExecutorAbstractSyntaxTreeType[];
    }
  | { type: 'local_var' | 'common_var'; name: string }
  | {
      type: 'constant';
      value: JsonExecutorConstantType | null;
    };

export type JsonExecutorFunctionWrapperOptions =
  | {
      wrapper?: JsonExecutorOperandWrapperEnum.none;
      fn: JsonExecutorOperationFunctionType;
    }
  | {
      wrapper: JsonExecutorOperandWrapperEnum.simple;
      fn: JsonExecutorOperationFunctionSimpleType;
    }
  | {
      wrapper: JsonExecutorOperandWrapperEnum.complex;
      fn: JsonExecutorOperationFunctionComplexType;
    }
  | {
      wrapper: JsonExecutorOperandWrapperEnum.accumulator;
      fn: JsonExecutorOperationFunctionAccumulatorType;
    };

export type JsonExecutorFunctionOptions = {
  category?: JsonExecutorOperandCategoryEnum;
  group?: string;
  name: string;
} & JsonExecutorFunctionWrapperOptions;

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

export type JsonExecutorOperationFunctionComplexType = (
  next: JsonExecutorNextFunctionType,
  ...nodeResults: JsonExecutorReturnType[]
) => void;

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
  value: JsonExecutorConstantType | null;
  time?: string;
};

export type JsonExecutorNextTreeFunctionType = (
  result: JsonExecutorNodeTreeType,
) => void;
