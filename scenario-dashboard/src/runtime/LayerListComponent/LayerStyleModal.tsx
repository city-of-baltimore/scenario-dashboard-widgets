import React, {Component} from "react";
import {Button, Modal, ModalBody, ModalHeader, ModalFooter, Slider} from 'jimu-ui';
import {ColorPicker} from "jimu-ui/basic/color-picker";
import Color from "esri/Color";
import SimpleRenderer from "esri/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import PictureMarkerSymbol from "esri/symbols/PictureMarkerSymbol";
import SimpleLineSymbol from "esri/symbols/PictureMarkerSymbol";
import FeatureLayer from "esri/layers/FeatureLayer";

interface LayerStyleModalProps {
    onSave: () => any // callback function upon saving Layer style
    layer: FeatureLayer // the Layer to edit
    open: boolean // whether this Modal is open
    toggleOpen: () => any // toggles the Modal between open and closed

}

interface LayerStyleModalState {
    showColorPicker: boolean // whether to show the ColorPicker
    showSizeSlider: boolean // whether to show the size Slider
    color: string // currently selected Color
    size: number // currently selected size
    originalRenderer: SimpleRenderer
}

/**
 * LayerStyleModal gives users the ability to edit the appearance of rendered Layers.
 * The edit layer style functionality only supports SimpleRenderers.
 */
class LayerStyleModal extends Component<LayerStyleModalProps, LayerStyleModalState> {

    constructor(props: any) {
        super(props);
        this.state = {
            showColorPicker: false,
            showSizeSlider: false,
            color: null,
            size: null,
            originalRenderer: null
        }
    }

    /**
     * Handles behavior upon opening Modal
     */
    onOpened = () => {
        this.setState({
            originalRenderer: SimpleRenderer.fromJSON(this.props.layer.renderer.toJSON())
        });

        let symbol = (this.props.layer.renderer as SimpleRenderer).symbol;
        switch (symbol.type) {
            case "simple-marker":
                if (symbol.style === "cross" || symbol.style === "x") {
                    this.setState({
                        showColorPicker: true,
                        showSizeSlider: true,
                        color: symbol.outline.color.toString(),
                        size: symbol.size
                    });
                } else {
                    this.setState({
                        showColorPicker: true,
                        showSizeSlider: true,
                        color: symbol.color.toString(),
                        size: symbol.size
                    });
                }
                break;
            case "picture-marker":
                this.setState({
                    showColorPicker: false,
                    showSizeSlider: true,
                    color: "#ffffff",
                    size: (symbol as PictureMarkerSymbol).width
                });
                break;
            case "simple-fill":
                this.setState({
                    showColorPicker: true,
                    showSizeSlider: false,
                    color: symbol.color.toString(),
                    size: null
                });
                break;
            case "simple-line":
                this.setState({
                    showColorPicker: true,
                    showSizeSlider: true,
                    color: symbol.color.toString(),
                    size: (symbol as SimpleLineSymbol).width
                });
                break;
            default:
                this.setState({
                    showColorPicker: true,
                    showSizeSlider: false,
                    color: symbol.color.toString(),
                    size: null
                });
        }
    }

    /**
     * Handles behavior when color picker warning for picture marker is clicked
     */
    handleColorWarningClick = () => {
        this.setState({
            showColorPicker: true
        });
        (this.props.layer.renderer as SimpleRenderer).symbol = new SimpleMarkerSymbol({
            color: this.state.color,
            size: this.state.size
        });
    }

    /**
     * Updates Layer style upon color change
     * @param color the new color
     */
    handleChangeColor = (color: string) => {
        this.setState({color: color});
        let layer = this.props.layer as FeatureLayer;
        let renderer = layer.renderer as SimpleRenderer;

        // Change size and color
        switch (renderer.symbol.type) {
            case "simple-marker":
                if (renderer.symbol.style === "cross" || renderer.symbol.style === "x") {
                    renderer.symbol.outline.color = new Color(color);
                } else {
                    renderer.symbol.color = new Color(color);
                }
                break;
            case "simple-fill":
                renderer.symbol.color = new Color(color);
                break;
            case "simple-line":
                renderer.symbol.color = new Color(color);
                break;
            default:
                renderer.symbol.color = new Color(color);
        }
    }

    /**
     * Updates layer style upon size change
     * @param size the new size
     */
    handleChangeSize = (size: number) => {
        let layer = this.props.layer as FeatureLayer;
        let renderer = layer.renderer as SimpleRenderer;

        // Change size and color
        this.setState({size: size});
        switch (renderer.symbol.type) {
            case "simple-marker":
                (renderer.symbol as SimpleMarkerSymbol).size = size;
                break;
            case "picture-marker":
                let pmSymbol = renderer.symbol as PictureMarkerSymbol
                let ratio: number = pmSymbol.height / pmSymbol.width;
                pmSymbol.width = size;
                pmSymbol.height = size * ratio;
                break;
            case "simple-line":
                (renderer.symbol as SimpleLineSymbol).width = size;
                break;
        }
    }

    handleCancel = () => {
        this.props.layer.renderer = this.state.originalRenderer;
        this.props.toggleOpen();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.open}
                onClosed={function noRefCheck(){}}
                onEnter={function noRefCheck(){}}
                onExit={function noRefCheck(){}}
                onOpened={this.onOpened}
                toggle={this.props.toggleOpen}
                backdropClassName="layer-style-modal"
            >
                <ModalHeader toggle={this.props.toggleOpen}>
                    Edit {this.props.layer.title} Legend Style
                </ModalHeader>
                <ModalBody>
                    {
                        this.state.showSizeSlider && (
                            <div className="layer-size-slider">
                                Select Marker Size:
                                <Slider
                                    aria-label="Layer Size Slider"
                                    onChange={(e) => this.handleChangeSize(+e.target.value)}
                                    min={0}
                                    max={Math.max(50, this.state.size)}
                                    value={this.state.size}
                                />
                                <label>{this.state.size}</label>
                            </div>
                        )
                    }
                    {
                        this.state.showColorPicker && (
                            <div className="layer-color-picker">
                                Select Marker Color:
                                <ColorPicker
                                    aria-label="Layer Color Picker"
                                    color = {this.state.color}
                                    height={30}
                                    width={30}
                                    onChange={(color) => this.handleChangeColor(color)}
                                    onClick={function noRefCheck(){}}
                                    placement="bottom"
                                    type="default"
                                />
                            </div>
                        )
                    }
                    {
                        ((this.props.layer as FeatureLayer).renderer as SimpleRenderer).symbol.type === "picture-marker" &&
                        !this.state.showColorPicker && (
                            <div id="picture-marker-warning">
                                <Button onClick={this.handleColorWarningClick}>Change Color</Button>
                                <div>
                                    <em>Changing the color of this layer requires converting the marker from a picture to a simple circular marker.</em>
                                </div>
                            </div>
                        )
                    }
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={this.handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.props.onSave}
                        id="save-template-button"
                        type="primary"
                    >
                        Done
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default LayerStyleModal;
