import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp } from '../constants/student';
import { COLORS } from '../constants/theme';

export function Watermark() {
  const stampText = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{stampText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 99,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
