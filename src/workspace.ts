/**
 * Normalizes the logic that various extensions and plugins use.
 */
import * as Blockly from "blockly";
import { BlocklyOptions } from "blockly";
import { toolbox } from "./toolbox";
import {
  ScrollBlockDragger,
  ScrollOptions,
} from "@blockly/plugin-scroll-options";
import { FixedEdgesMetricsManager } from "@blockly/fixed-edges";
import { Multiselect } from "@mit-app-inventor/blockly-plugin-workspace-multiselect";
import { WorkspaceSearch } from "@blockly/plugin-workspace-search";
import { ContentHighlight } from "@blockly/workspace-content-highlight";
import { Modal } from "@blockly/plugin-modal";
import { CachedFixedEdgesMetricsManager } from "./utils";
import { shadowBlockConversionChangeListener } from "@blockly/shadow-block-converter";

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
const MULTI_SELECT_CONFIGURATION = {
  multiFieldUpdate: true,

  workspaceAutoFocus: true,

  multiselectIcon: {
    hideIcon: true,
  },
};

const STORAGE_KEY = "mainWorkspace";

const BLOCKLY_CONFIGURATION: BlocklyOptions = {
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
  // maxInstances: Infinity,
  // media: "",

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
    // connectionChecker: undefined,
    // connectionPreviewer: undefined,
    // flyoutsVerticalToolbox: undefined,
    // flyoutsHorizontalToolbox: undefined,
    metricsManager: CachedFixedEdgesMetricsManager,
    // renderer: undefined,
    // toolbox: undefined,
  },
};

export function create(container: Element | string) {
  // Create the workspace. //
  const workspace = Blockly.inject(container, BLOCKLY_CONFIGURATION);

  // Initialize "standard" extensions. //
  // eslint-disable-next-line
  function initStandardExtension(extensionClass: any, config?: any) {
    const extension = new extensionClass(workspace);
    extension.init(config);
    return extension;
  }

  // Allow searching through the workspace.
  initStandardExtension(WorkspaceSearch);

  // Highlight the workspace area that contains content.
  initStandardExtension(ContentHighlight);

  // Automatically scroll when a block is dragged near the canvas edge.
  initStandardExtension(ScrollOptions, SCROLL_OPTIONS_CONFIGURATION);

  // Allow creating modal popups.
  initStandardExtension(Modal);

  // Allows selecting multiple blocks at once.
  initStandardExtension(Multiselect, MULTI_SELECT_CONFIGURATION);

  // Prevent scrolling beyond configured canvas edges.
  FixedEdgesMetricsManager.setFixedEdges(FIXED_EDGES_CONFIG);

  // Automatically disable orphaned blocks.
  // workspace.addChangeListener(Blockly.Events.disableOrphans);
  // initStandardExtension(DisableTopBlocks);

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
