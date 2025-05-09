import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../utils/colors";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.deepPurple,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
