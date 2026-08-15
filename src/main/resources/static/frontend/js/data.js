window.demoServices = [
    { icon: "truck", title: "Giao hàng nhanh", text: "Nội thành nhận hàng trong ngày" },
    { icon: "headphones", title: "Tư vấn chuyên nghiệp", text: "Chọn đúng máy, đúng nhu cầu" },
    { icon: "shield-check", title: "100% chính hãng", text: "Bảo hành rõ ràng, nguồn gốc minh bạch" },
    { icon: "credit-card", title: "Thanh toán linh hoạt", text: "Tiền mặt, thẻ, chuyển khoản" }
];

window.demoCategories = [
    { id: "iphone", name: "iPhone", count: 34, subtitle: "Nhiều ưu đãi cho iPhone 15", type: "phone", theme: "linear-gradient(145deg, #e5ded3, #111)" },
    { id: "ipad", name: "iPad", count: 19, subtitle: "Giảm giá cực sốc", type: "tablet", theme: "linear-gradient(135deg, #fb3aa4, #111 48%, #7c3aed)" },
    { id: "mac", name: "Mac", count: 8, subtitle: "Giá tốt mỗi ngày", type: "laptop", theme: "linear-gradient(135deg, #f97316, #facc15)" },
    { id: "watch", name: "Watch", count: 5, subtitle: "Ưu đãi cực khủng", type: "watch", theme: "linear-gradient(145deg, #0f172a, #2563eb)" },
    { id: "airpods", name: "AirPods", count: 12, subtitle: "Âm thanh chính hãng", type: "earbuds", theme: "linear-gradient(135deg, #e5e7eb, #94a3b8)" },
    { id: "accessory", name: "Phụ kiện", count: 42, subtitle: "Cáp, sạc, ốp lưng", type: "accessory", theme: "linear-gradient(135deg, #16a34a, #0f172a)" }
];

window.demoMenu = [
    { name: "iPhone", children: ["iPhone 15 Series", "iPhone 14 Series", "iPhone 13", "iPhone 12", "iPhone 11"] },
    { name: "iPad", children: ["iPad Pro", "iPad Air", "iPad Gen 10", "iPad Gen 9", "iPad mini"] },
    { name: "Watch", children: ["Apple Watch Ultra", "Apple Watch S9", "Apple Watch SE"] },
    { name: "Mac", children: ["MacBook", "iMac", "Mac mini"] },
    { name: "AirPods", children: ["AirPods Pro", "AirPods 3", "AirPods Max"] },
    { name: "Phụ kiện", children: ["Cốc - Cáp", "Sạc dự phòng", "Bao da - Ốp lưng", "Dán cường lực"] }
];

window.demoProducts = [
    { id: 1, name: "iPad Pro 11 inch M2 2022 2TB Wifi + 5G - Chính hãng VN", price: null, oldPrice: null, discount: null, stock: 8, sold: 5, imageType: "tablet", theme: "linear-gradient(135deg, #0ea5e9, #111 52%, #7c3aed)", category: { name: "iPad" }, brand: { name: "Apple" }, badges: ["Mới"], flags: ["new"], warranty: "Bảo hành chính hãng Apple 12 tháng" },
    { id: 2, name: "iPad Air 5 64GB Wifi - Chính hãng VN", price: 13390000, oldPrice: 16990000, discount: 21, stock: 12, sold: 14, imageType: "tablet", theme: "linear-gradient(135deg, #f472b6, #111 46%, #dc2626)", category: { name: "iPad" }, brand: { name: "Apple" }, badges: ["Mới"], flags: ["new", "featured"], warranty: "Bảo hành chính hãng Apple 12 tháng" },
    { id: 3, name: "iPhone 15 128GB - Chính hãng VN/A", price: 21990000, oldPrice: 24990000, discount: 12, stock: 18, sold: 21, imageType: "phone", theme: "linear-gradient(145deg, #f7e390, #111 52%, #f8fafc)", category: { name: "iPhone" }, brand: { name: "Apple" }, badges: ["Mới", "Nổi bật"], flags: ["new", "featured", "best"], warranty: "Hỗ trợ 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất" },
    { id: 4, name: "iPhone 15 Pro Max 1TB - Chính hãng VN/A", price: 45590000, oldPrice: 49990000, discount: 9, stock: 4, sold: 7, imageType: "phone", theme: "linear-gradient(145deg, #d8d1c4, #111 50%, #777)", category: { name: "iPhone" }, brand: { name: "Apple" }, badges: ["Mới", "Nổi bật"], flags: ["featured", "best"], warranty: "Bảo hành chính hãng Apple 12 tháng" },
    { id: 5, name: "Apple Watch Series 9 GPS 45mm Viền Nhôm Dây Cao Su", price: 10990000, oldPrice: 15990000, discount: 31, stock: 6, sold: 18, imageType: "watch", theme: "linear-gradient(145deg, #111827, #2563eb)", category: { name: "Watch" }, brand: { name: "Apple" }, badges: ["Bán chạy"], flags: ["best"], warranty: "Hỗ trợ 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất" },
    { id: 6, name: "MacBook Air M2 13 inch 256GB - Chính hãng VN", price: 23990000, oldPrice: 27990000, discount: 14, stock: 7, sold: 9, imageType: "laptop", theme: "linear-gradient(135deg, #fb7185, #111 52%, #38bdf8)", category: { name: "Mac" }, brand: { name: "Apple" }, badges: ["Nổi bật"], flags: ["featured"], warranty: "Bảo hành chính hãng Apple 12 tháng" },
    { id: 7, name: "AirPods Pro 2 USB-C chống ồn chủ động", price: 5290000, oldPrice: 6490000, discount: 18, stock: 11, sold: 24, imageType: "earbuds", theme: "linear-gradient(135deg, #ffffff, #cbd5e1)", category: { name: "AirPods" }, brand: { name: "Apple" }, badges: ["Bán chạy"], flags: ["best", "featured"], warranty: "Bảo hành chính hãng Apple 12 tháng" },
    { id: 8, name: "Cốc sạc nhanh USB-C 20W chính hãng", price: 490000, oldPrice: 900000, discount: 46, stock: 0, sold: 17, imageType: "accessory", theme: "linear-gradient(135deg, #f8fafc, #64748b)", category: { name: "Phụ kiện" }, brand: { name: "E-Market" }, badges: ["Bán chạy"], flags: ["best"], warranty: "Bảo hành 12 tháng, đổi mới trong 7 ngày" }
];

window.demoNews = [
    { title: "5 lưu ý khi chọn điện thoại cho công việc", tag: "Tư vấn", date: "14/08/2026" },
    { title: "Nên mua iPad hay laptop mỏng nhẹ?", tag: "So sánh", date: "12/08/2026" },
    { title: "Cách kiểm tra bảo hành thiết bị Apple", tag: "Hướng dẫn", date: "10/08/2026" }
];

window.demoStores = [
    { name: "E-Market Sài Gòn", address: "Tầng 3, 70 Lữ Gia, Quận 11, TP. Hồ Chí Minh" },
    { name: "E-Market Bình Dương", address: "169 Nguyễn Hữu Cảnh, Thủ Dầu Một, Bình Dương" },
    { name: "E-Market Cần Thơ", address: "81 Phan Huy Chú, Ninh Kiều, Cần Thơ" }
];
