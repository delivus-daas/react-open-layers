import { PointLayerProps } from "../point/point.type";
import { Feature, Map } from "ol";
import { FeatureLike } from "ol/Feature";
import { Style } from "ol/style";
import { Options as SourceOptions } from "ol/source/Vector";
import { Options as LayerOptions } from "ol/layer/BaseVector";
export interface LayerProps extends PointLayerProps {
    name?: string;
    map: Map;
    index?: number;
    visible?: boolean;
    options?: SourceOptions<any>;
    layerOptions?: LayerOptions<any>;
    clickStyle?: (feature: Feature) => Style;
    overStyle?: (feature: Feature) => Style;
    style?: (feature: FeatureLike) => Style;
}
