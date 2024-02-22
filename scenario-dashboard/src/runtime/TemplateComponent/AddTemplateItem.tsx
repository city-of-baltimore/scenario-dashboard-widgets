import React, { Component} from 'react'
import AddLayerItem from "../LayerComponent/AddLayerItem";
import {CollapsablePanel, Button, Icon} from "jimu-ui"
import Template from '../Template'
import LayerWrapper from "../LayerWrapper";

interface AddTemplateItemProps {
    template: Template // Template to add
    activeLayers: LayerWrapper[] // list of active Layers
    activeTemplates: Template[] // list of active Templates
    onAddLayer: (layerWrapper: LayerWrapper) => any // callback function upon adding Layer
    onAddTemplate: (template: Template) => any // callback function upon adding Template
}

/**
 * AddTemplateItem allows users to add all Layers in a Template to the Map
 */
class AddTemplateItem extends Component<AddTemplateItemProps, {}> {

    render() {
        // Disable the add button if the Template was added to the list of active Templates and
        // all Layers are currently added to the Map
        let added: boolean = this.props.activeTemplates.includes(this.props.template);
        if (added) {
            for (let layerWrapper of this.props.template.layerWrappers) {
                if (!this.props.activeLayers.includes(layerWrapper)) {
                    added = false;
                    break;
                }
            }
        }

        return (
            <CollapsablePanel
                label={
                    <Button
                        aria-label="Button"
                        icon
                        onClick={() => this.props.onAddTemplate(this.props.template)}
                        size="sm"
                        type="tertiary"
                        disabled={this.props.template.layerWrappers.length === 0 || added}
                        className="add-button"
                    >
                        <Icon
                            icon={added ?
                                "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/check-32.svg" :
                                "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/plus-32.svg"
                            }
                            size="l"
                        />
                        {this.props.template.title + " (" + this.props.template.layerWrappers.length + ")"}
                    </Button>
                }
                level={0}
                type="default"
                disabled={this.props.template.layerWrappers.length === 0}
            >
                <div className="template-dropdown__content">
                    {this.props.template.layerWrappers.map((_val, index) => {
                        // Map in reverse order to maintain consistency with Layer List order
                        let layerWrapper =
                            this.props.template.layerWrappers[this.props.template.layerWrappers.length - index - 1];
                        return (
                            <AddLayerItem
                                layerWrapper={layerWrapper}
                                onAddLayer={this.props.onAddLayer}
                                active={this.props.activeLayers.includes(layerWrapper)}
                            />
                        );
                    })}
                </div>
            </CollapsablePanel>
        );
    }
}

export default AddTemplateItem;
