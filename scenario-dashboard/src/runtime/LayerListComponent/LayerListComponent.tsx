import "./LayerListComponent.scss";
import React, {Component} from "react";
import Layer from "esri/layers/Layer";
import FeatureLayer from "esri/layers/FeatureLayer";
import {JimuMapView, JimuMapViewComponent} from 'jimu-arcgis';
import LayerList from "esri/widgets/LayerList";
import ListItem from "esri/widgets/LayerList/ListItem";
import LayerStyleModal from "./LayerStyleModal";
import Template from "../Template";
import Category from "../Category";
import reactiveUtils from "esri/core/reactiveUtils";
import LayerListButtons from "./LayerListButtons";
import MoreInfoModal from "./MoreInfoModal";
import Legend from "esri/widgets/Legend";

interface LayerListProps {
    useMapWidgetId: string // Map widget ID to use
    onRemoveLayer: (layer: Layer) => any // callback function upon removing Layer
    getLayerTemplates: (layer: Layer, active: boolean) => Template[] // returns active Templates for the given Layer
    getLayerCategory: (layer: Layer) => Category // returns Category of the given Layer
    numActiveLayers: number // the number of active Layers
    onClearAll: () => any // callback function upon clearing all Layers
    getLayerInfo: (layer: Layer) => any
}

interface LayerListState {
    jmv: JimuMapView // JimuMapView of the associated Map
    widget: LayerList // LayerList widget to render
    layerStyleModalOpen: boolean // whether the LayerStyleModal is open
    moreInfoModalOpen: boolean // whether the MoreInfoModal is open
    selectedItem: ListItem // currently selected Layer for LayerStyleModal purposes
    allLayersHidden: boolean // whether all Layers are hidden
    allLegendsOpen: boolean // whether all legends are open
    allLegendsClosed: boolean // whether all legends are closed
}

/**
 * LayerListComponent is a customized ArcGIS LayerList widget that allows users to reorder, remove, and recolor
 * Map layers.
 */
class LayerListComponent extends Component<LayerListProps, LayerListState> {

