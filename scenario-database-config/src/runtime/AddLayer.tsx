import {Button, TextInput, TextArea, Modal, ModalHeader, ModalBody, ModalFooter, NumericInput} from 'jimu-ui'
import React, { Component } from 'react'

interface AddLayerProps {
    addLayer: (title: string, url: string, scope: string, source: string,
               description: string, categoryId: number, renderer?: string) => any
}

interface AddLayerState {
    title: string
    url: string
    scope: string
    source: string
    description: string
    categoryId: number
    renderer: string
    open: boolean
}

/**
 * AddLayer allows users to add a Layer to the database
 */
class AddLayer extends Component<AddLayerProps, AddLayerState> {

    constructor(props: any) {
        super(props);
        this.state = {
            title: null,
            url: null,
            scope: null,
            source: null,
            description: null,
            categoryId: -1,
            renderer: null,
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
     * Closes the Modal and adds the Layer
     */
    close = () => {
        this.props.addLayer(this.state.title, this.state.url, this.state.scope, this.state.source,
            this.state.description, this.state.categoryId, this.state.renderer);
        this.toggleOpen();
    }

    render() {
        return (
            <div>
                <Button
                    onClick={this.toggleOpen}
                >
                    Add Layer
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
                        Add Layer
                    </ModalHeader>
                    <ModalBody>
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Layer Title..."
                            onAcceptValue={(value) => this.setState({title: value})}
                        />
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Layer URL..."
                            onAcceptValue={(value) => this.setState({url: value})}
                        />
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Layer Scope..."
                            onAcceptValue={(value) => this.setState({scope: value})}
                        />
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Layer Source..."
                            onAcceptValue={(value) => this.setState({source: value})}
                        />
                        <TextArea
                            className="mb-3"
                            placeholder="Enter Layer Description..."
                            onAcceptValue={(value) => this.setState({description: value})}
                        />
                        <label>
                            Enter Category ID:{' '}
                            <NumericInput
                                onAcceptValue={(value) => this.setState({categoryId: +value})}
                            />
                        </label>
                        <TextArea
                            className="mb-3"
                            placeholder="Enter Layer Renderer (Optional)..."
                            onAcceptValue={(value) => this.setState({renderer: value})}
                        />
                        <TextArea
                            className="mb-3"
                            placeholder="Enter Layer Filter (Optional)..."
                            onAcceptValue={(value) => this.setState({renderer: value})}
                        />
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

export default AddLayer;
