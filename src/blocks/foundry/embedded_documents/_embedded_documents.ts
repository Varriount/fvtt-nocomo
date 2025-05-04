/*
 * Create embedded document
 * List embedded documents
 * Get embedded document
 * Update embedded document
 * Delete embedded document
 */
/*
 * Create document
 * List documents
 * Get document
 * Update document
 * Delete document
 */

const CREATE_EMBEDDED_DOCUMENT = {
  name: "create_document",
  inputs: [
    {
      name: "PARENT",
      acceptedTypes: ["{parentDocumentClass}"],
    },
    {
      name: "DATA",
      acceptedTypes: ["object"],
    },
  ],
  output_types: ["{documentClass}"],
  generator: "{documentClass}.create({DATA})",
};

const LIST_EMBEDDED_DOCUMENTS = {
  name: "list_documents",
  inputs: [
    {
      name: "PARENT",
      acceptedTypes: ["{parentDocumentClass}"],
    },
  ],
  output_types: ["Iterable[{documentClass}]"],
  generator: "game.{documentCollection}",
};

const GET_EMBEDDED_DOCUMENT = {
  name: "get_document",
  inputs: [
    {
      name: "PARENT",
      acceptedTypes: ["{parentDocumentClass}"],
    },
    {
      name: "DOCUMENT_ID",
      acceptedTypes: ["{documentIdClass}", "string"],
    },
  ],
  outputs_types: ["{documentClass}"],
  generator: "{documentClass}.get({DOCUMENT_ID})",
};

const UPDATE_EMBEDDED_DOCUMENT = {
  name: "update_document",
  inputs: [
    {
      name: "PARENT",
      acceptedTypes: ["{parentDocumentClass}"],
    },
    {
      name: "DOCUMENT_ID",
      acceptedTypes: ["{documentIdClass}", "string"],
    },
    {
      name: "DATA",
      acceptedTypes: ["object"],
    },
  ],
  outputs_types: ["{documentClass}"],
  generator: "{documentClass}.update({DOCUMENT_ID}, {DATA})",
};

const DELETE_EMBEDDED_DOCUMENT = {
  name: "delete_document",
  inputs: [
    {
      name: "PARENT",
      acceptedTypes: ["{parentDocumentClass}"],
    },
    {
      name: "DOCUMENT_ID",
      acceptedTypes: ["{documentIdClass}", "string"],
    },
  ],
  outputs_types: ["{documentClass}"],
  generator: "{documentClass}.delete({DOCUMENT_ID})",
};
