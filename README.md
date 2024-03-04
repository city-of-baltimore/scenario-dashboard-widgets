
# scenario-dashboard-widgets
## The project
This repository is the widgets for the dashboard the Baltimore City Digital Services Team built with the Baltimore Office of Emergency Management (OEM). The purpose was to allow OEM to view many overlapping layers grouped by "Scenarios" so that in an emergency they could quickly navigate to the exact view they needed. It allows an admin to quickly add or remove additional layers through a database view. These widgets and apps are built to be used with ArcGIS Experience Builder.

## Local Machine Setup
Please navigate to https://github.com/city-of-baltimore/docker-oem-dashboard to get set up with docker

## The code
This repository contains two widgets:
- scenario-dashboard handles the front-end display of the dashboard. It allows the user to add Layers and Scenarios (also known as Templates on the back-end) to a map.
- scenario-database-config allows the user to directly add/delete Templates, Layers, Categories while viewing the database as a table.

The database is an ArcGIS table called "OEM Database Public". The schema is

|Categories|
|----------|
|OBJECTID  |
|name      |

| Layers       | Description |
| ----------- | ------------ |
| OBJECTID    |              |
| Scope       | Area this layer covers
| Title       | Name of layer to be displayed to user 
| URL         | Api url for layer
| Source      | Where did the data originate
| Description | What data the layer reflects
| Category ID | Assigns the layer to a Category by ID
| Renderer    | JSON object based on [Renderer](https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-Renderer.html)
| Filter      | Allows user to apply filter to layer

| Templates |
| --------- |
| OBJECTID  |
| Title     |

| LayerTemplateRelationships |
| -------------------------- |
| OBJECTID                   |
| Template ID                |
| Layer ID                   | 



The oem-dashboard widget contains the following components and interfaces: 
- Base Widget Component: Handles all api calls and renders the child
- LayerListComponent: lists each of the layers to be removed or adjusted on screen. There are two modals (LayerStyleModal and MoreInfoModal) that this renders and one set of buttons (LayerListButtons).
- TemplateComponent: This handles searching through the templates, removing them, and viewing active templates. It renders AddTemplateItem, ActiveTemplatesMenu, and TemplateSearch.
- SaveTemplateComponent: Creates a button to allow the user to save the current layer list as a template.
- ExportCSVComponent: Handles the link display and status modal for exporting CSV.
- LayerWrapper: Interface for LayerWrapper object which contains the ArcGIS layer.
- Category: Interface for Category which has many layers.
- Template: Interface for Template, also known as Scenarios.

The oem-database-config widget contains the following components:
- Base Widget Component
- AddCategory
- AddLayer
- DeleteCategory
- DeleteLayer
- DeleteTemplate

## Contributing to these widgets

This project will use issues and branching to track changes from external contributors. If you have a change, please find or open a GitHub issue describing the reason for the change.

Name your branch based on the issue (ex. issue-2).

Reference the issue in your commit message, along with a description of the code changed.

Once the code is ready, open a pull request for review.

[Read more about creating a branch](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project#creating-a-branch-to-work-on)

Want to contribute to this README?
