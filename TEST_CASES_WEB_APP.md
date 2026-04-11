# FarmShop - Master Test Cases

## 1) Scope

Bộ test case này bao phủ:

- Frontend web (React + Vite)
- Backend API (Express + MongoDB)
- Realtime chat (Socket)
- Vai trò User, Seller, Admin
- Thanh toán (COD, Stripe, PayPal)
- Bảo mật, hiệu năng, responsive, accessibility

## 2) Test Data Chuẩn Bị

- 01 user mới chưa kích hoạt email
- 01 user đã kích hoạt
- 01 seller đã duyệt
- 01 seller chưa duyệt
- 01 admin
- 03 sản phẩm: còn hàng, hết hàng, giảm giá
- 01 event đang chạy, 01 event đã hết hạn
- 01 coupon hợp lệ, 01 coupon hết hạn, 01 coupon sai shop
- 01 đơn trạng thái: pending, paid, shipped, delivered, refund-requested, refunded

## 3) Test Cases

Format:

- TC-ID | Module | Scenario | Steps ngắn gọn | Expected | Priority

### A. Smoke & Core Navigation

- TC-SM-001 | App Launch | Mở trang chủ | Open URL root | Trang tải thành công, không crash | P0
- TC-SM-002 | Routing | Điều hướng menu chính | Click từng menu Navbar | Đúng route, không 404 | P0
- TC-SM-003 | Header | Search box hiển thị | Mở home desktop | Search input hiển thị đúng | P1
- TC-SM-004 | Footer | Footer hiển thị | Scroll cuối trang | Footer hiển thị đủ thông tin | P2
- TC-SM-005 | Static Assets | CSS load đúng | Hard refresh Ctrl+F5 | Không mất style, không layout vỡ | P0
- TC-SM-006 | Script Errors | Không có lỗi JS nghiêm trọng | Mở console browser | Không có uncaught error | P0
- TC-SM-007 | API Health | API trả phản hồi | Call endpoint test/health | Status 200 | P0
- TC-SM-008 | Build Artifact | Build production | npm run build frontend | Build thành công | P0
- TC-SM-009 | SPA Refresh | Refresh ở route con | Open route /products rồi refresh | Không 404 server, app vẫn chạy | P0
- TC-SM-010 | Unknown Route | Route không tồn tại | Open route random | Hiển thị fallback hợp lệ | P2

### B. User Authentication

- TC-UA-001 | Signup | Đăng ký user hợp lệ | Nhập đủ fields hợp lệ | Tạo user thành công, gửi email kích hoạt | P0
- TC-UA-002 | Signup | Thiếu field bắt buộc | Bỏ trống email/password | Hiện lỗi validation | P0
- TC-UA-003 | Signup | Email sai format | Nhập abc@ | Bị chặn, báo lỗi | P0
- TC-UA-004 | Signup | Password yếu | Nhập pass quá ngắn | Bị chặn theo policy | P1
- TC-UA-005 | Signup | Trùng email | Đăng ký email đã tồn tại | Báo lỗi duplicate | P0
- TC-UA-006 | Activation | Kích hoạt tài khoản hợp lệ | Mở link activation | Account active thành công | P0
- TC-UA-007 | Activation | Token kích hoạt hết hạn | Dùng token cũ | Báo token invalid/expired | P1
- TC-UA-008 | Login | Login đúng thông tin | Email + password đúng | Đăng nhập thành công | P0
- TC-UA-009 | Login | Sai password | Email đúng, pass sai | Báo lỗi auth | P0
- TC-UA-010 | Login | Account chưa kích hoạt | Login user chưa active | Bị chặn login | P1
- TC-UA-011 | Forgot Password | Gửi email reset | Nhập email hợp lệ | Gửi mail reset thành công | P0
- TC-UA-012 | Forgot Password | Email không tồn tại | Nhập email lạ | Trả về thông báo an toàn | P1
- TC-UA-013 | Reset Password | Token hợp lệ | Mở link reset và đổi pass | Đổi pass thành công | P0
- TC-UA-014 | Reset Password | Token hết hạn | Dùng token cũ | Báo token hết hạn | P1
- TC-UA-015 | Logout | Đăng xuất | Click logout | Session/cookie bị xóa | P0

