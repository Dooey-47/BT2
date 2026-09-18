Hệ thống giới thiệu & kinh doanh sản phẩm đặc sản Tây Nguyên, bao gồm giới thiệu chung về văn hóa Tây Nguyên, chi tiết về một vài sản phẩm đặc trưng (cà phê, mật ong rừng,...) và thông tin liên hệ để đặt hàng.

## Chạy website

Dữ liệu sản phẩm nằm trong `data/products.json` và được tải bằng Fetch API. Vì
vậy, hãy chạy website qua một máy chủ HTTP cục bộ thay vì mở trực tiếp file HTML:

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000` trong trình duyệt.