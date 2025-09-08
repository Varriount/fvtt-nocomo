import { Workspace } from "blockly/core";
import { PlannedBlock } from "./block_plan";

type SourceBlock = PlannedBlock;
type MutatorBlock = PlannedBlock;

export interface MutatorPlanData {
  toolbox?: string[];
  onMutatorCreate: (this: MutatorBlock, workspace: Workspace) => void;
  onMutatorUpdate: (this: MutatorBlock, workspace: Workspace) => void;
  onSourceBlockUpdate?: (this: SourceBlock, workspace: Workspace) => void;
}

export class MutatorPlan {
  toolbox?: string[];
  onMutatorCreate: (this: MutatorBlock, workspace: Workspace) => void;
  onMutatorUpdate: (this: MutatorBlock, workspace: Workspace) => void;
  onSourceBlockUpdate:
    | ((this: SourceBlock, workspace: Workspace) => void)
    | null;

  constructor(data: MutatorPlanData) {
    this.toolbox = data.toolbox ?? [];
    this.onMutatorCreate = data.onMutatorCreate;
    this.onMutatorUpdate = data.onMutatorUpdate;
    this.onSourceBlockUpdate = data.onSourceBlockUpdate ?? null;
  }
}
