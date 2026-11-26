# Bật đồng bộ lời nhắn

1. Tạo một project trên Supabase.
2. Mở **SQL Editor**, tạo query mới, dán toàn bộ nội dung file `daily-wishes.sql` rồi bấm **Run**.
3. Vào **Authentication → Users → Add user**, tạo tài khoản bằng email của bạn và đặt mật khẩu là `bichhanhdangiu` (key đang dùng để lưu).
4. Vào **Project Settings → API**, sao chép **Project URL** và **Publishable key** (hoặc anon public key).
5. Dán URL, key và email vừa tạo vào `supabase.url`, `supabase.publishableKey`, `supabase.writerEmail` trong `js/config.js`.
6. Chạy `node tools/stamp-version.mjs`, kiểm tra bằng `node --test`, rồi push lên GitHub Pages.

Chỉ dùng Publishable/anon key trong web công khai. Tuyệt đối không điền `service_role key`.
Key được xác thực qua Supabase Auth, đồng thời máy chủ kiểm tra đúng ngày Việt Nam và chặn ghi đè lời nhắn.
