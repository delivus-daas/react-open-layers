import React, {useEffect, useRef} from "react";
import { OverlayProps } from "./overlay.type";
import { Overlay as OlOverlay } from "ol";
import { useMap } from "../Map";

const Overlay = ({ children, coordinate }: OverlayProps) => {
  const map = useMap();
  const childRef = useRef<any>();
  const overleyRef = useRef<OlOverlay>();

  useEffect(() => {
    console.log("overlay", map);
    if (map && !overleyRef.current) {
      overleyRef.current = new OlOverlay({
        element: childRef.current,
      });
      overleyRef.current?.setPosition(coordinate);
      map.addOverlay(overleyRef.current);
      return () => {
        map.removeOverlay(overleyRef.current);
      };
    }
  }, [map]);

  useEffect(() => {
    if (overleyRef.current) {
      overleyRef.current?.setPosition(coordinate);
    }
  }, [coordinate]);

  return (React.cloneElement(children, {
    ref: childRef,
  }));
};

export default Overlay;
