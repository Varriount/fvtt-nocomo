import { javascriptGenerator, JavascriptGenerator } from "blockly/javascript";

import { FlyoutIcon } from "../../icons/flyout";
import { toolbox } from "../../toolbox";
import { Block, Blocks } from "blockly/core";

Blocks["flyout_host_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Show Flyout:");
    this.addIcon(
      new FlyoutIcon(
        [
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_number",
          },
        ],
        this,
      ),
    );
    this.setColour(230);
  },
};

toolbox.contents.push({
  kind: "category",
  name: "Other",
  categorystyle: "other_category",
  contents: [
    {
      kind: "block",
      type: "flyout_host_block",
    },
  ],
});

javascriptGenerator.forBlock["flyout_host_block"] = function (
  __block: Block,
  __generator: JavascriptGenerator,
) {
  return "";
};
