import { BlockPlanData, BlockPlanStep } from "../block_plan";
import { Block } from "blockly";

export class SetColourStep extends BlockPlanStep {
  private readonly colour: number;

  constructor(data: BlockPlanData) {
    super(data);
    this.colour = data.colour ?? 255;
  }

  initializeBlock(block: Block): void {
    block.setColour(this.colour);
  }
}
