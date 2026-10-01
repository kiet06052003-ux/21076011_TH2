import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Product } from '../services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '../constants/student';
import { COLORS, SHADOWS } from '../constants/theme';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const formattedPrice = (Math.round(product.price * PRICE_MULTIPLIER)).toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = () => {
    // Haptic feedback according to VARIANT
    if (VARIANT.hapticOnAdd === 'impact') {
      Vibration.vibrate(80);
    } else {
      Vibration.vibrate(40);
    }
    addItem(product);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardBody} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {product.category}
          </Text>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddToCart}
        activeOpacity={0.7}
        accessibilityLabel="Thêm vào giỏ"
      >
        <Text style={styles.addButtonText}>🛒 Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    margin: 6,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  cardBody: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#FFFFFF',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    height: 34,
  },
  category: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
