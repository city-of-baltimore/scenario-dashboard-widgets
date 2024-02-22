import LayerWrapper from "./LayerWrapper";

/**
 * Category is a group of Layers.
 * Each Category can have many Layers but each Layer can only belong to 1 Category.
 */
interface Category {
    id: number // Category ID
    title: string // title of Category
    layerWrappers: LayerWrapper[] // list of LayerWrappers associated with the Category
}

export default Category;
