import * as Blockly from "blockly";
import {
  Block,
  BlockSvg,
  Events,
  IHasBubble,
  renderManagement,
  Scrollbar,
  VerticalFlyout,
  WorkspaceSvg,
} from "blockly";

const ICON_SIZE = 17;

/**
 * A flyout which expands to fill its parent element.
 */
class FillFlyout extends VerticalFlyout {
  override getHeight(): number {
    return this.svgGroup_?.parentElement?.getBoundingClientRect().height ?? 0;
  }

  override getWidth(): number {
    return this.svgGroup_?.parentElement?.getBoundingClientRect().width ?? 0;
  }

  override getX(): number {
    return 0;
  }

  override getY(): number {
    return 0;
  }

  /** Move the flyout to the edge of the workspace. */
  override position() {
    console.log(39);
    this.setBackgroundPath2(this.getWidth(), this.getHeight());
    this.positionAt_(
      this.getWidth(),
      this.getHeight(),
      this.getX(),
      this.getY(),
    );
  }

  private setBackgroundPath2(width: number, height: number) {
    console.log(50);
    // Decide whether to start on the left or right.
    const path: Array<string | number> = [];

    // Start
    path.push("M 0,0");

    // Top
    path.push("h", width);

    // Rounded corner.
    path.push(
      "a",
      this.CORNER_RADIUS,
      this.CORNER_RADIUS,
      0,
      0,
      1,
      this.CORNER_RADIUS,
      this.CORNER_RADIUS,
    );

    // Side closest to workspace.
    path.push("v", Math.max(0, height));

    // Rounded corner.
    path.push(
      "a",
      this.CORNER_RADIUS,
      this.CORNER_RADIUS,
      0,
      0,
      1,
      -this.CORNER_RADIUS,
      this.CORNER_RADIUS,
    );

    // Bottom.
    path.push("h", -width);

    // z position
    path.push("z");

    this.svgBackground_!.setAttribute("d", path.join(" "));
  }

  /** Scroll the flyout to the top. */
  override scrollToStart() {
    console.log(98);
    this.workspace_.scrollbar?.setY(0);
  }

  override isDragTowardWorkspace(
    __currentDragDeltaXY: Blockly.utils.Coordinate,
  ): boolean {
    // dTODO: Try to detect if drag is primarily up or down?
    console.log(104);
    return true;
  }

  override getClientRect(): Blockly.utils.Rect | null {
    console.log(109);
    if (!this.svgGroup_ || this.autoClose || !this.isVisible()) {
      return null;
    }

    // A comment
    const flyoutRect = this.svgGroup_.getBoundingClientRect();
    return new Blockly.utils.Rect(
      flyoutRect.top,
      flyoutRect.bottom,
      flyoutRect.left,
      flyoutRect.right,
    );
  }

  protected override reflowInternal_() {
    console.log(120);
    this.workspace_.scale = this.getFlyoutScale();
    let flyoutWidth = this.getContents().reduce((maxWidthSoFar, item) => {
      return Math.max(
        maxWidthSoFar,
        item.getElement().getBoundingRectangle().getWidth(),
      );
    }, 0);
    flyoutWidth += this.MARGIN * 1.5 + this.tabWidth_;
    flyoutWidth *= this.workspace_.scale;
    flyoutWidth += Scrollbar.scrollbarThickness;

    if (this.getWidth() !== flyoutWidth) {
      if (this.RTL) {
        // With the flyoutWidth known, right-align the flyout contents.
        for (const item of this.getContents()) {
          const oldX = item.getElement().getBoundingRectangle().left;
          const newX =
            flyoutWidth / this.workspace_.scale -
            item.getElement().getBoundingRectangle().getWidth() -
            this.MARGIN -
            this.tabWidth_;
          item.getElement().moveBy(newX - oldX, 0);
        }
      }

      // TODO(#7689): Remove this.
      // Workspace with no scrollbars where this is permanently
      // open on the left.
      // If scrollbars exist they properly update the metrics.
      if (
        !this.targetWorkspace.scrollbar &&
        !this.autoClose &&
        this.targetWorkspace.getFlyout() === this &&
        this.toolboxPosition_ === Blockly.utils.toolbox.Position.LEFT
      ) {
        this.targetWorkspace.translate(
          this.targetWorkspace.scrollX + flyoutWidth,
          this.targetWorkspace.scrollY,
        );
      }

      this.width_ = flyoutWidth;
      this.position();
      this.targetWorkspace.resizeContents();
      this.targetWorkspace.recordDragTargets();
    }
  }
}

export class FlyoutBubble extends Blockly.bubbles.Bubble {
  flyout: VerticalFlyout;
  svgDialog: SVGSVGElement;
  flyoutSvg: SVGElement;

  constructor(
    flyoutDef: Blockly.utils.toolbox.FlyoutDefinition,
    workspace: WorkspaceSvg,
    anchor: Blockly.utils.Coordinate,
    ownerRect: Blockly.utils.Rect,
  ) {
    super(workspace, anchor, ownerRect);
    this.svgDialog = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.SVG,
      {
        x: Blockly.bubbles.Bubble.BORDER_WIDTH,
        y: Blockly.bubbles.Bubble.BORDER_WIDTH,
        width: 100,
        height: 100,
      },
      this.contentContainer,
    );

