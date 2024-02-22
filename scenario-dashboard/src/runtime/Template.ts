import LayerWrapper from "./LayerWrapper";

/**
 * Template is a list of Layers relevant to an emergency. Each Template can have many Layers
 * and each Layer can belong to many Templates.
 */
interface Template {
    id: number // Template ID
    title: string // title of Template
    layerWrappers: LayerWrapper[] // list of LayerWrappers associated with the Template
}

export default Template;
