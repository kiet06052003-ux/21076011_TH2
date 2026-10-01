import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useCartStore } from '../stores/cartStore';
import { STUDENT, ROOM_LABEL, VARIANT } from '../constants/student';
import { COLORS, SHADOWS } from '../constants/theme';
import { useCampusLocation } from '../hooks/useCampusLocation';
import { Watermark } from '../components/Watermark';

export function CartScreen() {
  const { items, changeQty, removeItem, clearCart, getTotalAmount, getTotalQuantity } = useCartStore();
  const { shipFee, status: locationStatus, distanceKm } = useCampusLocation();

  const subtotal = getTotalAmount();
  const totalQuantity = getTotalQuantity();
  const actualShipFee = subtotal > 0 ? shipFee : 0;
  const grandTotal = subtotal + actualShipFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    Alert.alert(
      'Đặt hàng thành công 🚀',
      `Đơn hàng của ${STUDENT.hoTen} (${STUDENT.mssv}) đã được gửi!\n` +
        `Nơi giao: ${ROOM_LABEL}\n` +
        `Tổng thanh toán: ${grandTotal.toLocaleString('vi-VN')} đ`,
      [
        {
          text: 'Đồng ý',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng KTX 🛒</Text>
        <Text style={styles.roomTag}>Giao tận: {ROOM_LABEL}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng trống!</Text>
          <Text style={styles.emptySubtext}>
            Chưa có sản phẩm nào trong giỏ. Vui lòng quay lại Cửa hàng để chọn mua.
          </Text>
          <Text style={styles.studentSubtext}>MSSV: {STUDENT.mssv}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={items}
            keyExtractor={(item) => `cart-${STUDENT.mssv}-${item.id}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.unitPrice.toLocaleString('vi-VN')} đ
                  </Text>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => changeQty(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => changeQty(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phòng giao nhận:</Text>
              <Text style={styles.summaryValueHighlight}>{ROOM_LABEL}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền hàng ({totalQuantity} món):</Text>
              <Text style={styles.summaryValue}>{subtotal.toLocaleString('vi-VN')} đ</Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.shipLabelContainer}>
                <Text style={styles.summaryLabel}>Phí vận chuyển (Phí B):</Text>
                {distanceKm !== null && (
                  <Text style={styles.distanceBadge}>{distanceKm} km</Text>
                )}
              </View>
              <Text style={styles.summaryValueSecondary}>
                {actualShipFee.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{grandTotal.toLocaleString('vi-VN')} đ</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutButtonText}>
                Xác nhận đặt hàng ({grandTotal.toLocaleString('vi-VN')} đ)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  roomTag: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  shipLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceBadge: {
    marginLeft: 6,
    fontSize: 11,
    color: COLORS.secondary,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
  summaryValueSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  studentSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
