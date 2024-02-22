import "./TemplateComponent.scss";
import React, {Component} from "react";
import {Icon, Tooltip} from "jimu-ui";
import Template from "../Template";
import TemplateSearch from "./TemplateSearch";
import ActiveTemplatesMenu from "./ActiveTemplatesMenu";
import LayerWrapper from "../LayerWrapper";

interface TemplatesProps {
    templates: Template[] // list of Templates to render
    activeLayers: LayerWrapper[] // list of active Layers
    activeTemplates: Template[] // list of active Templates
    onAddTemplate: (template: Template) => any // callback function upon adding Templates
    onRemoveTemplate: (template: Template) => any // callback function upon removing Templates
    onAddLayer: (layerWrapper: LayerWrapper) => any // callback function upon adding Layers
}
interface TemplatesState {
    paneOpen: boolean // whether the Template pane is open
    selectedTemplate: Template // currently selected Template from Template dropdown for more info
}

/**
 * TemplateComponent contains a TemplateSearch dropdown, ActiveTemplateMenu, and a detailed pane of the layers
 * in each Template
 */
class TemplateComponent extends Component<TemplatesProps, TemplatesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            paneOpen: false,
            selectedTemplate: null
        }
    }

    render() {
        return (
            <div id="template-component">
                <div id="template-component__header">
                    <h4>Scenarios</h4>
                    <Tooltip
                        placement="right"
                        title="Scenarios are a set of layers that are grouped together for a specific emergency
                        and can be added to the map all at once."
                    >
                        <div id="template-component__info">
                            <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/question-32-f.svg"/>
                        </div>
                    </Tooltip>
                </div>
                {this.props.templates && (
                    <div id="template-component__content">
                        <TemplateSearch
                            templates={this.props.templates}
                            onAddLayer={this.props.onAddLayer}
                            onAddTemplate={this.props.onAddTemplate}
                            activeLayers={this.props.activeLayers}
                            activeTemplates={this.props.activeTemplates}
                        />
                        <ActiveTemplatesMenu
                            activeTemplates={this.props.activeTemplates}
                            removeTemplate={this.props.onRemoveTemplate}
                        />
                    </div>
                    )}
            </div>
        )
    }
}

export default TemplateComponent;
