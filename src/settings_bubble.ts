// Import { Input, inputTypes } from "blockly/core/inputs";
// import { Bubble } from "blockly/core/bubbles";
// import { Coordinate } from "blockly/core/utils/coordinate";
// import { Field } from "blockly/core/field";
// import { Rect } from "blockly/core/utils/rect";
// import { Size } from "blockly/core/utils/size";
// import { Svg } from "blockly/core/utils/Svg";
// import { WorkspaceSvg } from "blockly/core";
// import { createSvgElement } from "blockly/core/utils/dom";
//
// /**
//  * Represents an element that can be displayed in the FieldBubble,
//  * either a Field or a DummyInput (for spacing).
//  */
// type BubbleElement = Field | Input;
//
// /**
//  * A custom Blockly Bubble that displays a list of Fields and DummyInputs.
//  * Fields are rendered sequentially, and DummyInputs are interpreted as newlines.
//  */
// export class FieldBubble extends Bubble {
//   private fieldsAndInputs: BubbleElement[];
//   private contentGroup: SVGGElement;
//
//   /**
//    * @param workspace The workspace this bubble belongs to.
//    * @param anchor The anchor location (e.g., block's coordinate) for the bubble's tail.
//    * @param ownerRect An optional rect that the bubble should avoid overlapping.
//    * @param fieldsAndInputs An array of Field and DummyInput objects.
//    * @param bubbleColour Optional background color for the bubble. Defaults to Blockly's comment bubble color.
//    */
//   constructor(
//     workspace: WorkspaceSvg,
//     anchor: Coordinate,
//     ownerRect: Rect | undefined,
//     fieldsAndInputs: BubbleElement[],
//     bubbleColour?: string,
//   ) {
//     super(workspace, anchor, ownerRect);
//
//     this.fieldsAndInputs = fieldsAndInputs;
//     this.contentGroup = this.contentContainer;
//
//     this.setColour(bubbleColour || "#FFFFDE");
//
//     this.renderFields();
//   }
//
//   /**
//    * Renders the provided fields and dummy inputs into the bubble's content
//    * area, then calculates and sets the bubble's size.
//    */
//   private renderFields(): void {
//     // Clear any previous content.
//     while (this.contentGroup.firstChild) {
//       this.contentGroup.removeChild(this.contentGroup.firstChild);
//     }
//
//     let currentY = Bubble.BORDER_WIDTH + 5; // Start Y with padding from border
//     let maxWidth = 0;
//     const fieldPaddingX = Bubble.BORDER_WIDTH + 5; // Horizontal padding for fields
//     const fieldVerticalSpacing = 8; // Vertical spacing between items
//     const isRtl = this.workspace.RTL;
//
//     // Create a temporary, invisible block to own the fields.
//     // This helps with proper initialization and SVG generation of fields.
//     // This block is NOT added to the workspace's rendered blocks or main flyout.
//     // TODO: If this doesn't work, use a CSS class or style override to hide the
//     //  block.
//     const dummyBlock = this.workspace.newBlock("");
//     dummyBlock.initSvg();
//     dummyBlock.setCollapsed(true);
//
//     for (const item of this.fieldsAndInputs) {
//       if (item instanceof Field) {
//         const field = item as Field;
//
//         // Temporarily attach the field to an input on the dummy block.
//         // This ensures field.initView() is called and SVG is generated.
//         const tempInput = new Input(
//           `_fieldbubble_in_${Math.random().toString(36).substring(7)}`,
//           dummyBlock,
//         );
//         tempInput.appendField(field);
//         // Manually add to inputList; an alternative is to use dummyBlock.appendDummyInput().add(field)
//         // but appendField to a fresh input is cleaner for isolation here.
//         dummyBlock.inputList.push(tempInput);
//         // Force render of dummy block to ensure field SVG is up-to-date (though it's not visible)
//         // dummyBlock.render(); // This might be heavy and not strictly needed if appendField is enough.
//
//         const fieldSvgRoot = field.getSvgRoot();
//
//         if (fieldSvgRoot) {
//           // Clone the field's SVG to avoid issues if the field instance is reused elsewhere
//           // or if the dummy block's disposal affects the original SVG.
//           const clonedFieldSvg = fieldSvgRoot.cloneNode(true) as SVGGElement;
//           this.contentGroup.appendChild(clonedFieldSvg);
//
//           const fieldX = isRtl ? 0 : fieldPaddingX; // Adjust X for RTL later if needed based on field width
//           clonedFieldSvg.setAttribute(
//             "transform",
//             `translate(${fieldX}, ${currentY})`,
//           );
//
//           const fieldSize = field.getSize();
//           currentY += fieldSize.height + fieldVerticalSpacing;
//           if (fieldSize.width + 2 * fieldPaddingX > maxWidth) {
//             maxWidth = fieldSize.width + 2 * fieldPaddingX;
//           }
//
//           // Clean up: remove the temporary input from the dummy block.
//           // This is important to prevent the dummy block from growing indefinitely
//           // and to allow the field to be potentially reused or disposed of cleanly.
//           const inputIndex = dummyBlock.inputList.indexOf(tempInput);
//           if (inputIndex > -1) {
//             dummyBlock.inputList.splice(inputIndex, 1);
//           }
//           // Detach field from the temporary input to break the link
//           // field.setSourceBlock(null); // This can cause issues if field expects a source.
//           // Disposing the dummy block handles field cleanup.
//         } else {
//           console.warn(
//             "FieldBubble: Field SVG root not available after attaching to dummy block:",
//             field,
//           );
//           // Fallback: render simple text
//           this.renderFallbackText(field.getText(), currentY, fieldPaddingX);
//           currentY += 20 + fieldVerticalSpacing; // Approximate height
//         }
//       } else if (item instanceof Input && item.type === inputTypes.DUMMY) {
//         // This is a DummyInput, treat as a newline/spacer
//         currentY += fieldVerticalSpacing / 2; // Add some extra spacing
//       }
//     }
//
//     // Dispose of the dummy block now that we're done using it.
//     // Pass `false` to not heal connections (not applicable here) and `false` to not trigger events.
//     dummyBlock.dispose(false, false);
//
//     const finalWidth = Math.max(maxWidth, Bubble.MIN_SIZE);
//     // Add a little padding at the bottom if there was content
//     const finalHeight = Math.max(
//       currentY +
//         (this.fieldsAndInputs.length > 0 ? 0 : -fieldVerticalSpacing) +
//         Bubble.BORDER_WIDTH,
//       Bubble.MIN_SIZE,
//     );
//
//     // Set the size of the bubble (this will trigger rendering of background and tail)
//     // The `relayout=true` parameter (if available and part of setSize in your Blockly version)
//     // would call positionByRect to find an optimal position.
//     // Based on the provided abstract class, setSize is protected and might not have relayout.
//     // We will call positionByRect explicitly if needed after setting size.
//     super.setSize(new Size(finalWidth, finalHeight));
//     this.positionByRect(this.ownerRect); // Ensure optimal positioning
//   }
//
//   /**
//    * Fallback rendering if a field's SVG cannot be obtained.
//    * Renders simple text.
//    */
//   private renderFallbackText(text: string, y: number, x: number): void {
//     const textElement = createSvgElement(
//       Svg.TEXT,
//       { x: x, y: y + 15, class: "blocklyText" }, // Adjust y for text baseline
//       this.contentGroup,
//     );
//     textElement.textContent = text;
//   }
//
//   /**
//    * Fallback rendering if the dummy block strategy fails entirely.
//    * This is a simplified version and might not render fields correctly.
//    */
//   private renderFieldsWithoutDummyBlock(): void {
//     let currentY = Bubble.BORDER_WIDTH + 5;
//     let maxWidth = 0;
//     const fieldPaddingX = Bubble.BORDER_WIDTH + 5;
//     const fieldVerticalSpacing = 8;
//
//     for (const item of this.fieldsAndInputs) {
//       if (item instanceof Field) {
//         const field = item as Field;
//         // Attempt to initialize and get SVG root directly (less reliable)
//         if (!field.getSvgRoot() && field.initView) field.initView();
//
//         const fieldSvgRoot = field.getSvgRoot();
//         if (fieldSvgRoot) {
//           this.contentGroup.appendChild(
//             fieldSvgRoot.cloneNode(true) as SVGGElement,
//           );
//           (fieldSvgRoot.cloneNode(true) as SVGGElement).setAttribute(
//             "transform",
//             `translate(${fieldPaddingX}, ${currentY})`,
//           );
//           const fieldSize = field.getSize();
//           currentY += fieldSize.height + fieldVerticalSpacing;
//           if (fieldSize.width + 2 * fieldPaddingX > maxWidth) {
//             maxWidth = fieldSize.width + 2 * fieldPaddingX;
//           }
//         } else {
//           this.renderFallbackText(field.getText(), currentY, fieldPaddingX);
//           currentY += 20 + fieldVerticalSpacing;
//         }
//       } else if (item instanceof Input && item.type === inputTypes.DUMMY) {
//         currentY += fieldVerticalSpacing / 2;
//       }
//     }
//     const finalWidth = Math.max(maxWidth, Bubble.MIN_SIZE);
//     const finalHeight = Math.max(
//       currentY + Bubble.BORDER_WIDTH,
//       Bubble.MIN_SIZE,
//     );
//     super.setSize(new Size(finalWidth, finalHeight));
//     this.positionByRect(this.ownerRect);
//   }
//
//   /**
//    * Dispose of this bubble.
//    * Override to include any specific cleanup for this bubble type if needed.
//    */
//   override dispose() {
//     // Any custom cleanup for FieldBubble would go here.
//     // For example, if fields had specific event listeners attached within the bubble context.
//     // Since we are cloning SVG and the dummy block is disposed, major cleanup might not be needed
//     // for the fields themselves unless they were modified in a way that needs reversal.
//     super.dispose();
//   }
// }
