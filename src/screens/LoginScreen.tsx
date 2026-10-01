import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { STUDENT, VARIANT } from '../constants/student';
import { COLORS } from '../constants/theme';
import { Watermark } from '../components/Watermark';

export function LoginScreen() {
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  const isPhone = VARIANT.authField === 'phone';

  const handleLogin = () => {
    if (!inputValue.trim()) {
      Alert.alert(
        'Thông báo',
        `Vui lòng nhập ${isPhone ? 'số điện thoại' : 'email'} của sinh viên (${STUDENT.mssv}).`
      );
      return;
    }
    login(inputValue.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.logo}>KTXGo 🚀</Text>
          <Text style={styles.subtitle}>
            Dịch vụ giao đồ ăn & nhu yếu phẩm KTX
          </Text>
          <Text style={styles.studentInfo}>
            Sinh viên: {STUDENT.hoTen} ({STUDENT.mssv})
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                isPhone ? 'Nhập số điện thoại (vd: 0912345678)' : 'Nhập email sinh viên'
              }
              placeholderTextColor={COLORS.textLight}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Vào cửa hàng</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
