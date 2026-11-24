import { LottDelta } from './lott-delta.class';
// import { LottPlugin } from './lott-plugin.class';
import { EntityManager } from 'typeorm';

export class LottBackEngine {
  constructor(private readonly em: EntityManager) {}

  // public async applyPlugin(plugins: LottPlugin[]) {}

  // public async applyDelta(deltas: LottDelta[]) {}

  // public async rollbackDelta(deltas: LottDelta[]) {}

  public async restoreDelta(): Promise<LottDelta> {
    return new LottDelta();
  }
}
