import "./Widget.scss";
import React, {Component} from "react";
import {type AllWidgetProps} from 'jimu-core';
import {addFeatures, deleteFeatures} from '@esri/arcgis-rest-feature-layer';
import FeatureLayer from "esri/layers/FeatureLayer";
import AddLayer from "./AddLayer";
import DeleteLayer from "./DeleteLayer";
import DeleteTemplate from "./DeleteTemplate";
import AddCategory from "./AddCategory";
import DeleteCategory from "./DeleteCategory";
import OAuthInfo from "esri/identity/OAuthInfo";
import esriId from "esri/identity/IdentityManager";
import ReactGA from "react-ga4";

/**
 * This widget allows users to update the database for the Scenario dashboard by adding Layers,
 * deleting Layers, and deleting Templates. Add Template functionality is in the Scenario dashboard itself.
 */
class Widget extends Component<AllWidgetProps<any>, {}> {

    private templateTable: FeatureLayer;
    private layerTable: FeatureLayer;
    private categoryTable: FeatureLayer;
    private templateLayerRelationships: FeatureLayer;

    componentDidMount() {
        try {
            ReactGA.initialize([{
                "trackingId": this.props.config.googleAnalyticsId
            }]);
            this.templateTable = new FeatureLayer({url: this.props.config.templateTableUrl});
            this.layerTable = new FeatureLayer({url: this.props.config.layerTableUrl});
            this.categoryTable = new FeatureLayer({url: this.props.config.categoryTableUrl});
            this.templateLayerRelationships = new FeatureLayer({url: this.props.config.templateLayerRelationshipsUrl});
        } catch (e) {
            // Stop execution of further methods because other functionalities unlikely to work if app failed
            // to connect to one or more tables.
            console.error(e);
            alert("Error connecting to database, please try again!");
            return;
        }
    }

    /**
     * Adds a Layer with the given information to the database
     * @param title the Layer title
     * @param url the Layer URL
     * @param scope the Layer scope
     * @param source the Layer source
     * @param description a description of the Lyaer
     * @param categoryId the ID of the associated Category
     * @param renderer a JSON string representing a Renderer
     * @param filter a string representing a SQL filter
     */
    addLayer = async (title: string, url: string, scope: string, source: string,
                      description: string, categoryId: number, renderer?: string, filter?: string) => {
        ReactGA.event({
            category: "scenario_navigation",
            action: "layer_added",
            label: "category_title"
            value: title
        });
        try {
            let attributes = {
                TITLE: title,
                URL: url,
                SCOPE: scope,
                SOURCE: source,
                DESCRIPTION: description,
                CATEGORYID: categoryId,
                RENDERER: renderer ? renderer : undefined,
                FILTER: filter ? filter : undefined
            }
            let response = await addFeatures({
                url: this.props.config.layerTableUrl,
                features: [{attributes: attributes}],
                params: {
                    token: await this.getToken()
                }
            });

            if (!response.addResults[0]?.success) {
                // @ts-ignore
                throw new Error(response.addResults[0]?.error);
            }
            alert("Successfully added layer!");
        } catch (e) {
            console.error(e);
            alert("Error adding layer, please try again!");
        }
    }

