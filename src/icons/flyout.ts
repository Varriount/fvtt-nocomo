import * as Blockly from "blockly";
import {
  Block,
  BlockSvg,
  browserEvents,
  Events,
  Flyout,
  FlyoutItem,
  IHasBubble,
  renderManagement,
  WorkspaceSvg,
} from "blockly";

const ICON_SIZE = 17;

/**
 * A flyout which expands to fill its parent element.
 */
export class FillFlyout extends Flyout {
  static registryName = "fillFlyout";
  bubbleWidth: number;
  bubbleHeight: number;

  constructor(options: Blockly.Options, width: number, height: number) {
    super(options);
    this.bubbleWidth = width;
    this.bubbleHeight = height;
    this.width_ = width;
    this.height_ = height;
  }

  protected override setMetrics_(xyRatio: { x: number; y: number }) {
    if (!this.isVisible()) {
      return;
    }
    const metricsManager = this.workspace_.getMetricsManager();
    const scrollMetrics = metricsManager.getScrollMetrics();
    const viewMetrics = metricsManager.getViewMetrics();
    const absoluteMetrics = metricsManager.getAbsoluteMetrics();

    if (typeof xyRatio.y === "number") {
      this.workspace_.scrollY = -(
        scrollMetrics.top +
        (scrollMetrics.height - viewMetrics.height) * xyRatio.y
      );
    }
    this.workspace_.translate(
      this.workspace_.scrollX + absoluteMetrics.left,
      this.workspace_.scrollY + absoluteMetrics.top,
    );
  }

  override getX(): number {
    return 0;
  }

  override getY(): number {
    // Y is always 0 since this is a vertical flyout.
    return 0;
  }

  override position() {
    if (!this.isVisible() || !this.targetWorkspace!.isVisible()) {
      return;
    }

    this.setBackgroundPath2(this.getWidth(), this.getHeight());
    this.positionAt_(
      this.getWidth(),
      this.getHeight(),
      this.getX(),
      this.getY(),
    );
  }

  private setBackgroundPath2(width: number, height: number) {
    // Decide whether to start on the left or right.
    const path: Array<string | number> = [];

    // Start
    path.push("M 0,0");

    // Top edge
    path.push("h", width - this.CORNER_RADIUS);

    // Top right rounded corner
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

    // Right edge
    path.push("v", Math.max(0, height - this.CORNER_RADIUS * 2));

    // Bottom right rounded corner
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

    // Bottom edge
    path.push("h", -width);

    // z position
    path.push("z");

    this.svgBackground_!.setAttribute("d", path.join(" "));
  }

  override scrollToStart() {
    this.workspace_.scrollbar?.setY(0);
  }

  protected override wheel_(e: WheelEvent) {
    const scrollDelta = browserEvents.getScrollDeltaPixels(e);

    if (scrollDelta.y) {
      const metricsManager = this.workspace_.getMetricsManager();
      const scrollMetrics = metricsManager.getScrollMetrics();
      const viewMetrics = metricsManager.getViewMetrics();
      const pos = viewMetrics.top - scrollMetrics.top + scrollDelta.y;

      this.workspace_.scrollbar?.setY(pos);
      // When the flyout moves from a wheel event, hide WidgetDiv and
      // dropDownDiv.
      // WidgetDiv.hideIfOwnerIsInWorkspace(this.workspace_);
      // Blockly.dropDownDiv.hideWithoutAnimation();
    }
    // Don't scroll the page.
    e.preventDefault();
    // Don't propagate mousewheel event (zooming).
    e.stopPropagation();
  }

  protected override layout_(contents: FlyoutItem[]) {
    this.workspace_.scale = this.targetWorkspace!.scale;
    const margin = this.MARGIN;
    const cursorX = this.RTL ? margin : margin + this.tabWidth_;
    let cursorY = margin;

    for (const item of contents) {
      item.getElement().moveBy(cursorX, cursorY);
      cursorY += item.getElement().getBoundingRectangle().getHeight();
    }
  }

  override isDragTowardWorkspace(
    __currentDragDeltaXY: Blockly.utils.Coordinate,
  ): boolean {
    return false;
  }

  override getClientRect(): Blockly.utils.Rect | null {
    if (!this.svgGroup_ || this.autoClose || !this.isVisible()) {
      // The bounding rectangle won't compute correctly if the flyout is closed
      // and auto-close flyouts aren't valid drag targets (or delete areas).
      return null;
    }

    const flyoutRect = this.svgGroup_.getBoundingClientRect();
    return new Blockly.utils.Rect(
      flyoutRect.top,
      flyoutRect.bottom,
      flyoutRect.left,
      flyoutRect.right,
    );
  }

  protected override reflowInternal_() {
    this.workspace_.scale = this.getFlyoutScale();

    if (this.getWidth() !== this.bubbleWidth) {
      if (this.RTL) {
        // With the flyoutWidth known, right-align the flyout contents.
        for (const item of this.getContents()) {
          const oldX = item.getElement().getBoundingRectangle().left;
          const newX =
            this.bubbleWidth / this.workspace_.scale -
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
          this.targetWorkspace.scrollX + this.bubbleWidth,
          this.targetWorkspace.scrollY,
        );
      }

      this.width_ = this.bubbleWidth;
      this.height_ = this.bubbleHeight;
      this.position();
      this.targetWorkspace.resizeContents();
      this.targetWorkspace.recordDragTargets();
    }
  }
}

export class FlyoutBubble extends Blockly.bubbles.Bubble {
  flyout: FillFlyout;
  svgDialog: SVGSVGElement;
  flyoutSvg: SVGElement;

  private static readonly BUBBLE_WIDTH = 250;
  private static readonly BUBBLE_HEIGHT = 300;

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

    this.flyout = new FillFlyout(
      workspace.copyOptionsForFlyout(),
      FlyoutBubble.BUBBLE_WIDTH,
      FlyoutBubble.BUBBLE_HEIGHT,
    );
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

    // Add a bit of padding to the bubble.
    const padding = 10;
    this.setSize(
      new Blockly.utils.Size(
        FlyoutBubble.BUBBLE_WIDTH + padding,
        FlyoutBubble.BUBBLE_HEIGHT + padding,
      ),
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
   * I.E. the middle of this icon.
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
   * I.E. the block that owns this icon.
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
