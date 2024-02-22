import {Button, TextInput, Modal, ModalHeader, ModalBody, ModalFooter, UrlInput, NumericInput} from 'jimu-ui'
import React, { Component } from 'react'

interface DeleteLayerProps {
    deleteLayer: (id: number) => any
}

interface DeleteLayerState {
    id: number
    open: boolean
}

/**
 * DeleteLayer allows users to delete a Layer from the database
 */
class DeleteLayer extends Component<DeleteLayerProps, DeleteLayerState> {

    constructor(props: any) {
        super(props);
        this.state = {
            id: null,
            open: false
        }
    }

    /**
     * Toggles the Modal open/closed
     */
    toggleOpen = () => {
        this.setState({
            open: !this.state.open
        });
    }

    /**
     * Closes the Modal and deletes the Layer
     */
    close = () => {
        this.props.deleteLayer(this.state.id);
        this.toggleOpen();
    }

    render() {
        return (
            <div>
                <Button
                    onClick={this.toggleOpen}
                >
                    Delete Layer
                </Button>
                <Modal
                    isOpen={this.state.open}
                    onClosed={function noRefCheck(){}}
                    onEnter={function noRefCheck(){}}
                    onExit={function noRefCheck(){}}
                    onOpened={function noRefCheck(){}}
                    toggle={this.toggleOpen}
                >
                    <ModalHeader toggle={this.toggleOpen}>
                        Delete Layer
                    </ModalHeader>
                    <ModalBody>
                        <label>
                            Enter Object ID:{' '}
                            <NumericInput
                                onAcceptValue={(value) => this.setState({id: +value})}
                            />
                        </label>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={this.close}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default DeleteLayer;