    /**
     * Deletes the given Layer from the database
     * @param id the ID of the Layer to delete
     */
    deleteLayer = async (id: number) => {
        try {
            let featureSet = await this.templateLayerRelationships.queryFeatures({
                where: "LAYERID = '" + id + "'",
                outFields: ["OBJECTID"]
            })

            let ids: number[] = [];
            for (let f of featureSet.features) {
                ids.push(f.attributes.OBJECTID);
            }

            if (ids.length > 0) {
                let response = await deleteFeatures({
                    url: this.props.config.templateLayerRelationshipsUrl,
                    objectIds: ids,
                    params: {
                        token: await this.getToken()
                    }
                });

                if (!response.deleteResults[0]?.success) {
                    alert("Error deleting template layer relationships, please try again!");
                    // @ts-ignore
                    throw new Error(response.deleteResults[0]?.error);
                }

                response = await deleteFeatures({
                    url: this.props.config.layerTableUrl,
                    objectIds: [id],
                    params: {
                        token: await this.getToken()
                    }
                });

                if (!response.deleteResults[0]?.success) {
                    // @ts-ignore
                    throw new Error(response.deleteResults[0]?.error);
                }
                alert("Successfully deleted layer!");
            } else {
                alert("Error, a layer with this OBJECTID does not exist!");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting layer, please try again!");
        }
    }

    /**
     * Deletes the given Template from the database
     * @param id the ID of the Template to delete
     */
    deleteTemplate = async (id: number) => {
        try {
            let featureSet = await this.templateLayerRelationships.queryFeatures({
                where: "TEMPLATEID = '" + id + "'",
                outFields: ["OBJECTID"]
            })

            let ids: number[] = [];
            for (let f of featureSet.features) {
                ids.push(f.attributes.OBJECTID);
            }

            if (ids.length > 0) {
                let response = await deleteFeatures({
                    url: this.props.config.templateLayerRelationshipsUrl,
                    objectIds: ids,
                    params: {
                        token: await this.getToken()
                    }
                });

                if (!response.deleteResults[0]?.success) {
                    alert("Error deleting template layer relationships, please try again!");
                    // @ts-ignore
                    throw new Error(response.deleteResults[0]?.error);
                }

                response = await deleteFeatures({
                    url: this.props.config.templateTableUrl,
                    objectIds: [id],
                    params: {
                        token: await this.getToken()
                    }
                });

                if (!response.deleteResults[0]?.success) {
                    // @ts-ignore
                    throw new Error(response.deleteResults[0]?.error);
                }
                alert("Successfully deleted template!");
            } else {
                alert("Error, a template with this OBJECTID does not exist!");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting template, please try again!");
        }
    }

    addCategory = async (title: string) => {
        try {
            let response = await addFeatures({
                url: this.props.config.categoryTableUrl,
                features: [{
                    attributes: {
                        TITLE: title
                    }
                }],
                params: {
                    token: await this.getToken()
                }
            });

            if (!response.addResults[0]?.success) {
                // @ts-ignore
                throw new Error(response.addResults[0]?.error);
            }
            alert("Successfully added category!");
        } catch (e) {
            console.error(e);
            alert("Error adding layer, please try again!");
        }
    }


    /**
     * Deletes the given Layer from the database
     * @param id the ID of the Layer to delete
     */
    deleteCategory = async (id: number) => {
        try {
            let response = await deleteFeatures({
                url: this.props.config.categoryTableUrl,
                objectIds: [id],
                params: {
                    token: this.getToken()
                }
            });
            if (!response.deleteResults[0]?.success) {
                // @ts-ignore
                throw new Error(response.deleteResults[0]?.error);
            }
            alert("Successfully deleted category!");
        } catch (e) {
            console.error(e);
            alert("Error deleting category, please try again!");
        }
    }

    /**
     * Returns a token using user-provided login info that can be used to access ArcGIS services
     * @return a token generated using the user-provided Credential info
     */
    getToken = async () => {
        const info = new OAuthInfo({
            appId: this.props.config.appId,
            flowType: "auto",
            popup: false
        });
        esriId.registerOAuthInfos([info]);

        let credential = await esriId.checkSignInStatus(info.portalUrl + "/sharing");
        if (!credential) {
            credential = await esriId.getCredential(info.portalUrl + "/sharing");
        }
        return credential.token;
    }

    render() {
        return (
            <div id="actions">
                <AddLayer addLayer={this.addLayer}/>
                <DeleteLayer deleteLayer={this.deleteLayer}/>
                <DeleteTemplate deleteTemplate={this.deleteTemplate}/>
                <AddCategory addCategory={this.addCategory}/>
                <DeleteCategory deleteCategory={this.deleteCategory}/>
            </div>
        );
    }
}

export default Widget;
