import { Workspace } from "blockly/core";
import { PlannedBlock } from "./block_plan";

export type SourceBlock = PlannedBlock;
export type MutatorBlock = PlannedBlock;

export interface MutatorPlanData {
  toolbox?: string[];
  onMutatorCreate: (this: SourceBlock, mutatorWorkspace: Workspace) => void;
  onMutatorUpdate: (this: SourceBlock, mutatorRoot: MutatorBlock) => void;
  onSourceBlockUpdate?: (this: SourceBlock, mutatorRoot: MutatorBlock) => void;
}

export class MutatorPlan {
  toolbox?: string[];
  onMutatorCreate: (this: SourceBlock, mutatorWorkspace: Workspace) => void;
  onMutatorUpdate: (this: SourceBlock, mutatorRoot: MutatorBlock) => void;
  onSourceBlockUpdate:
    | ((this: SourceBlock, mutatorRoot: MutatorBlock) => void)
    | null;

  constructor(data: MutatorPlanData) {
    this.toolbox = data.toolbox ?? [];
    this.onMutatorCreate = data.onMutatorCreate;
    this.onMutatorUpdate = data.onMutatorUpdate;
    this.onSourceBlockUpdate = data.onSourceBlockUpdate ?? null;
  }
}
