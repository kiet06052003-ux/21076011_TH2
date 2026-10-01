import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { productApi, Product } from '../services/productApi';
import { STUDENT, DEBOUNCE_MS, STALE_TIME_MS, ROOM_LABEL, VARIANT } from '../constants/student';
import { COLORS } from '../constants/theme';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ProductCard } from '../components/ProductCard';
import { Watermark } from '../components/Watermark';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedValue(searchText, DEBOUNCE_MS);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = (data || []).filter((item) =>
    item.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const renderContent = () => {
    // 1. Loading State
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.stateText}>Đang tải sản phẩm KTXGo...</Text>
          <Text style={styles.studentSubtext}>MSSV: {STUDENT.mssv}</Text>
        </View>
      );
    }

    // 2. Error State
    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Lỗi kết nối mạng!</Text>
          <Text style={styles.errorSubtext}>
            {(error as Error)?.message || 'Không thể lấy dữ liệu sản phẩm.'}
          </Text>
          <Text style={styles.studentSubtext}>MSSV: {STUDENT.mssv} - TH2</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 3. Success / Grid State
    return (
      <FlashList<Product>
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('DetailScreen', { id: String(item.id) })}
          />
        )}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>KTXGo 🛒</Text>
          <Text style={styles.roomBadge}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <View style={styles.studentTag}>
          <Text style={styles.studentTagText}>{STUDENT.mssv}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm sản phẩm (Debounce ${DEBOUNCE_MS}ms)...`}
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.body}>{renderContent()}</View>

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
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  roomBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  },
  studentTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studentTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  body: {
    flex: 1,
  },
  listContent: {
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  studentSubtext: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textLight,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: 6,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
