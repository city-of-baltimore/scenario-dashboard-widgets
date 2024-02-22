import React, {Component} from "react";
import {AdvancedSelect, Icon} from "jimu-ui";
import Template from "../Template";
import AddTemplateItem from "./AddTemplateItem";
import LayerWrapper from "../LayerWrapper";

interface TemplateSearchProps {
    templates: Template[] // list of Templates
    activeLayers: LayerWrapper[] // list of active Layers
    activeTemplates: Template[] // list of active Templates
    onAddLayer: (layer: LayerWrapper) => any // callback function upon adding a Layer
    onAddTemplate: (template: Template) => any // callback function upon adding a Template
}

/**
 * TemplateSearch allows users to search for a Template
 */
class TemplateSearch extends Component<TemplateSearchProps, {}> {

    render() {
        return (
            <div id="template-search">
                <AdvancedSelect
                    isMultiple={true}
                    isEmptyOptionHidden={true}
                    onChange={function noRefCheck(){}}
                    size="default"
                    sortValuesByLabel={true}
                    menuProps={{
                        offset: [0, -40]
                    }}
                    customDropdownButtonContent={(
                    ) => {return (
                        <div>
                            <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/search-32.svg"/>
                            Search for Scenario...
                        </div>
                    )}}
                    appendToBody={false}
                    strategy="fixed"
                    staticValues={this.props.templates.map((template) => {
                        return {
                            label: template.title,
                            value: template.id,
                            render: (item) => {
                                return (
                                    <span className="template-search-item">
                                        <AddTemplateItem
                                            template={template}
                                            onAddTemplate={this.props.onAddTemplate}
                                            onAddLayer={this.props.onAddLayer}
                                            activeLayers={this.props.activeLayers}
                                            activeTemplates={this.props.activeTemplates}
                                        />
                                    </span>
                                )
                            }
                        }
                    })}
                />
            </div>
        )
    }
}

export default TemplateSearch;
