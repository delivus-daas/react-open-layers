import React, { useEffect, useRef } from "react";
import { OverlayProps } from "./overlay.type";
import { Overlay } from "ol";
import { useMap } from "../OpenLayers";

export const CustomOverlay = ({
  children,
  className,
  id,
  position,
  options = { positioning: "center-center" },
}: OverlayProps) => {
  const map = useMap();
  const overleyRef = useRef<Overlay>();
  const element = document.getElementById(id);

  useEffect(() => {
    if (map) {
      if (!overleyRef.current && element) {
        overleyRef.current = new Overlay({
          element,
          ...options,
        });
        map.addOverlay(overleyRef.current);
      }
    }

    return () => {
      map && map.removeOverlay(overleyRef.current);
    };
  }, [map]);

  useEffect(() => {
    overleyRef.current?.setPosition(position);
  }, [position]);

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};
