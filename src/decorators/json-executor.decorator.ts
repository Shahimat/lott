import { isNil } from 'lodash';
import { JsonExecutorOperationConstructorType } from 'src/types/json-executor.type';

export function define(options: {
  pattern: string;
  wrapper?: 'none' | 'simple' | 'accumulator';
}) {
  return function (
    target: JsonExecutorOperationConstructorType,
    context: string,
  ) {
    const opt = {
      pattern: options.pattern,
      ...(isNil(options.wrapper) ? {} : { wrapper: options.wrapper }),
    };
    const original = target[
      context as keyof JsonExecutorOperationConstructorType
    ] as JsonExecutorOperationConstructorType | undefined;
    if (original) {
      original.prototype = opt;
    } else {
      throw new Error(
        `static method by name "${context}" not founded. Pattern = "${opt.pattern}"`,
      );
    }
  };
}
