import { ReactNode } from "react";
import { Options } from "ol/style/Style";
import VectorSource from "ol/source/Vector";
export type LayerProps = {
    options?: Options;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};
