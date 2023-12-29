import React, { useEffect, useRef } from "react";
import { ControlProps } from "./control.type";
import { useMap } from "../OpenLayers";
import { Control } from "ol/control";

export const Controller = ({
  id,
  children,
  className,
  options = {},
}: ControlProps) => {
  const map = useMap();
  const controlRef = useRef<Control>();
  const element = document.getElementById(id);

  useEffect(() => {
    if (map) {
      if (!controlRef.current && element) {
        controlRef.current = new Control({
          element,
          ...options,
        });
        map.addControl(controlRef.current);
      }
    }
    return () => {
      map && map.removeControl(controlRef.current);
    };
  }, [map]);

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};
