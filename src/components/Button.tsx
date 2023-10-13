import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Button as RNButton, Text } from "native-base"

type Props = {
  text: string;
  type?: "normal" | "outline";
  loading?: boolean;
  disabled?: boolean;
  syyle?: any;
  onPress: () => void;
}

export default function Button({ text, type, loading, disabled, style, onPress }: Props) {
  if (type === "outline") {
    return <RNButton py="4" borderRadius={25} bgColor="#E8F7ED" disabled={disabled || loading} style={[style]} onPress={onPress}>{loading ? <ActivityIndicator color="#2AB858" /> : <Text color="#2AB858" bold fontSize="md">{text}</Text>}</RNButton>
  }
  return (
    <RNButton py="4" borderRadius={25} bgColor={disabled ? "#2A974D" : "#2AB858"} disabled={disabled || loading} style={[style]} w="full" onPress={onPress}>{loading ? <ActivityIndicator color="white" /> : <Text color="white" bold fontSize="md">{text}</Text>}</RNButton>
  )
}