### C. User Profile & Address

- TC-UP-001 | Profile | Xem thông tin profile | Vào trang profile | Hiển thị đúng thông tin user | P1
- TC-UP-002 | Profile Edit | Cập nhật tên/sdt | Update profile field | Lưu thành công, dữ liệu mới hiển thị | P1
- TC-UP-003 | Avatar | Upload avatar hợp lệ | Upload ảnh jpg/png | Upload thành công | P1
- TC-UP-004 | Avatar | Upload file sai định dạng | Upload exe/txt | Bị chặn, báo lỗi | P1
- TC-UP-005 | Change Password | Đổi mật khẩu đúng | Nhập old/new đúng | Đổi mật khẩu thành công | P1
- TC-UP-006 | Change Password | Old password sai | Nhập old sai | Báo lỗi | P1
- TC-UP-007 | Address | Thêm địa chỉ mới | Add Home/Office | Lưu thành công | P1
- TC-UP-008 | Address | Sửa địa chỉ | Edit address | Dữ liệu cập nhật đúng | P2
- TC-UP-009 | Address | Xóa địa chỉ | Delete address | Xóa thành công | P2
- TC-UP-010 | Address | Đặt mặc định | Set default address | Chỉ 1 địa chỉ default | P2

### D. Catalog, Search, Product Detail

- TC-PR-001 | Product List | Hiển thị danh sách sản phẩm | Vào trang products | Danh sách load đúng | P0
- TC-PR-002 | Product List | Phân trang/limit | Chuyển trang | Dữ liệu trang đúng | P1
- TC-PR-003 | Product Filter | Lọc theo category | Chọn category | Chỉ hiện sản phẩm đúng nhóm | P0
- TC-PR-004 | Product Sort | Sort giá tăng/giảm | Chọn sort option | Thứ tự đúng | P1
- TC-PR-005 | Search | Search theo tên | Nhập từ khóa | Kết quả phù hợp | P0
- TC-PR-006 | Search | Search không kết quả | Nhập chuỗi lạ | Hiện trạng thái no results | P1
- TC-PR-007 | Product Detail | Mở chi tiết sản phẩm | Click card product | Trang detail đúng item | P0
- TC-PR-008 | Product Detail | Ảnh fallback | Ảnh hỏng URL | Hiện ảnh fallback | P2
- TC-PR-009 | Product Detail | Tăng giảm số lượng | Click +/- | Không vượt stock, không dưới 1 | P0
- TC-PR-010 | Product Detail | Sản phẩm hết hàng | Open product stock 0 | Không cho add cart | P0
- TC-PR-011 | Related Products | Hiển thị liên quan | Xem section related | Có dữ liệu liên quan | P2
- TC-PR-012 | Reviews | Xem review sản phẩm | Open review tab | Hiển thị review đúng | P1
- TC-PR-013 | Reviews | Viết review khi delivered | User có đơn delivered review | Tạo review thành công | P1
- TC-PR-014 | Reviews | Chặn review khi chưa mua | User chưa mua | Không được review | P0

### E. Wishlist & Cart

- TC-CT-001 | Wishlist | Add vào wishlist | Click tim ở product | Item vào wishlist | P1
- TC-CT-002 | Wishlist | Remove khỏi wishlist | Remove item | Item bị xóa | P1
- TC-CT-003 | Cart | Add vào cart từ detail | Add to cart | Item vào cart đúng qty | P0
- TC-CT-004 | Cart | Merge item cùng SKU | Add lại item cũ | Qty tăng, không tạo dòng mới | P1
- TC-CT-005 | Cart | Update quantity | Tăng/giảm qty trong cart | Tổng tiền cập nhật đúng | P0
- TC-CT-006 | Cart | Xóa item | Remove line item | Item biến mất, tổng cập nhật | P0
- TC-CT-007 | Cart | Cart persistence | Reload trang | Cart vẫn giữ đúng | P1
- TC-CT-008 | Cart | Vượt tồn kho | Đặt qty > stock | Bị chặn và báo lỗi | P0

### F. Checkout, Coupon, Payment

