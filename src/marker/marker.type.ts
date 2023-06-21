import { ReactElement } from "react";

export type MarkerProps = {
  onClick?: (item: number) => void;
  onMouseOver?: (item: number) => void;
  onMouseOut?: (item: number) => void;
};
