import {Button, TextInput, Modal, ModalHeader, ModalBody, ModalFooter, Icon} from 'jimu-ui'
import React, { Component } from 'react'

interface SaveTemplateProps {
    handleClick: (title: string) => any // function to call on click
    show: boolean // whether to show the button
}

interface SaveTemplateState {
    title: string // title of the new Template
    open: boolean // whether the Modal is open
}

/**
 * SaveTemplateComponent renders the buttons that allow users to save the active Layers as a new Template
 */
class SaveTemplateComponent extends Component<SaveTemplateProps, SaveTemplateState> {

    constructor(props: any) {
        super(props);
        this.state = {
            title: undefined,
            open: false
        };
    }

    /**
     * Toggles Save Template Modal between open and closed
     */
    toggleOpen = () => {
        this.setState({
            open: !this.state.open
        });
    }

    checkValidity = (text: string) => {
        return {
            valid: text.length <= 50,
            msg: "Maximum title length is 50 characters!"
        };
    }

    render() {
        return (
            <div id="save-template-component">
                {this.props.show && (
                    <Button
                        onClick={this.toggleOpen}
                        id="open-save-template-button"
                        type="primary"
                    >
                        <Icon
                            icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/plus-32.svg"
                            size="l"
                        />
                        Save As New Scenario
                    </Button>
                )}
                <Modal
                    isOpen={this.state.open}
                    onClosed={function noRefCheck(){}}
                    onEnter={function noRefCheck(){}}
                    onExit={function noRefCheck(){}}
                    onOpened={function noRefCheck(){}}
                    toggle={this.toggleOpen}
                >
                    <ModalHeader toggle={this.toggleOpen}>
                        Save As New Event
                    </ModalHeader>
                    <ModalBody>
                        Event Title:
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Event Title..."
                            onAcceptValue={(value) => this.setState({title: value})}
                            checkValidityOnChange={this.checkValidity}
                            checkValidityOnAccept={this.checkValidity}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={this.toggleOpen}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {this.props.handleClick(this.state.title); this.toggleOpen();}}
                            id="save-template-button"
                            type="primary"
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default SaveTemplateComponent;
