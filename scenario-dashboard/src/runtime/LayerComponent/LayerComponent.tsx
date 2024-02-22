import "./LayerComponent.scss";
import React, {Component} from 'react';
import {Tab, Tabs} from 'jimu-ui';
import Category from '../Category';
import LayerSearch from "./LayerSearch";
import AddLayerItem from "./AddLayerItem";
import LayerWrapper from "../LayerWrapper";

interface AddLayersProps {
    layers: LayerWrapper[] // List of LayerWrappers to render
    activeLayers: LayerWrapper[] // list of active Layers
    onAddLayer: (layerWrapper: LayerWrapper) => any // callback function upon adding Layers
    categories: Category[] // list of Categories
}

/**
 * LayerComponent contains multiple Tabs of Categories and allows users to add Layers to the Map
 */
class LayerComponent extends Component<AddLayersProps, {}> {

    /**
     * Renders list of Categories as Tabs
     */
    renderCategoryTabs: Function = (): React.ReactElement[] => {
        return this.props.categories.map((category) => {
            return (
                <Tab
                    id={"category-" + category.id + "-tab"}
                    className="tab"
                    title={category.title + " (" + category.layerWrappers.length + ")"}
                >
                    <div id={"category-" + category.id + "-tab-content"} className="layer-tabs__content p-5 border">
                        {category.layerWrappers.map((layerWrapper) => {
                            return (
                                <AddLayerItem
                                    layerWrapper={layerWrapper}
                                    onAddLayer={this.props.onAddLayer}
                                    active={this.props.activeLayers.includes(layerWrapper)}
                                />
                            );
                        })}
                    </div>
                </Tab>
            );
        });
    }

    render() {
        return (
            <div id="layer-component">
                <h4>Layers</h4>
                {this.props.layers && (
                    <LayerSearch
                        layers={this.props.layers}
                        onAddLayer={this.props.onAddLayer}
                        activeLayers={this.props.activeLayers}
                    />
                )}
                <div className="layer-tabs">
                    <Tabs
                        onChange={function noRefCheck(){}}
                        onClose={function noRefCheck(){}}
                        type="tabs"
                        scrollable
                    >
                        {this.props.categories && this.renderCategoryTabs()}
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default LayerComponent;
