import { FixedEdgesMetricsManager } from "@blockly/fixed-edges";
import { Modal } from "@blockly/plugin-modal";
import {
  ScrollBlockDragger,
  ScrollOptions,
} from "@blockly/plugin-scroll-options";
import { WorkspaceSearch } from "@blockly/plugin-workspace-search";
import { shadowBlockConversionChangeListener } from "@blockly/shadow-block-converter";
import { ContentHighlight } from "@blockly/workspace-content-highlight";
// import { Multiselect } from "@mit-app-inventor/blockly-plugin-workspace-multiselect";
import * as Blockly from "blockly/core";
import { toolbox } from "./toolbox";
import { CachedFixedEdgesMetricsManager } from "./utils";

// Options for the FixedEdges extension.
const FIXED_EDGES_CONFIG = {
  top: true,
  left: true,
};

// Options for the ScrollOptions extension.
const SCROLL_OPTIONS_CONFIGURATION = {
  enableWheelScroll: true,
  enableEdgeScroll: true,
};

// Options for the MultiSelect extension.
// const MULTISELECT_CONFIGURATION = {
//   multiFieldUpdate: true,
//   workspaceAutoFocus: true,
//   multiselectIcon: {
//     hideIcon: true,
//   },
// };

// Storage key used to save data in local storage.
const STORAGE_KEY = "nocomo";

// Configuration to use when initializing the Blockly workspace.
const BLOCKLY_CONFIGURATION: Blockly.BlocklyOptions = {
  toolbox: toolbox,

  collapse: true,
  comments: true,
  css: true,
  disable: true,

  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  },

  horizontalLayout: false,
  maxBlocks: Infinity,
  // MaxInstances: Infinity,
  // Media: "",

  move: {
    scrollbars: {
      horizontal: true,
      vertical: true,
    },
    drag: true,
    wheel: false,
  },

  oneBasedIndex: true,
  readOnly: false,
  renderer: "thrasos",
  rtl: false,
  scrollbars: true,
  sounds: true,
  theme: "classic",
  toolboxPosition: "start",
  trashcan: true,
  maxTrashcanContents: 32,

  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.05,
    pinch: true,
  },

  plugins: {
    blockDragger: ScrollBlockDragger,
    // ConnectionChecker: undefined,
    // ConnectionPreviewer: undefined,
    // FlyoutsVerticalToolbox: undefined,
    // FlyoutsHorizontalToolbox: undefined,
    metricsManager: CachedFixedEdgesMetricsManager,
    // Renderer: undefined,
    // Toolbox: undefined,
  },
};

/**
 * Creates and configures a Blockly workspace.
 *
 * @param container
 *   The HTML element or a string representing the id of an element where
 *   the Blockly workspace will be injected.
 *
 * @return
 *   The initialized Blockly workspace instance.
 */
export function createBlocklyWorkspace(container: Element | string) {
  // Create the workspace.
  const workspace = Blockly.inject(container, BLOCKLY_CONFIGURATION);

  // Allow searching through the workspace.
  new WorkspaceSearch(workspace).init();

  // Highlight the workspace area that contains content.
  new ContentHighlight(workspace).init();

  // Automatically scroll when a block is dragged near the canvas edge.
  new ScrollOptions(workspace).init(SCROLL_OPTIONS_CONFIGURATION);

  // Allow creating modal popups.
  new Modal(workspace).init();

  // Allows selecting multiple blocks at once.
  // TODO: Fix this plugin
  // new Multiselect(workspace).init(MULTISELECT_CONFIGURATION);

  // Prevent scrolling beyond configured canvas edges.
  FixedEdgesMetricsManager.setFixedEdges(FIXED_EDGES_CONFIG);

  // Automatically disable orphaned blocks.
  // New DisableTopBlocks(workspace).init();

  // Automatically convert shadow blocks to real blocks once they are modified.
  workspace.addChangeListener(shadowBlockConversionChangeListener);

  return workspace;
}

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export function save(workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to restore into.
 */
export function restore(workspace: Blockly.Workspace) {
  const data = window.localStorage?.getItem(STORAGE_KEY);

  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
  Blockly.Events.enable();
}
