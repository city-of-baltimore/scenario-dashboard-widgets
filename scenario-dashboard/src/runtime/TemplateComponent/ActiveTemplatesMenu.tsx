import React, {Component} from "react";
import {Tabs, Tab} from "jimu-ui";
import Template from "../Template";

interface TemplatesProps {
    activeTemplates: Template[] // list of active Templates
    removeTemplate: (template: Template) => any // callback function upon removing a Template
}

/**
 * ActiveTemplatesMenu renders a list of active Templates and allows users to remove Templates
 */
class ActiveTemplatesMenu extends Component<TemplatesProps, {}> {
    render() {
        return (
            <div id="active-templates-menu">
                {
                    this.props.activeTemplates.length === 0 &&
                    <div id="no-active-templates">
                        <em>Added Scenarios will appear here.</em>
                    </div>
                }
                <Tabs
                    scrollable
                    type="pills"
                >
                    {
                        this.props.activeTemplates.map((template) => {
                            return (
                                <Tab
                                    id={"" + template.id}
                                    title={template.title + " (" + template.layerWrappers.length + ")"}
                                    onClose={() => this.props.removeTemplate(template)}
                                    closeable
                                >
                                </Tab>
                            )
                        })
                    }
                </Tabs>
            </div>
        )
    }
}

export default ActiveTemplatesMenu;
