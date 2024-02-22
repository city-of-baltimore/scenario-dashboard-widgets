import {Button, TextInput, TextArea, Modal, ModalHeader, ModalBody, ModalFooter, NumericInput} from 'jimu-ui'
import React, { Component } from 'react'

interface AddCategoryProps {
    addCategory: (title: string) => any
}

interface AddCategoryState {
    title: string
    open: boolean
}

/**
 * AddLayer allows users to add a Layer to the database
 */
class AddCategory extends Component<AddCategoryProps, AddCategoryState> {

    constructor(props: any) {
        super(props);
        this.state = {
            title: null,
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
        this.props.addCategory(this.state.title);
        this.toggleOpen();
    }

    render() {
        return (
            <div>
                <Button
                    onClick={this.toggleOpen}
                >
                    Add Category
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
                        Add Category
                    </ModalHeader>
                    <ModalBody>
                        <TextInput
                            className="mb-3"
                            placeholder="Enter Category Title..."
                            onAcceptValue={(value) => this.setState({title: value})}
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

export default AddCategory;
