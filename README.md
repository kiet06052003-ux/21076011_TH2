Họ tên: LE TUAN KIET | MSSV: 21076011 | HTTPS URL: https://github.com/21076011/21076011_TH2.git | Stamp: #966883 | Số cuối: 1 | VARIANT: Watermark Dưới, Login phone, Tab Shop->Giỏ->Tôi, Haptic selection, Phí B, Detail card

# KTXGo - Ứng dụng Giao đồ KTX (Thi Thực Hành 2)

**Sinh viên:** LE TUAN KIET  
**MSSV:** 21076011  
**Mã Stamp:** #966883  
**Dòng Định Danh:** `TH2 · 21076011 · LE TUAN KIET · #966883`

---

## 📌 Bảng Biến Thể Chi Tiết (Chữ số cuối MSSV: 1)

| Tiêu chí | Cấu hình cho MSSV 21076011 (Số cuối: 1) |
|---|---|
| **Vị trí Watermark** | Dưới (`watermarkAtTop: false`) |
| **Ô Đăng nhập** | Số điện thoại (`authField: 'phone'`) |
| **Thứ tự Tab** | Cửa hàng → Giỏ hàng → Tôi (`tabOrder: 'shopFirst'`) |
| **Haptic Feedback** | Selection (`hapticOnAdd: 'selection'`) |
| **Công thức Phí Ship** | Công thức B (`shipFormula: 'B'`) |
| **Giao diện Chi tiết** | Card / Stack Push (`detailPresentation: 'card'`) |

---

## 🛠️ Tham Số Định Danh Sinh Viên (`student.ts`)

- `DEBOUNCE_MS`: `400ms` (`300 + (11 % 5) * 100`)
- `STALE_TIME_MS`: `21000ms` (`10000 + (11 % 20) * 1000`)
- `PRICE_MULTIPLIER`: `20500` (`15000 + (11 % 40) * 500`)
- `BASE_SHIP_FEE`: `9000` (`8000 + (11 % 10) * 1000`)
- `ROOM_LABEL`: `P.111` (`100 + (11 % 400)`)
- `BANNER_IMAGE_ID`: `211` (`200 + (11 % 150)`)

---

## 🚀 Tính Năng Đã Hoàn Thành

1. **Câu 1: Navigation + Định danh (3 điểm)**
   - Khởi tạo React Native CLI với TypeScript.
   - Thư mục `KTXGo_21076011` & `package.json` name `ktxgo-21076011`.
   - Cấu hình alias `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`.
   - `student.ts` với seed, VARIANT, và hàm `examStamp()` mã hóa `TH2|21076011|LE TUAN KIET`.
   - Navigation: `RootNavigator` -> `AuthStack` (Login) -> `MainTabs` (Shop, Cart, Me) + `ShopStack` (Home, Detail).
   - Badge tổng số lượng trên Tab Giỏ (ẩn khi = 0).
   - Watermark hiển thị chuẩn `TH2 · 21076011 · LE TUAN KIET · #966883`.

2. **Câu 2: FlashList + React Query (3 điểm)**
   - `FlashList` 2 cột (`numColumns={2}`), `estimatedItemSize={230}`, `keyExtractor` dạng `${STUDENT.mssv}-${item.id}`.
   - Component `ProductCard` bọc lưới Flexbox responsive.
   - `useDebouncedValue` hoãn filter ô tìm kiếm theo đúng `DEBOUNCE_MS` (400ms).
   - Axios instance với Interceptor tự động gắn header `X-Student-Id: 21076011`.
   - React Query handling 3 trạng thái mạng: Đang tải (Loading), Lỗi mạng (Error + MSSV + Thử lại), Có dữ liệu + Pull-to-refresh.

3. **Câu 3: Zustand + Location/Haptic (4 điểm)**
   - `cartStore` Zustand có `addItem`, `removeItem`, `changeQty`, `clearCart`, `getTotalQuantity`, `getTotalAmount`.
   - Persist với `AsyncStorage`, key `ktxgo-cart-21076011`.
   - Haptic feedback theo `VARIANT.hapticOnAdd` ('selection').
   - `useCampusLocation` hook xử lý 3 nhánh quyền: `granted`, `denied`, `blocked` (chuyển sang `Linking.openSettings()`).
   - Khoảng cách Haversine từ thiết bị tới Cổng KTX cố định (`10.8700, 106.8030`).
   - Phí ship tính theo Công thức B: `BASE_SHIP_FEE + Math.round(km * 1500) + 2000`.

---

## 📷 Screenshots Minh Họa

![Home Screenshot](docs/screenshot-th2-home.png)
![Cart Screenshot](docs/screenshot-th2-cart.png)
