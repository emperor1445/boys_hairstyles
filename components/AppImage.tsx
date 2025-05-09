import React from "react";
import { Image, ImageStyle } from "react-native";

type Props = {
  source: any;
  style?: ImageStyle;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
};

export default function AppImage({ source, style, resizeMode = "cover" }: Props) {
  return <Image source={source} style={style} resizeMode={resizeMode} />;
}