    private readonly myRef = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            jmv: null,
            widget: null,
            layerStyleModalOpen: false,
            moreInfoModalOpen: false,
            selectedItem: null,
            allLayersHidden: false,
            allLegendsOpen: false,
            allLegendsClosed: true
        }
    }

    /**
     * Overrides LayerList selection behavior with a custom behavior when LayerItem is clicked
     * @param item the clicked LayerItem
     */
    onItemClick = (item: ListItem) => {
        // Removed toggle visibility functionality in UX Changes Round 2 to make drag and drop
        // affordability more clear
        // item.layer.visible = !item.layer.visible;
    }

    /**
     * Opens all legends in the LayerList
     */
    showLegend = () => {
        for (let li of this.state.widget.operationalItems) {
            li.panel.open = true;
        }
    }

    /**
     * Closes all legends in the LayerList
     */
    hideLegend = () => {
        for (let li of this.state.widget.operationalItems) {
            li.panel.open = false;
        }
    }

    /**
     * Shows all operational Layers
     */
    showLayers = () => {
        for (let li of this.state.widget.operationalItems) {
            li.layer.visible = true;
        }
    }

    /**
     * Hides all operational Layers
     */
    hideLayers = () => {
        for (let li of this.state.widget.operationalItems) {
            li.layer.visible = false;
        }
    }

    /**
     * Changes the color and size of this.current.layer based on layer style Modal
     */
    changeStyle = () => {
        this.refresh(this.state.selectedItem);
        this.setState({
            layerStyleModalOpen: false
        })
    }

    /**
     * Returns header for Legend
     * @return an HTMLElement with the text "Legend: "
     */
    createLegendDiv = () => {
        let element = document.createElement("div");
        element.className = "legend__header"
        element.innerHTML = "Legend: "
        return element;
    }

    /**
     * Returns comma-separated list of active Templates for the given Layer
     * @param layer the Layer to check
     * @return an HTMLElement with a comma-separated list of active Template names
     */
    createTemplatesDiv = (layer: Layer) => {
        let element = document.createElement("div");
        element.className = "legend__templates"
        let activeTemplates = this.props.getLayerTemplates(layer, true);

        if (activeTemplates.length === 0) {
            element.innerHTML = "Events: None";
            return element;
        }

        let activeTemplateList = "Events: ";
        for (let template of activeTemplates) {
            activeTemplateList += " " + template.title + ","
        }
        element.innerHTML = activeTemplateList.slice(0, -1);
        return element;
    }

    /**
     * Returns the Category of the given Layer
     * @param layer the Layer to check
     * @return an HTMLElement with the name of the Category
     */
    createCategoryDiv = (layer: Layer) => {
        let element = document.createElement("div");
        element.className = "legend__category";
        if (this.props.getLayerCategory(layer) != null) {
            element.innerHTML = "Category: " + this.props.getLayerCategory(layer).title;
        }
        return element;
    }

    /**
     * Refreshes ListItemPanel content
     * @param item the ListItem to refresh
     */
    refresh = (item: ListItem) => {
        if (item.parent) {
            item.panel.content = [
                "legend"
            ]
        } else {
            item.panel.content = [
                this.createLegendDiv(),
                "legend",
                this.createTemplatesDiv(item.layer),
                this.createCategoryDiv(item.layer)
            ]
        }
    }

    /**
     * Updates JimuMapView and creates LayerList on active view change
     * @param jmv the new JimuMapView
     */
    activeViewChangeHandler = (jmv: JimuMapView) => {
        if (this.state.jmv && this.state.widget) {
            this.state.widget.destroy();
        }

        if (jmv) {
            this.setState({
                jmv: jmv
            });

            // Create LayerList
            if (this.myRef.current) {
                const layerList: LayerList = new LayerList({
                    view: jmv.view,

                    // Called for each ListItem in LayerList
                    listItemCreatedFunction: async (event) => {
                        let item = event.item;

                        // Create legend
                        item.panel = {
                            className: "esri-icon-down",
                        };
                        this.refresh(item);

                        // Add ListItem actions
                        await item.layer.when();
                        item.actionsSections = [
                            [{
                                title: "Remove",
                                className: "esri-icon-minus",
                                id: "remove"
                            }],
                            [{
                                title: "Zoom to",
                                className: "esri-icon-zoom-in-magnifying-glass",
                                id: "zoom"
                            }],
                            [{
                                title: "Edit legend style",
                                image: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/layers-editable-24.svg",
                                id: "change-style",
                                // Edit layer style only supports SimpleRenderers
                                disabled: !(
                                    item.layer.type === "feature" &&
                                    item.layer.renderer.type === "simple" &&
                                    (item.layer.renderer.symbol.color != null ||
                                        item.layer.renderer.symbol.type === "picture-marker")
                                )
                            }],
                            [
                                {
                                    title: "Send backwards",
                                    image: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/send-backwards-24.svg",
                                    id: "send-backwards"
                                },
                                {
                                    title: "Bring forward",
                                    image: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/bring-forward-24.svg",
                                    id: "bring-forward"
                                },
                                {
                                    title: "Send to back",
                                    image: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/send-to-back-24.svg",
                                    id: "send-to-back"
                                },
                                {
                                    title: "Bring to front",
                                    image: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/bring-to-front-24.svg",
                                    id: "bring-to-front"
                                }
                            ],
                            [{
                                title: "Description",
                                className: "esri-icon-description",
                                id: "description"
                            }]
                        ];

                        item.addHandles([
                            // Override selection behavior
                            reactiveUtils.watch(
                                () => layerList.selectedItems.includes(item),
                                () => this.onItemClick(item)
                            ),
                            // Close actions section when legend panel opens
                            reactiveUtils.when(
                                () => item.panel.open,
                                () => item.actionsOpen = false
                            ),
                            // Close legend paanel when actions section opens
                            reactiveUtils.when(
                                () => item.actionsOpen,
                                () => item.panel.open = false
                            )
                        ]);
                    },
                    container: this.myRef.current,
                    selectionEnabled: true,
                    multipleSelectionEnabled: true
                });

                // Add ListItem action functionality
                layerList.on("trigger-action", (event) => {
                    const id = event.action.id;
                    const layer = event.item.layer;
                    let index = this.state.jmv.view.map.layers.findIndex((l) => l === layer);

                    switch (id) {
                        case "zoom":
                            // Go to full extent of layer
                            jmv.view.goTo(layer.fullExtent);
                            break;
                        case "remove":
                            // Remove layer from map
                            this.props.onRemoveLayer(layer);
                            break;
                        case "change-style":
                            // Open Layer Style Modal
                            this.setState({
                                layerStyleModalOpen: true,
                                selectedItem: event.item
                            });
                            break;
                        case "send-backwards":
                            // Send layer back 1 level
                            if (index > 0) {
                                this.state.jmv.view.map.reorder(layer, index - 1);
                            }
                            break;
                        case "bring-forward":
                            // Bring layer forward 1 level
                            if (index > -1 && index < this.state.jmv.view.map.layers.length) {
                                this.state.jmv.view.map.reorder(layer, index + 1);
                            }
                            break;
                        case "send-to-back":
                            // Move layer to back
                            if (index > -1) {
                                this.state.jmv.view.map.reorder(layer, 0);
                            }
                            break;
                        case "bring-to-front":
                            // Move layer to front
                            if (index > -1) {
                                this.state.jmv.view.map.reorder(layer, this.state.jmv.view.map.layers.length - 1);
                            }
                            break;
                        case "description":
                            this.setState({
                                moreInfoModalOpen: true,
                                selectedItem: event.item
                            })
                    }
                });

                // Watch LayerList properties to determine whether buttons should be disabled
                layerList.addHandles([
                    reactiveUtils.watch(
                        () => layerList.operationalItems.reduce((prev, curr) => prev && !curr.layer.visible, true),
                        () => this.setState({
                            allLayersHidden: layerList.operationalItems.reduce((prev, curr) => prev && !curr.layer.visible, true)
                        })
                    ),
                    reactiveUtils.watch(
                        () => layerList.operationalItems.reduce((prev, curr) => prev && curr.panel.open, true),
                        () => this.setState({
                            allLegendsOpen: layerList.operationalItems.reduce((prev, curr) => prev && curr.panel.open, true)
                        })
                    ),
                    reactiveUtils.watch(
                        () => layerList.operationalItems.reduce((prev, curr) => prev && !curr.panel.open, true),
                        () => this.setState({
                            allLegendsClosed: layerList.operationalItems.reduce((prev, curr) => prev && !curr.panel.open, true)
                        })
                    )
                ])

                this.setState({
                    widget: layerList
                });
            }
        }
    }

    render() {
        if (this.state.widget) {
            for (let item of this.state.widget.viewModel.operationalItems) {
                this.refresh(item);
            }
        }

        return (
            <div id="layer-list-component">
                <JimuMapViewComponent
                    useMapWidgetId={this.props.useMapWidgetId}
                    onActiveViewChange={this.activeViewChangeHandler}
                />
                <h3>{"Current Layers (" + this.props.numActiveLayers + ")"}</h3>
                {
                    this.props.numActiveLayers <= 0 && (
                        <div id="no-layers-message">
                            <em>You do not have any layers added.
                                Get started by adding a scenario or layer from the left side of the panel.</em>
                        </div>
                    )
                }
                {
                    this.props.numActiveLayers > 0 && (
                        <LayerListButtons
                            onClearAll={this.props.onClearAll}
                            onHideLegend={this.hideLegend}
                            onShowLegend={this.showLegend}
                            onShowLayers={this.showLayers}
                            onHideLayers={this.hideLayers}
                            allLayersHidden={this.state.allLayersHidden}
                            allLegendsOpen={this.state.allLegendsOpen}
                            allLegendsClosed={this.state.allLegendsClosed}
                        />
                    )
                }
                <div id="layer-list__content" ref={this.myRef}/>
                {
                    this.state.selectedItem &&
                    this.state.selectedItem.layer &&
                    this.state.selectedItem.layer.type === "feature" &&
                    (this.state.selectedItem.layer as FeatureLayer).renderer.type === "simple" && (
                        <LayerStyleModal
                            onSave={this.changeStyle}
                            layer={this.state.selectedItem.layer as FeatureLayer}
                            open={this.state.layerStyleModalOpen}
                            toggleOpen={() => this.setState({layerStyleModalOpen: !this.state.layerStyleModalOpen})}
                        />
                    )
                }
                {
                    this.state.selectedItem &&
                    this.state.selectedItem.layer && (
                        <MoreInfoModal
                            layer={this.state.selectedItem.layer}
                            open={this.state.moreInfoModalOpen}
                            toggleOpen={() => this.setState({moreInfoModalOpen: !this.state.moreInfoModalOpen})}
                            getLayerInfo={this.props.getLayerInfo}
                        />
                    )
                }

            </div>
        );
    }
}

export default LayerListComponent;
