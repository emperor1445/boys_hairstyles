import React from "react";
import { Text, TextStyle } from "react-native";

type Props = {
  children: string;
  style?: TextStyle;
};

export default function AppText({ children, style }: Props) {
  return <Text style={style}>{children}</Text>;
}
