- ACTION:
  Description:
  DESCRIPTION
  Inputs:
  INPUT_PARAMETER:
  Description:
  DESCRIPTION
  Types: - ACCEPTED_TYPE
  Output:
  Description:
  DESCRIPTION
  Types: - OUTPUT_TYPE
  Template:
  `js
`

# Tasks

- Patch `Macro` classes to support Blockly macros.
- Allow editing of output generator, but warn first.
- Provide examples.
- Paste should paste at cursor position.
- Associate blocks with macro.
  - Detect manual editing.
  - Detect manual editing.

# Design Considerations

- Always assume block parameters may need to be dynamically chosen.
- Allow ways to "escape" possible limitations.
- BlockDescription parameters should accept both a type `T` and a type `List[T]`
- Expose basic functionality first, then make common operations easier.
- Allow "passthrough" variants of blocks.

# Plugins

# Actors

- Get All Actors From The Sidebar:
  Description:
  Get all actors the user can see in the sidebar.
  Output:
  Description:
  A list of all actors the user can see in the sidebar.
  Types: - List[Actor]
  Template:
  `js
game.actors.contents.slice();
`

- Get Actor With Given ID:
  Description:
  Get the actor with the given actor ID.
  Inputs:
  Actor ID:
  Description:
  The ID of the actor to retrieve.
  Types: - String
  Output:
  Description:
  An actor if one was found with the associated ID, otherwise null.
  Types: - Actor
  Template:
  `js
game.actors.get(ACTOR_ID);
`

- Search for Actors:
  Description:
  Search for actors that meet the specified criteria.
  Inputs:
  Query:
  Description:
  A case-insensitive search string.
  Types: - String
  Filters:
  Description:
  Search filters.
  Types: - List[FieldFilter]
  Excluded Actors:
  Description:
  Actors to exclude from the results.
  Types: - List[String] - List[Actor]
  Output:
  Description:
  IDs of actors matching the search criteria.
  Types: - List[String]
  Template:
  `js
game.actors.search(QUERY, FILTERS, EXCLUDED_ACTORS)
`

# Cards

- Get All Cards From The Sidebar:
  Description:
  Get all cards the user can see in the sidebar.
  Output:
  Description:
  A list of all cards the user can see in the sidebar.
  Types: - List[Card]
  Template:
  `js
game.cards.contents.slice()
`

# Chat Messages

- Get All Chat Messages From The Sidebar:
  Description:
  Get all chat messages the user can see in the sidebar.
  Output:
  Description:
  A list of all chat messages the user can see in the sidebar.
  Types: - List[BlockMessageDescription]
  Template:
  `js
game.messages.contents.slice()
`

# Combats

- Get All Combats From The Sidebar:
  Description:
  Get all combats the user can see in the sidebar.
  Output:
  Description:
  A list of all combats the user can see in the sidebar.
  Types: - List[Combat]
  Template:
  `js
game.combats.contents.slice()
`

# Fog Explorations

# Folders

# Items

- Get All Items From The Sidebar:
  Description:
  Get all items the user can see in the sidebar.
  Output:
  Description:
  A list of all items the user can see in the sidebar.
  Types: - List[Item]
  Template:
  `js
game.items.contents.slice()
`

# Journal Entries

- Get Journal Entries:
  Description:
  Get all journal entries the user can see in the sidebar.
  Output:
  Description:
  A list of all journal entries the user can see in the sidebar.
  Types: - List[JournalEntry]
  Template:
  `js
game.journal.contents.slice()
`

# Macros

- Get All Macros:
  Description:
  Get all macros the user can see in the sidebar.
  Output:
  Description:
  A list of all macros the user can see in the sidebar.
  Types: - List[Macro]
  Template:
  `js
game.macros.contents.slice()
`

# Playlists

- Get All Playlists:
  Description:
  Get all playlists the user can see in the sidebar.
  Output:
  Description:
  A list of all playlists the user can see in the sidebar.
  Types: - List[Playlist]
  Template:
  `js
game.playlists.contents.slice()
`

# Rollable Tables

- Get All Rollable Tables:
  Description:
  Get all rollable tables the user can see in the sidebar.
  Output:
  Description:
  A list of all rollable tables the user can see in the sidebar.
  Types: - List[RollTable]
  Template:
  `js
game.tables.contents.slice()
`

# Scenes

- Get All Scenes:
  Description:
  Get all scenes the user can see in the sidebar.
  Output:
  Description:
  A list of all scenes the user can see in the sidebar.
  Types: - List[Scene]
  Template:
  `js
game.scenes.contents.slice()
`

# Settings

# Users

- Get All Users:
  Description:
  Get all users the user can see in the sidebar.
  Output:
  Description:
  A list of all users the user can see in the sidebar.
  Types: - List[User]
  Template:
  `js
game.users.contents.slice()
`

# Active Effects

# Combatants

# Playlist Sounds

# Table Results

# Ambient Lights

# Ambient Sounds

# Drawings

# Measured Templates

# Notes

# Tiles

# Tokens

# Walls

# Compendiums

# Tools

# Other

- Construct a Filter:
  Description:
  Construct a filter for use in search queries.
  Inputs:
  Field:
  Description:
  The field to filter on.
  Types: - String
  Operator:
  Description:
  DESCRIPTION
  Types: - ACCEPTED_TYPE
  Negate:
  Description:
  DESCRIPTION
  Types: - Boolean
  Value:
  Description:
  DESCRIPTION
  Types: - ACCEPTED_TYPE
  Output:
  Description:
  DESCRIPTION
  Types: - OUTPUT_TYPE
  Template:
  `js
`
