import React, {Component} from "react";
import {Button, Icon} from "jimu-ui";
import Layer from "esri/layers/Layer";
import LayerWrapper from "../LayerWrapper";

interface AddLayerItemProps {
    layerWrapper: LayerWrapper // LayerWrapper of the associated Layer
    onAddLayer: (layerWrapper: LayerWrapper) => any // callback function upon adding Layer
    active: boolean // whether the Layer is active
}


/**
 * AddLayerItem allows the user to add a Layer to the Map
 */
class AddLayerItem extends Component<AddLayerItemProps, {}> {

    render() {
        return (
            <Button
                aria-label="Button"
                icon
                onClick={() => this.props.onAddLayer(this.props.layerWrapper)}
                size="sm"
                type="tertiary"
                className="add-button"
                disabled={this.props.active}
            >
                <Icon
                    icon={this.props.active ?
                        "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/check-32.svg" :
                        "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/plus-32.svg"
                    }
                    size="l"
                />
                {this.props.layerWrapper.title}
            </Button>
        );
    }
}

export default AddLayerItem;
