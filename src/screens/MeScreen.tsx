import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { STUDENT, examStamp, BASE_SHIP_FEE, ROOM_LABEL, VARIANT } from '../constants/student';
import { COLORS, SHADOWS } from '../constants/theme';
import { useAuthStore } from '../stores/authStore';
import { useCampusLocation, CAMPUS_GATE } from '../hooks/useCampusLocation';
import { Watermark } from '../components/Watermark';

export function MeScreen() {
  const { token, authInput, logout } = useAuthStore();
  const {
    status: locationStatus,
    location,
    distanceKm,
    shipFee,
    requestPermissionAndFetchLocation,
    openDeviceSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const renderLocationStatusBadge = () => {
    switch (locationStatus) {
      case 'granted':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.statusBadgeText, { color: COLORS.success }]}>
              ✓ Đã cấp quyền
            </Text>
          </View>
        );
      case 'denied':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.statusBadgeText, { color: '#D97706' }]}>
              ⚠️ Bị từ chối
            </Text>
          </View>
        );
      case 'blocked':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statusBadgeText, { color: COLORS.error }]}>
              🚫 Bị khóa
            </Text>
          </View>
        );
      case 'idle':
      case 'loading':
      default:
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.statusBadgeText, { color: COLORS.textLight }]}>
              ⏳ Đang kiểm tra...
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân 👤</Text>
        <Text style={styles.stampBadge}>#{examStamp()}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {STUDENT.hoTen.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
              <Text style={styles.studentMssv}>MSSV: {STUDENT.mssv}</Text>
              <Text style={styles.roomText}>Phòng giao mặc định: {ROOM_LABEL}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Xác thực:</Text>
            <Text style={styles.infoValue}>{authInput || 'Đã đăng nhập'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Auth Token:</Text>
            <Text style={styles.tokenValue} numberOfLines={1} ellipsizeMode="middle">
              {token}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã Exam Stamp:</Text>
            <Text style={styles.stampValue}>#{examStamp()}</Text>
          </View>
        </View>

        {/* Location & Haversine Ship Fee Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📍 Vị trí & Phí Ship</Text>
            {renderLocationStatusBadge()}
          </View>

          <View style={styles.locationDetails}>
            <Text style={styles.detailLabel}>
              Cổng KTX cố định: {CAMPUS_GATE.latitude}, {CAMPUS_GATE.longitude}
            </Text>

            {location ? (
              <View style={styles.coordsBox}>
                <Text style={styles.coordsText}>
                  Tọa độ thiết bị: Lat {location.latitude.toFixed(4)}, Lon {location.longitude.toFixed(4)}
                </Text>
                <Text style={styles.distanceText}>
                  Khoảng cách Haversine: <Text style={styles.highlightText}>{distanceKm} km</Text>
                </Text>
              </View>
            ) : (
              <Text style={styles.noCoordsText}>
                {locationStatus === 'blocked'
                  ? 'Quyền vị trí bị khóa trong cài đặt thiết bị.'
                  : 'Chưa có dữ liệu vị trí.'}
              </Text>
            )}

            <View style={styles.feeBox}>
              <Text style={styles.feeTitle}>Công thức tính phí ship B:</Text>
              <Text style={styles.feeFormula}>
                Phí cơ bản {BASE_SHIP_FEE.toLocaleString('vi-VN')}đ + Math.round km * 1500 + 2000đ
              </Text>
              <Text style={styles.calculatedFee}>
                Tạm tính phí ship: {shipFee.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>

          {/* Action buttons based on location status */}
          <View style={styles.locationActionRow}>
            {locationStatus === 'blocked' ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.settingsButton]}
                onPress={openDeviceSettings}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>⚙️ Mở Cài Đặt</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.refreshLocButton]}
                onPress={requestPermissionAndFetchLocation}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>🔄 Cập nhật vị trí</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Variant Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Thông tin Biến thể</Text>
          <View style={styles.divider} />
          <Text style={styles.variantItem}>• Chữ số cuối MSSV: {STUDENT.mssv.slice(-1)}</Text>
          <Text style={styles.variantItem}>• Ô Đăng nhập: {VARIANT.authField.toUpperCase()}</Text>
          <Text style={styles.variantItem}>• Thứ tự Tab: {VARIANT.tabOrder}</Text>
          <Text style={styles.variantItem}>• Haptic khi thêm: {VARIANT.hapticOnAdd}</Text>
          <Text style={styles.variantItem}>• Công thức Ship: {VARIANT.shipFormula}</Text>
          <Text style={styles.variantItem}>• Presentation Detail: {VARIANT.detailPresentation}</Text>
          <Text style={styles.variantItem}>• Vị trí Watermark: {VARIANT.watermarkAtTop ? 'Trên' : 'Dưới'}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stampBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  profileTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  studentMssv: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 2,
  },
  roomText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: COLORS.primary,
    maxWidth: '65%',
  },
  stampValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  locationDetails: {
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  coordsBox: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  coordsText: {
    fontSize: 12,
    color: COLORS.text,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  noCoordsText: {
    fontSize: 13,
    color: COLORS.error,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  feeBox: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  feeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  feeFormula: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  calculatedFee: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 6,
  },
  locationActionRow: {
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshLocButton: {
    backgroundColor: COLORS.primary,
  },
  settingsButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  variantItem: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