- TC-CK-001 | Checkout | Chưa login vào checkout | Open /checkout | Redirect login | P0
- TC-CK-002 | Checkout | Có login + cart hợp lệ | Đi qua checkout | Hiển thị form đúng | P0
- TC-CK-003 | Address | Chọn địa chỉ giao hàng | Select address | Giá ship/tổng cập nhật đúng | P1
- TC-CK-004 | Coupon | Áp coupon hợp lệ | Nhập coupon đúng | Discount áp dụng đúng | P0
- TC-CK-005 | Coupon | Coupon hết hạn | Nhập coupon expired | Báo lỗi, không giảm giá | P0
- TC-CK-006 | Coupon | Coupon sai shop/product | Apply sai phạm vi | Báo lỗi đúng rule | P0
- TC-CK-007 | Payment COD | Chọn COD và đặt hàng | Submit order COD | Tạo order thành công | P0
- TC-CK-008 | Payment Stripe | Thanh toán Stripe thành công | Dùng card test success | Order paid + trạng thái đúng | P0
- TC-CK-009 | Payment Stripe | Stripe thất bại | Dùng card fail | Không tạo paid order sai | P0
- TC-CK-010 | Payment PayPal | PayPal success | Complete PayPal flow | Order paid thành công | P0
- TC-CK-011 | Payment PayPal | PayPal cancel | Cancel giao dịch | Không ghi nhận paid | P0
- TC-CK-012 | Payment Retry | Retry sau fail | Thanh toán lại | Không duplicate order sai | P1

### G. Order Tracking, Refund

- TC-OR-001 | Orders | User xem danh sách đơn | Profile -> Orders | Hiển thị đúng đơn của user | P0
- TC-OR-002 | Order Detail | User xem chi tiết đơn | Open order detail | Data khớp DB | P0
- TC-OR-003 | Track | Theo dõi trạng thái đơn | Open tracking | Status timeline đúng | P1
- TC-OR-004 | Refund Request | Tạo yêu cầu refund | Với đơn delivered hợp lệ | Refund request tạo thành công | P1
- TC-OR-005 | Refund Rule | Chặn refund không hợp lệ | Với đơn pending/shipped | Không cho gửi request | P0
- TC-OR-006 | Refund Status | Seller/Admin xử lý refund | Update refunded | User thấy trạng thái cập nhật | P1

### H. Seller Authentication & Shop

- TC-SA-001 | Seller Signup | Đăng ký shop hợp lệ | Nhập đủ form | Tạo seller pending/active theo rule | P0
- TC-SA-002 | Seller Signup | Thiếu field bắt buộc | Bỏ shop name/email | Báo lỗi validation | P0
- TC-SA-003 | Seller Login | Login seller đúng | Credentials hợp lệ | Vào dashboard seller | P0
- TC-SA-004 | Seller Login | Seller chưa duyệt | Login account chưa approved | Bị chặn theo rule | P1
- TC-SA-005 | Shop Profile | Sửa thông tin shop | Update profile shop | Lưu thành công | P1
- TC-SA-006 | Shop Bank | Thêm bank info | Add bank account | Lưu thành công | P1
- TC-SA-007 | Withdraw | Rút vượt số dư | Request > balance | Bị chặn | P0
- TC-SA-008 | Withdraw | Rút hợp lệ | Request <= balance | Tạo request thành công | P1

### I. Seller Product/Event/Coupon

- TC-SP-001 | Product Create | Tạo sản phẩm hợp lệ | Fill form + upload ảnh | Tạo sản phẩm thành công | P0
- TC-SP-002 | Product Create | Thiếu field bắt buộc | Bỏ name/price/stock | Báo lỗi | P0
- TC-SP-003 | Product Edit | Sửa sản phẩm | Update title/price | Lưu thành công | P1
- TC-SP-004 | Product Delete | Xóa sản phẩm | Delete action | Không còn trong list | P1
- TC-SP-005 | Event Create | Tạo event hợp lệ | Fill start/end date hợp lệ | Tạo event thành công | P1
- TC-SP-006 | Event Date Validation | End < Start | Submit event | Bị chặn | P0
- TC-SP-007 | Coupon Create | Coupon hợp lệ | Add coupon | Tạo thành công | P1
- TC-SP-008 | Coupon Duplicate | Trùng mã coupon | Add duplicate code | Báo lỗi duplicate | P0
- TC-SP-009 | Coupon Delete | Xóa coupon | Delete coupon | Xóa thành công | P1