    const background = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {
        class: "blocklyWorkspace",
      },
      this.svgDialog,
    );

    this.flyout = new FillFlyout(workspace.copyOptionsForFlyout());
    this.flyout.autoClose = false;

    // Create the flyout's SVG before passing it to the bubble constructor.
    this.flyoutSvg = this.flyout.createDom(Blockly.utils.Svg.G);
    background.appendChild(this.flyoutSvg);

    // Initialize the flyout and link it to the main workspace.
    this.flyout.init(workspace);
    this.flyout.show(flyoutDef);

    // The bubble will automatically size itself to the flyout's SVG.
    // We need to trigger a resize after the flyout has been populated.
    this.layoutContent_();
  }

  /**
   * Lays out the flyout and sizes the bubble to fit.
   */
  protected layoutContent_(): void {
    this.flyout.position();
    this.flyout.reflow();

    const flyoutWidth = 100;
    const flyoutHeight = 100;

    // Add a bit of padding to the bubble.
    const padding = 10;
    this.setSize(
      new Blockly.utils.Size(flyoutWidth + padding, flyoutHeight + padding),
    );
  }

  /**
   * Disposes of this bubble.
   */
  dispose() {
    this.flyout.dispose();
    super.dispose();
  }
}

//
export class FlyoutIcon extends Blockly.icons.Icon implements IHasBubble {
  static TYPE = Blockly.icons.IconType.MUTATOR;

  flyoutBubble: FlyoutBubble | null;
  flyoutDef: Blockly.utils.toolbox.FlyoutDefinition;

  constructor(
    flyoutDef: Blockly.utils.toolbox.FlyoutDefinition,
    sourceBlock: Block,
  ) {
    super(sourceBlock as BlockSvg);
    this.flyoutBubble = null;
    this.flyoutDef = flyoutDef;
  }

  override getType(): Blockly.icons.IconType<Blockly.icons.MutatorIcon> {
    return Blockly.icons.MutatorIcon.TYPE;
  }

  override initView(pointerdownListener: (e: PointerEvent) => void): void {
    if (this.svgRoot) return; // Already initialized.

    super.initView(pointerdownListener);

    // Square with rounded corners.
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        class: "blocklyIconShape",
        rx: "4",
        ry: "4",
        height: "16",
        width: "16",
      },
      this.svgRoot,
    );

    // Gear teeth.
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.PATH,
      {
        class: "blocklyIconSymbol",
        d:
          "m4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41," +
          "0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3," +
          "-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9," +
          "-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11," +
          "-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 " +
          "-0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187," +
          "0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z",
      },
      this.svgRoot,
    );

    // Axle hole.
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.CIRCLE,
      { class: "blocklyIconShape", r: "2.7", cx: "8", cy: "8" },
      this.svgRoot,
    );

    Blockly.utils.dom.addClass(this.svgRoot!, "blocklyMutatorIcon");
  }

  override dispose(): void {
    super.dispose();
    this.flyoutBubble?.dispose();
  }

  override getWeight(): number {
    return Blockly.icons.MutatorIcon.WEIGHT;
  }

  override getSize(): Blockly.utils.Size {
    return new Blockly.utils.Size(ICON_SIZE, ICON_SIZE);
  }

  override applyColour(): void {
    super.applyColour();
    this.flyoutBubble?.setColour(this.sourceBlock.getColour());
  }

  override updateCollapsed(): void {
    super.updateCollapsed();
    if (this.sourceBlock.isCollapsed()) this.setBubbleVisible(false);
  }

  override onLocationChange(blockOrigin: Blockly.utils.Coordinate): void {
    super.onLocationChange(blockOrigin);
    this.flyoutBubble?.setAnchorLocation(this.getAnchorLocation());
  }

  override onClick(): void {
    super.onClick();
    if (this.sourceBlock.isEditable()) {
      this.setBubbleVisible(!this.bubbleIsVisible());
    }
  }

  override isClickableInFlyout(): boolean {
    return false;
  }

  bubbleIsVisible(): boolean {
    return !!this.flyoutBubble;
  }

  async setBubbleVisible(visible: boolean): Promise<void> {
    if (this.bubbleIsVisible() === visible) return;

    await renderManagement.finishQueuedRenders();

    if (visible) {
      this.flyoutBubble = new FlyoutBubble(
        this.flyoutDef ?? ([] as Blockly.utils.toolbox.FlyoutDefinition),
        this.sourceBlock.workspace as WorkspaceSvg,
        this.getAnchorLocation(),
        this.getBubbleOwnerRect(),
      );
      this.applyColour();
    } else {
      this.flyoutBubble?.dispose();
      this.flyoutBubble = null;
    }

    Events.fire(
      new (Events.get(Events.BUBBLE_OPEN))(
        this.sourceBlock,
        visible,
        "mutator",
      ),
    );
  }

  /** See IHasBubble.getBubble. */
  getBubble(): FlyoutBubble | null {
    return this.flyoutBubble;
  }

  /**
   * @returns the location the bubble should be anchored to.
   *     I.E. the middle of this icon.
   */
  private getAnchorLocation(): Blockly.utils.Coordinate {
    const midIcon = ICON_SIZE / 2;
    return Blockly.utils.Coordinate.sum(
      this.workspaceLocation,
      new Blockly.utils.Coordinate(midIcon, midIcon),
    );
  }

  /**
   * @returns the rect the bubble should avoid overlapping.
   *     I.E. the block that owns this icon.
   */
  private getBubbleOwnerRect(): Blockly.utils.Rect {
    const bbox = (this.sourceBlock as BlockSvg).getSvgRoot().getBBox();
    return new Blockly.utils.Rect(
      bbox.y,
      bbox.y + bbox.height,
      bbox.x,
      bbox.x + bbox.width,
    );
  }
}
