import Layer from "esri/layers/Layer";
import Template from "./Template";
import Category from "./Category";

/**
 * LayerWrapper is a wrapper class for Layers. It contains a Layer, the Layer's information,
 * the list of Templates the Layer belongs to, and the Category the Layer belongs to
 */
interface LayerWrapper {
    id: number // the ID of the Layer
    title: string // the title of the Layer
    url: string // the URL of the Layer
    renderer: string // the JSON string containing the renderer of the Layer
    filter: string
    layer: Layer // the Layer
    templates: Template[] // list of associated Templates
    category: Category // Category the Layer belongs to
}

export default LayerWrapper;