### J. Seller Orders & Inbox

- TC-SO-001 | Seller Orders | Xem danh sách đơn shop | Dashboard orders | Chỉ đơn của shop hiện tại | P0
- TC-SO-002 | Seller Order Status | Cập nhật shipped/delivered | Update status | User và seller thấy status mới | P0
- TC-SO-003 | Invalid Transition | Update trạng thái sai thứ tự | delivered -> pending | Bị chặn | P1
- TC-SO-004 | Seller Inbox | Tạo/đọc hội thoại | Open inbox | Message load đúng | P1
- TC-SO-005 | Send Message | Gửi text | Send message | Message realtime hiển thị 2 phía | P1
- TC-SO-006 | Send Image | Gửi ảnh chat | Upload image message | Ảnh hiển thị đúng | P2

### K. Admin

- TC-AD-001 | Admin Login | Login admin hợp lệ | Credentials admin | Vào admin dashboard | P0
- TC-AD-002 | Access Control | User thường vào admin route | Open admin URL | Bị chặn/redirect | P0
- TC-AD-003 | Admin Users | Xem danh sách user | Open users page | Load đúng dữ liệu | P1
- TC-AD-004 | Admin Delete User | Xóa user | Delete action | User bị xóa, không đăng nhập được | P1
- TC-AD-005 | Admin Sellers | Xem danh sách seller | Open sellers page | Load đúng dữ liệu | P1
- TC-AD-006 | Admin Delete Seller | Xóa seller | Delete action | Seller bị xóa đúng | P1
- TC-AD-007 | Admin Orders | Xem toàn bộ order | Open orders page | Data tổng hợp đúng | P1
- TC-AD-008 | Withdraw Approve | Duyệt rút tiền | Approve request | Trạng thái đổi đúng, email gửi | P1
- TC-AD-009 | Withdraw Reject | Từ chối rút tiền | Reject request | Trạng thái đổi đúng | P1

### L. API Contract & Validation

- TC-API-001 | Auth API | Login endpoint success | POST login valid body | 200 + token/cookie | P0
- TC-API-002 | Auth API | Login invalid body | POST missing fields | 400/422 | P0
- TC-API-003 | Auth API | Wrong creds | POST wrong password | 401 | P0
- TC-API-004 | Product API | Create product unauthorized | POST no token | 401/403 | P0
- TC-API-005 | Product API | Create product authorized | POST seller token | 201 | P0
- TC-API-006 | Order API | Create order valid | POST checkout payload | 201 | P0
- TC-API-007 | Order API | Invalid amount tampering | POST manipulated total | Bị chặn | P0
- TC-API-008 | Coupon API | Invalid coupon | Apply invalid coupon | 400 | P0
- TC-API-009 | Error Shape | Format lỗi thống nhất | Trigger lỗi bất kỳ | JSON error shape đúng chuẩn | P1
- TC-API-010 | Idempotency | Retry payment webhook/order | Re-send callback | Không tạo duplicate bản ghi | P0

### M. Security

- TC-SEC-001 | Rate Limit | Brute force login | Spam login nhiều lần | Bị throttle 429 | P0
- TC-SEC-002 | JWT | Token giả | Call API với token fake | 401 | P0
- TC-SEC-003 | JWT Expire | Token hết hạn | Call API expired token | 401 + yêu cầu login lại | P0
- TC-SEC-004 | RBAC | User gọi API seller/admin | Call protected endpoint | 403 | P0
- TC-SEC-005 | XSS | Inject script input | Submit script tag field | Script không execute | P0
- TC-SEC-006 | NoSQL Injection | Payload object injection | Login/query payload bất thường | Bị chặn | P0
- TC-SEC-007 | File Upload | Upload file độc hại | Upload exe/svg script | Bị chặn | P0
- TC-SEC-008 | CORS | Origin lạ gọi API credentials | Cross origin test | Bị chặn theo cấu hình | P1
- TC-SEC-009 | Sensitive Data | API response | Check response body | Không lộ password/hash/secret | P0
- TC-SEC-010 | Security Headers | Check headers | Response headers | Có helmet headers hợp lệ | P1

