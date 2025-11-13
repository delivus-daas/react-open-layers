import { PointLayerProps } from "../point/point.type";
import { Feature, Map, MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import { Style } from "ol/style";
import { Options, Options as LayerOptions } from "ol/layer/BaseVector";
import { Options as SourceOptions } from "ol/source/Vector";

export interface LayerProps {
  name?: string;
  map?: Map;
  index?: number;
  visible?: boolean;
  features?: Feature[];
  options?: SourceOptions<any>;
  layerOptions?: LayerOptions<any>;
  clickStyle?: (feature: Feature) => Style
  overStyle?: (feature: Feature) => Style
  style?: (feature: FeatureLike) => Style
  onClick?: (
    selected: FeatureLike,
    deselected: FeatureLike,
    event: MapBrowserEvent<any>
  ) => void;
  onOver?: (
    selected: FeatureLike,
    deselected: FeatureLike,
    event: MapBrowserEvent<any>
  ) => void;
}
