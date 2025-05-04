/*
 * Create document
 * List documents
 * Get document
 * Update document
 * Delete document
 */

const CREATE_DOCUMENT = {
  name: "create_document",
  kind: "expression",
  orientation: "vertical",

  variants: [
    // Create a single document
    {
      name: "create_single_document",
      variants: [],
    },

    // Create multiple documents
    {
      name: "create_multiple_documents",
      variants: [],
    },
  ],
};

const GET_DOCUMENT = {
  name: "get_document",
  kind: "expression",
  orientation: "vertical",

  variants: [
    // Get a single document
    {
      name: "get_single_document",
      outputTypes: ["Document"],
      variants: [],
    },

    // Get multiple documents
    {
      name: "get_multiple_documents",
      outputTypes: ["List[Document]"],
      variants: [],
    },
  ],
};

const UPDATE_DOCUMENT = {
  name: "update_{documentName}",
  kind: "expression",
  orientation: "vertical",

  variants: [
    // Update a single document
    {
      name: "update_single_document",
      variants: [],
    },

    // Update multiple documents
    {
      name: "update_multiple_documents",
      variants: [],
    },
  ],
};

const DELETE_DOCUMENT = {
  name: "delete_{documentName}",
  kind: "expression",
  orientation: "vertical",

  variants: [
    // Delete a single document
    {
      name: "delete_single_document",
      variants: [],
    },

    // Delete multiple documents
    {
      name: "delete_multiple_documents",
      variants: [],
    },
  ],
};

const OPEN_DOCUMENT_APPLICATION = {
  name: "open_{documentName}_application",
  kind: "expression",
  orientation: "vertical",
  message: "",
  inputs: [
    {
      name: "DOCUMENT_ID",
      kind: "value",
      acceptedTypes: ["{documentIdClass}", "string"],
    },
  ],
  outputTypes: [],
};
const X = `
  {{setPrecedence documentClass ASSIGNMENT}}
  {{setPrecedence DOCUMENT_ID   NONE}}
`;
