import React, { Component } from "react";
import { Button, Icon, Link, Modal, ModalBody, ModalHeader, ModalFooter } from 'jimu-ui';

interface ExportCSVComponentProps {
  status: string // the current export status
  onExportData: () => any // handles the export job
}

interface ExportCSVComponentState {
  modalOpen: boolean // whether the modal is open
}

/**
 * ExportCSVComponent creates a link and modal for users to export data
 */
class ExportCSVComponent extends Component<ExportCSVComponentProps, ExportCSVComponentState> {

  constructor(props: any) {
    super(props);
    this.state = {
      modalOpen: false
    }
  }

  statuses = {
    "Initiated": {
        text: "Waiting for export",
        icon: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/clock-24.svg"
    },
    "Re-checking": {
        text: "Export still in progress - Re-checking",
        icon: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/clock-forward-24.svg"
    },
    "Completed": {
        text: "Export Done!",
        icon: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/check-circle-24-f.svg"
    },
    "Failed": {
        text: "Export failed",
        icon: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/exclamation-mark-circle-24-f.svg"
    },
    "Canceled": {
        text: "Export canceled",
        icon: "https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/circle-disallowed-24.svg"
    }
  }

  /**
   * Checks for status and returns text if status exists
   * @returns String
   */
  statusMessage = () => {
    let status = this.statuses[this.props.status];
    if (status){
        return status.text;    
    }
  }

  /**
   * Checks for status and returns url of icon if status exists
   * @returns String
   */
  statusIcon = () => {
    let status = this.statuses[this.props.status];
    if (status){
        return status.icon;    
    }
  }

  onClosed = () => {
    // Close the modal when the 'Cancel' button is clicked
    // Note: Use this.setState to update the state
    this.setState({ modalOpen: false });
  }

  /**
   * Trigger export data in widget
   */
  onExportData = () => {
    // Open the modal when export is triggered
    // Note: Use this.setState to update the state
    this.setState({ modalOpen: true });
    this.props.onExportData();
  }

  render() {
    return (
      <div id="export">
        <div id="export-link">
          <Link
            id="layer-export-button"
            onClick={this.onExportData}
          >
            <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/download-to-24.svg"></Icon>
            Export layers as csv
          </Link>
        </div>
        <div id="export-modal">
          <Modal
            isOpen={this.state.modalOpen}
            toggle={this.onClosed} // Use onClosed to toggle the modal
            className="export-status-modal"
          >
            <ModalHeader toggle={this.onClosed}>
              Export Status
            </ModalHeader>
            <ModalBody>
              <div className="export-status-message">
                <Icon icon={this.statusIcon()}></Icon> {this.statusMessage()}
                { (this.props.downloadLink && this.props.downloadLink.length > 0) &&
                  <div class="export-download-link">
                       <Link
                      to={this.props.downloadLink}
                      target="_blank"
                      >
                        Download csv 
                        <Icon icon="https://raw.githubusercontent.com/Esri/calcite-ui-icons/master/icons/arrow-circle-down-24.svg"></Icon>
                      </Link>
                      <p>If item does not exist or is inaccessible, try link again.</p>
                  </div>
                    }
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={this.onClosed}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ExportCSVComponent;