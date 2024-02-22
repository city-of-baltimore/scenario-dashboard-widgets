import React, {Component} from "react";
import {Button, Modal, ModalBody, ModalHeader, ModalFooter, Slider} from 'jimu-ui';
import Layer from "esri/layers/Layer";

interface MoreInfoModalProps {
    layer: Layer // the Layer to show information about
    open: boolean // whether this Modal is open
    toggleOpen: () => any // toggles the Modal between open and closed
    getLayerInfo: (layer: Layer) => any // callback function to get Layer info
}

interface MoreInfoModalState {
    source: string // the Layer source
    description: string // the Layer description
    url: string // the Layer URL
}

/**
 * MoreInfoModal displays more information about a Layer to users
 */
class MoreInfoModal extends Component<MoreInfoModalProps, MoreInfoModalState> {

    constructor(props: any) {
        super(props);
        this.state = {
            source: "...",
            description: "...",
            url: ""
        }
    }

    /**
     * Handles behavior upon opening Modal
     */
    onOpened = async () => {
        this.setState({
            source: "...",
            description: "...",
            url: ""
        });
        let info = await this.props.getLayerInfo(this.props.layer);
        if (info) {
            this.setState(info);
        }
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
            >
                <ModalHeader toggle={this.props.toggleOpen}>
                    {this.props.layer.title} Description
                </ModalHeader>
                <ModalBody>
                    <div className="layer-source">
                        Source: {this.state.source}
                    </div>
                    <div className="layer-description">
                        Description: {this.state.description}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={this.props.toggleOpen}
                    >
                        Close
                    </Button>
                    {
                        this.state.url && (
                            <Button
                                onClick={() => window.open(this.state.url, "_blank")}
                                type="primary"
                            >
                                See More
                            </Button>
                        )
                    }
                </ModalFooter>
            </Modal>
        );
    }
}

export default MoreInfoModal;
