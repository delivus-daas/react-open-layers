import { ReactNode } from "react";
export type OpenLayersProps = {
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    initialCenter?: Array<number>;
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[] | boolean;
    onClickMap?: () => void;
};
