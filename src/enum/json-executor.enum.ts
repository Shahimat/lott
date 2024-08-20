export enum JsonExecutorNodeVariantEnum {
  root = 'root',
  constant = 'constant',
  local_var = 'local_var',
  common_var = 'common_var',
  operation = 'operation',
  callback = 'callback',
}

export enum JsonExecutorOperandCategoryEnum {
  unknown = 'unknown',
  exec = 'exec', // ==>
  command = 'command', // ==> (name)
  formatter = 'formatter', // ::(name?)
  callback = 'callback', // /=>
  custom = 'custom', // /=> (name)
  condition = 'condition', // ==?|==??|==?> (name?)
}

export enum JsonExecutorOperandWrapperEnum {
  none = 'none',
  simple = 'simple',
  complex = 'complex',
  accumulator = 'accumulator',
}