### N. Realtime Socket

- TC-SK-001 | Connect | User online socket | Open 2 tab 2 user | Connected thành công | P1
- TC-SK-002 | Presence | Online/offline state | Đóng 1 user | Presence cập nhật đúng | P2
- TC-SK-003 | Message Realtime | Text realtime | Send from user A | User B nhận ngay | P1
- TC-SK-004 | Reconnect | Mất mạng rồi reconnect | Toggle network | Tự reconnect, không mất session chính | P2
- TC-SK-005 | Unauthorized Socket | Kết nối thiếu auth | Connect no token | Bị chặn | P1

### O. UI/UX, Responsive, Accessibility

- TC-UX-001 | Responsive | Mobile 375px | Open home/product/cart | Layout không vỡ | P1
- TC-UX-002 | Responsive | Tablet 768px | Open pages chính | Menu và card hiển thị đúng | P1
- TC-UX-003 | Responsive | Desktop 1440px | Open pages chính | Không lệch bố cục | P2
- TC-UX-004 | Keyboard Nav | Tab navigation | Dùng Tab qua form/menu | Focus order hợp lý | P2
- TC-UX-005 | Contrast | Text/background contrast | Kiểm tra page chính | Đủ đọc được | P2
- TC-UX-006 | Alt text | Ảnh chính có alt | Inspect image | alt có ý nghĩa | P3
- TC-UX-007 | Error Message | UX lỗi form | Submit invalid form | Lỗi rõ ràng, đúng field | P1

### P. Performance & Reliability

- TC-PF-001 | Home Load | Tải trang đầu | Cold load home | LCP/FCP trong ngưỡng chấp nhận | P2
- TC-PF-002 | Product List Load | Danh sách nhiều sản phẩm | Seed dữ liệu lớn | App vẫn mượt, không treo | P2
- TC-PF-003 | Memory Leak | Mở/đóng popup nhiều lần | Cart/wishlist modal | Không tăng memory bất thường | P3
- TC-PF-004 | API Latency | API timeout handling | Giả lập API chậm | UI có loading và xử lý timeout | P2
- TC-PF-005 | Retry Strategy | Mất mạng tạm thời | Tắt mạng khi submit | Có thông báo và retry hợp lý | P2

### Q. Deployment & DevOps

- TC-DP-001 | Vercel Build | Build trên Vercel | Trigger deploy | Build pass, không thiếu output dir | P0
- TC-DP-002 | Static Output | Verify output directory | Check artifact | frontend/build tồn tại | P0
- TC-DP-003 | Env Vars | Thiếu env quan trọng | Deploy thiếu key | Build/runtime báo lỗi rõ ràng | P1
- TC-DP-004 | CORS Prod | Frontend domain gọi backend | Test prod domain | CORS hoạt động đúng | P0
- TC-DP-005 | API URL Config | Sai base URL | Build với URL sai | Hiện lỗi cấu hình rõ | P1

## 4) Regression Pack (chạy mỗi lần release)

- P0 bắt buộc: TC-SM-001..010, TC-UA-001/008/015, TC-PR-001/005/007/010, TC-CT-003/005/008, TC-CK-001/004/007/008/010, TC-OR-001/002, TC-SA-003, TC-SP-001, TC-SO-002, TC-AD-002, TC-API-001/004/006/010, TC-SEC-001/002/004/005, TC-DP-001/002/004.

## 5) Gợi ý tự động hóa

- Unit test: reducer, util format currency, validation helper
- Integration test: API auth/product/order/payment
- E2E (Playwright/Cypress): signup -> login -> add cart -> coupon -> payment -> order tracking

## 6) Tiêu chí pass release

- 100% test P0 pass
- > = 95% test P1 pass
- Không còn lỗi security mức critical/high mở
- Build production pass trên CI/CD và Vercel
