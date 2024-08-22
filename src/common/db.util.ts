import { isNil } from 'lodash';
import {
  JsonExecutorFunction,
  JsonExecutorNodeBuilder,
} from 'src/classes/json-executor.class';
import { JsonExecutorOperandWrapperEnum } from 'src/enum/json-executor.enum';
import {
  type JsonExecutorNextFunctionType,
  JsonExecutorReturnType,
} from 'src/types/json-executor.type';
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

export class DbUtil {
  public readonly functions: JsonExecutorFunction[];
  constructor(private readonly em: EntityManager) {
    this.functions = [
      JsonExecutorNodeBuilder.define({
        pattern: 'orm.find',
        wrapper: JsonExecutorOperandWrapperEnum.complex,
        fn: this.find.bind(this),
      }),
      JsonExecutorNodeBuilder.define({
        pattern: 'orm.findOne',
        wrapper: JsonExecutorOperandWrapperEnum.complex,
        fn: this.findOne.bind(this),
      }),
      JsonExecutorNodeBuilder.define({
        pattern: 'orm.create',
        wrapper: JsonExecutorOperandWrapperEnum.simple,
        fn: this.create.bind(this),
      }),
      JsonExecutorNodeBuilder.define({
        pattern: 'orm.save',
        wrapper: JsonExecutorOperandWrapperEnum.complex,
        fn: this.save.bind(this),
      }),
    ].filter((item) => item !== null);
  }

  private find(
    next: JsonExecutorNextFunctionType,
    entityName: JsonExecutorReturnType,
    options: JsonExecutorReturnType,
  ): void {
    if (
      isNil(entityName) ||
      Array.isArray(entityName) ||
      entityName instanceof Set
    ) {
      next(new Error(`Expected entityName but found "${entityName}"`));
      return;
    } else if (
      isNil(options) ||
      (typeof options === 'object' &&
        !Array.isArray(options) &&
        !(options instanceof Set))
    ) {
      this.em
        .find(
          typeof entityName === 'object'
            ? (entityName as EntityTarget<ObjectLiteral>)
            : `${entityName}`,
          options ?? undefined,
        )
        .then(next)
        .catch(next);
      return;
    } else {
      next(new Error(`Expected find options as object but found "${options}"`));
      return;
    }
  }

  private findOne(
    next: JsonExecutorNextFunctionType,
    entityName: JsonExecutorReturnType,
    options: JsonExecutorReturnType,
  ): void {
    if (typeof entityName !== 'string') {
      next(
        new Error(`Expected entityName as string but found "${entityName}"`),
      );
      return;
    } else if (
      !isNil(options) &&
      typeof options === 'object' &&
      !Array.isArray(options) &&
      !(options instanceof Set)
    ) {
      this.em.findOne(entityName, options).then(next).catch(next);
      return;
    } else {
      next(new Error(`Expected find options as object but found "${options}"`));
      return;
    }
  }

  private create(
    entityClass: JsonExecutorReturnType,
    plainObject: JsonExecutorReturnType,
  ): JsonExecutorReturnType {
    return this.em.create(
      entityClass as EntityTarget<unknown>,
      plainObject,
    ) as JsonExecutorReturnType;
  }

  private save(
    next: JsonExecutorNextFunctionType,
    ...entities: JsonExecutorReturnType[]
  ): void {
    this.em.save(entities).then(next).catch(next);
  }
}
