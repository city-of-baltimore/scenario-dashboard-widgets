import React, {Component} from "react";
import {AdvancedSelect, Icon} from "jimu-ui";
import AddLayerItem from "./AddLayerItem";
import LayerWrapper from "../LayerWrapper";

interface AddLayerSearchProps {
    layers: LayerWrapper[] // list of LayerWrappers to render
    activeLayers: LayerWrapper[] // list of active Layers
    onAddLayer: (layerWrapper: LayerWrapper) => any // callback function upon adding Layers
}

/**
 * LayerSearch allows users to search for and add Layers to the Map
 */
class LayerSearch extends Component<AddLayerSearchProps, {}> {
    render() {
        return (
            <div id="layer-search">
                <AdvancedSelect
                    isMultiple={true}
                    isEmptyOptionHidden={true}
                    onChange={function noRefCheck(){}}
                    size="default"
                    sortValuesByLabel={true}
                    menuProps={{
                        offset: [0, -40]
                    }}
                    customDropdownButtonContent={() => {return (
                        <div>
                            <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/search-32.svg"/>
                            Search for layer...
                        </div>
                    )}}
                    staticValues={this.props.layers.map((layerWrapper) => {
                        return {
                            label: layerWrapper.title,
                            value: layerWrapper.id,
                            render: (item) => {
                                return <AddLayerItem
                                    layerWrapper={layerWrapper}
                                    onAddLayer={this.props.onAddLayer}
                                    active={this.props.activeLayers.includes(layerWrapper)}
                                />
                            }
                        }
                    })}
                />
            </div>
        )
    }
}

export default LayerSearch;
