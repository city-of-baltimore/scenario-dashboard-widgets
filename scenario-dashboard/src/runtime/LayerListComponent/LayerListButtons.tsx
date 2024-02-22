import "./LayerListComponent.scss";
import React, {Component} from "react";
import {Button, Dropdown, DropdownButton, DropdownMenu, DropdownItem, Icon} from "jimu-ui";

interface LayerListButtonsProps {
    onClearAll: () => any // callback function to clear all Layers
    onHideLegend: () => any // callback function to hide legends
    onShowLegend: () => any // callback function to show legends
    onHideLayers: () => any // callback function to hide all Layers
    onShowLayers: () => any // callback function to show all Layers
    allLayersHidden: boolean // whether all Layers are hidden
    allLegendsOpen: boolean // whether all legends are open
    allLegendsClosed: boolean // whether all legends are closed
}

interface LayerListButtonsState {
}

/**
 * LayerListButtons contains Buttons that control the behavior of a LayerList
 */
class LayerListButtons extends Component<LayerListButtonsProps, LayerListButtonsState> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id="layer-list__buttons">
                <div id="clear-all-button-grid-item">
                    <Button
                        aria-label="Button"
                        onClick={this.props.onClearAll}
                        size="default"
                        id="clear-all-button"
                        type="tertiary"
                    >
                        Clear All
                    </Button>
                </div>
                <div id="legend-button-grid-item">
                    <Dropdown>
                        <DropdownButton
                            id="legend-button"
                            type="tertiary"
                            arrow={false}
                        >
                            Legend
                            <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/hamburger-32.svg"/>
                        </DropdownButton>
                        <DropdownMenu
                            alignment="end"
                        >
                            <DropdownItem
                                onClick={this.props.onShowLegend}
                                id="show-legend-button"
                                type="tertiary"
                                disabled={this.props.allLegendsOpen}
                            >
                                Show All
                            </DropdownItem>
                            <DropdownItem
                                onClick={this.props.onHideLegend}
                                id="hide-legend-button"
                                type="tertiary"
                                disabled={this.props.allLegendsClosed}
                            >
                                Hide All
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div id="layer-visibility-grid-item">
                    <Button
                        id="layer-visibility-button"
                        type="tertiary"
                        onClick={() => {
                            if (this.props.allLayersHidden) {
                                this.props.onShowLayers();
                            } else {
                                this.props.onHideLayers();
                            }
                        }}
                    >
                        <Icon
                            icon={this.props.allLayersHidden ?
                                "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/view-hide-32.svg" :
                                "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/view-visible-32.svg"
                            }
                            size="l"
                        />
                        {this.props.allLayersHidden ? "Show All" : "Hide All"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default LayerListButtons;
