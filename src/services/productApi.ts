import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

const CATEGORY_MAP: Record<string, string> = {
  "men's clothing": 'Thời trang Nam',
  "women's clothing": 'Thời trang Nữ',
  jewelery: 'Trang sức & Phụ kiện',
  electronics: 'Thiết bị điện tử',
};

const PRODUCT_VI_MAP: Record<
  number,
  { title: string; description: string }
> = {
  1: {
    title: 'Balo Laptop KTX Chống Nước (15 inch)',
    description:
      'Balo đựng laptop tiện lợi cho sinh viên KTX, chất liệu vải chống thấm nước cao cấp, ngăn chứa rộng rãi đựng vừa laptop 15.6 inch cùng sách vở, phụ kiện.',
  },
  2: {
    title: 'Áo Thun Nam Form Slimfit Năng Động',
    description:
      'Áo thun nam chất liệu cotton co giãn 4 chiều, thoáng mát, kiểu dáng ôm nhẹ giúp tôn dáng, thích hợp cho các hoạt động thể thao và đi học KTX.',
  },
  3: {
    title: 'Áo Khoác Cotton Nam Phong Cách KTX',
    description:
      'Áo khoác nam chất liệu cotton dày dặn, giữ ấm tốt trong thời tiết lạnh, thiết kế thời trang hiện đại phù hợp sinh viên.',
  },
  4: {
    title: 'Quần Ka-ki Nam Dáng Ôm Thời Trang',
    description:
      'Quần ka-ki nam kiểu dáng trẻ trung, co giãn nhẹ, phối đồ linh hoạt với áo thun hoặc áo sơ mi.',
  },
  5: {
    title: 'Vòng Tay Bạc Rồng Naga Độc Đáo',
    description:
      'Vòng tay bạc nguyên chất chạm khắc hình rồng Naga tinh xảo, phụ kiện sang trọng thể hiện cá tính riêng.',
  },
  6: {
    title: 'Nhẫn Vàng Nữ Điểm Kim Cương Nhỏ',
    description:
      'Nhẫn nữ làm từ vàng 14k đính kim cương nhân tạo lấp lánh, thiết kế mảnh mai thanh lịch.',
  },
  7: {
    title: 'Nhẫn Bạch Kim Công Chúa Sang Trọng',
    description:
      'Nhẫn mạ bạch kim đính đá CZ phong cách công quý phái, chất liệu không gỉ, giữ màu lâu bền.',
  },
  8: {
    title: 'Khuyên Tai Thép Mạ Vàng Hồng Thẩm Mỹ',
    description:
      'Bộ khuyên tai thép không gỉ mạ vàng hồng cao cấp, kiểu dáng hiện đại, an toàn không gây kích ứng da.',
  },
  9: {
    title: 'Ổ Cứng Di Động WD Elements 2TB USB 3.0',
    description:
      'Ổ cứng di động dung lượng lớn 2TB, chuẩn kết nối USB 3.0 truyền tải dữ liệu cực nhanh, bảo lưu tài liệu học tập KTX an toàn.',
  },
  10: {
    title: 'Ổ Cứng SSD SanDisk PLUS 1TB SATA III',
    description:
      'Ổ cứng SSD SanDisk 1TB tăng tốc độ khởi động máy tính và load phần mềm gấp 20 lần so với ổ HDD truyền thống.',
  },
  11: {
    title: 'Ổ Cứng SSD Silicon Power 256GB 3D NAND',
    description:
      'Ổ cứng SSD 256GB chuẩn SATA III 2.5 inch, giải pháp nâng cấp tốc độ máy tính giá tiết kiệm cho sinh viên.',
  },
  12: {
    title: 'Ổ Cứng Di Động WD 4TB Gaming Chuyên Game',
    description:
      'Ổ cứng di động 4TB chuyên dụng lưu trữ game dung lượng lớn cho PS4/PC, tốc độ xử lý ổn định mượt mà.',
  },
  13: {
    title: 'Màn Hình Acer 21.5 inch Full HD IPS Siêu Mỏng',
    description:
      'Màn hình máy tính Acer 21.5 inch tấm nền IPS chống chói, độ phân giải Full HD (1920x1080) sắc nét, góc nhìn rộng 178 độ.',
  },
  14: {
    title: 'Màn Hình Cong Samsung 49 inch 144Hz QLED Ultrawide',
    description:
      'Màn hình cong siêu rộng 49 inch tần số quét 144Hz, công nghệ QLED rực rỡ, thích hợp cho lập trình viên và game thủ.',
  },
  15: {
    title: 'Áo Khoác Gió Nữ 3 Trong 1 Chống Lạnh KTX',
    description:
      'Áo khoác gió nữ thiết kế 3 trong 1 chống thấm nước, chống gió lạnh hiệu quả, kèm lót nỉ ấm áp có thể tháo rời.',
  },
  16: {
    title: 'Áo Khoác Da Nữ Có Nón Thời Trang Biker',
    description:
      'Áo khoác da PU nữ phong cách Biker năng động, kèm nón trùm đầu tháo rời tiện lợi khi đi xe máy.',
  },
  17: {
    title: 'Áo Mưa Gió Nữ Kẻ Sọc Đi Học KTX',
    description:
      'Áo mưa gió nữ họa tiết kẻ sọc cá tính, chất liệu trượt nước cao cấp nhẹ nhàng dễ gấp gọn mang đi học.',
  },
  18: {
    title: 'Áo Thun Nữ Cổ V Mềm Mại Năng Động',
    description:
      'Áo thun nữ cổ V tôn dáng, chất vải thun co giãn thoáng mát, thích hợp mặc thường ngày tại ký túc xá.',
  },
  19: {
    title: 'Áo Thể Thao Nữ Thấm Hút Mồ Hôi Fast-Dry',
    description:
      'Áo thun thể thao nữ công nghệ Fast-Dry khô nhanh, thoáng khí, lý tưởng cho các hoạt động tập luyện và chạy bộ.',
  },
  20: {
    title: 'Áo Thun Cotton Nữ Phong Cách Thường Ngày',
    description:
      'Áo thun cotton nữ form rộng thoải mái, chất liệu tự nhiên mềm mại, dễ dàng phối hợp cùng quần jeans hay chân váy.',
  },
};

export function localizeProduct(product: Product): Product {
  const categoryVi = CATEGORY_MAP[product.category?.toLowerCase()] || product.category;
  const itemVi = PRODUCT_VI_MAP[product.id];

  return {
    ...product,
    category: categoryVi,
    title: itemVi ? itemVi.title : product.title,
    description: itemVi ? itemVi.description : product.description,
  };
}

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products?limit=12');
    return response.data.map(localizeProduct);
  },

  getProductById: async (id: string | number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return localizeProduct(response.data);
  },
};
