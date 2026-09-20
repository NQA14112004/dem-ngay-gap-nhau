# Đếm ngược ngày mình gặp nhau

Một trang web đếm ngược tới **28 tháng Chạp** — ngày anh về Việt Nam ăn Tết với em.

**Trang đang chạy tại: https://nqa14112004.github.io/dem-ngay-gap-nhau/**

Mỗi ngày trôi qua con số bớt đi 1, tới đúng ngày về thì chạm 0. Mỗi ngày một câu
khác nhau, mỗi tuần một khung cảnh khác nhau, và mỗi buổi trong ngày một bầu trời
khác nhau.

- Mốc hiện tại: **28 tháng Chạp năm Bính Ngọ = 04/02/2027** (trang tự tính, không gõ cứng)
- Không cần cài gì, không có thư viện ngoài, không cần build
- Chạy được cả trên điện thoại lẫn máy tính

---

## 1. Việc đầu tiên: điền tên vào

Mở file `js/config.js` và sửa bốn chỗ:

| Dòng | Sửa thành |
|---|---|
| `tenEm` | Tên hoặc biệt danh bạn gọi người yêu |
| `tenAnh` | Tên bạn (dùng để ký cuối bức thư) |
| `thuNgo` | Lời nhắn hiện ra đúng ngày về |
| `fileNhac` | Tên file nhạc, nếu muốn có nhạc nền |

Lưu lại là xong, không cần làm gì thêm.

## 2. Xem thử trên máy

Mở terminal ngay trong thư mục này rồi chạy:

```bash
npm run dev
```

Sau đó mở trình duyệt vào `http://localhost:4321`. Lệnh này dùng máy chủ nhỏ có sẵn
trong thư mục `tools/`, không cần tải gói nào về nên chạy được cả khi không có mạng.

> **Lưu ý:** đừng nháy đúp trực tiếp vào `index.html`. Trang dùng ES module, mở
> bằng đường dẫn `file://` sẽ bị trình duyệt chặn. Phải chạy qua một máy chủ nhỏ
> như lệnh trên.

## 3. Xem trước một ngày bất kỳ

Thêm `?ngay=` vào cuối địa chỉ để giả vờ hôm nay là ngày khác. Rất tiện để xem
trước cảnh Tết hay màn hình ngày về mà không phải chỉnh đồng hồ máy:

| Địa chỉ | Thấy gì |
|---|---|
| `http://localhost:4321/` | Hôm nay thật |
| `http://localhost:4321/?ngay=2026-12-20` | Cảnh mùa đông |
| `http://localhost:4321/?ngay=2027-01-20` | Chế độ Tết, còn 15 ngày |
| `http://localhost:4321/?ngay=2027-02-03` | Còn đúng 1 ngày |
| `http://localhost:4321/?ngay=2027-02-04` | Ngày về: pháo hoa và bức thư |

Thêm `&buoi=` để xem thử một buổi cụ thể, khỏi phải ngồi chờ tới giờ đó:

```
http://localhost:4321/?ngay=2026-12-20&buoi=sang
http://localhost:4321/?ngay=2026-12-20&buoi=trua
http://localhost:4321/?ngay=2026-12-20&buoi=chieu
http://localhost:4321/?ngay=2026-12-20&buoi=toi
```

## 3b. Cảnh nền được chọn thế nào

Ba thứ quyết định, tách bạch nhau:

| Yếu tố | Lấy từ đâu | Quyết định cái gì |
|---|---|---|
| **Mùa** | Tháng dương lịch | Tông màu chung: thu vàng, đông xám lạnh, xuân ẩm, hạ chói |
| **Tuần** | Số thứ tự tuần | Bố cục: đồi, hồ, phố, ruộng, rừng thông, sương sớm... |
| **Buổi** | Giờ máy người xem | Ánh sáng: sáng, trưa, chiều, tối |

Mỗi mùa có 5 bố cục, xoay vòng mỗi tuần một cái. Trong cùng một tuần thì khung
cảnh quen thuộc, nhưng sáng mở ra và tối mở ra là hai bầu trời khác hẳn nhau —
kể cả màu chữ cũng đảo: ban ngày nền sáng thì chữ đậm, chiều tối thì chữ sáng.

Riêng buổi thì lấy theo giờ MÁY của người đang xem, không phải giờ Việt Nam. Vì
cái này nói về ánh sáng ngoài cửa sổ ngay lúc đó. Con số đếm ngược thì ngược lại,
luôn tính theo ngày ở Việt Nam để hai người thấy cùng một số.

## 4. Nhạc nền

Trang có trình phát nhỏ ở góc trên bên phải: nút chạy/tạm dừng và thanh âm lượng.
Mức âm lượng được nhớ cho lần sau.

**Về chuyện tự phát.** Chrome, Safari, Firefox đều chặn trang phát tiếng khi
người xem chưa chạm vào gì. Không lách được, không có ngoại lệ. Nên trang làm
thế này: thử phát ngay khi vào; bị chặn thì nhạc tự bật ở **cú chạm đầu tiên**
bất kỳ đâu trên màn hình. Với người xem thì gần như không khác gì tự phát.

Ai tự tay bấm tạm dừng thì lần sau vào trang sẽ không bị phát lại — tôn trọng
lựa chọn đó.

### Đổi bài khác

Chép file `.mp3` vào `assets/audio/` rồi sửa `fileNhac` trong `js/config.js`.

Lưu ý hai giới hạn:

- **GitHub từ chối mọi file trên 100 MB.** Đẩy lên sẽ bị chặn thẳng.
- Người xem phải tải hết file rồi mới nghe được. File 100 MB nghĩa là chờ rất
  lâu trên 4G, và tốn dung lượng mạng của họ.

Nên cắt lấy vài phút rồi nén lại. File đang dùng là 170 giây, 112 kbps, 2,3 MB —
cắt từ bản gốc 60 phút 137 MB bằng ffmpeg:

```bash
ffmpeg -ss 30 -t 170 -i goc.mp3 -ss 200 -t 6 -i goc.mp3   -filter_complex "[1:a][0:a]acrossfade=d=6:c1=tri:c2=tri[out]"   -map "[out]" -c:a libmp3lame -b:a 112k assets/audio/nhac-nen.mp3
```

Chỗ `acrossfade` là để chồng mờ đuôi lên đầu, nhờ vậy khi file lặp lại thì tai
không nghe ra chỗ nối.

`.gitignore` chỉ cho phép đúng `assets/audio/nhac-nen.mp3` đi lên repo. File gốc
và mọi file nhạc khác đều bị bỏ qua, tránh lỡ tay đẩy một file trăm MB lên.

Không có file nào hợp lệ thì trang tự quay về **nhạc ngũ cung tự sinh** trong
`js/music.js` — không bao giờ để trang im bặt.

## 5. Cập nhật trang đã chạy

Trang đã nằm trên GitHub Pages. Sửa xong thì chạy đúng ba lệnh này:

```bash
npm run stamp
npm test
git add -A && git commit -m "sua gi do" && git push
```

Khoảng một phút sau là trang cập nhật.

**Đừng bỏ bước `npm run stamp`.** GitHub Pages trả về `Cache-Control: max-age=600`,
nghĩa là trình duyệt người xem còn giữ bản cũ trong máy tối đa 10 phút sau khi
bạn đẩy bản mới. Lệnh `stamp` gắn thêm `?v=<mã>` vào mọi đường dẫn css và js;
mã đổi thì địa chỉ đổi, trình duyệt buộc phải tải bản mới ngay.

Mã phiên bản tính từ chính nội dung các file, nên nội dung không đổi thì mã
không đổi — chạy lại bao nhiêu lần cũng ra cùng kết quả, không tạo thay đổi rác.

Muốn đổi link thành tên dễ nhớ hơn thì đổi tên repo trong **Settings → General →
Repository name**, link sẽ đổi theo.

## 6. Chạy kiểm thử

```bash
npm test
```

Bộ kiểm thử bao trùm những chỗ dễ sai nhất:

- Đối chiếu mùng 1 Tết 16 năm (2020–2035) với lịch Việt Nam
- Đổi dương sang âm rồi đổi ngược lại, 3000 ngày liên tiếp
- Số ngày còn lại giảm đúng 1 mỗi ngày, không nhảy cóc qua mốc đổi tháng, đổi năm
- Máy ở 5 múi giờ khác nhau phải cho ra cùng một con số
- Đi hết chặng đếm ngược, mô phỏng từng ngày một, không ngày nào gặp lại câu cũ
- 24 giờ trong ngày đều rơi đúng buổi, ranh giới không lệch
- Giai điệu chạy 5000 nốt vẫn không lạc khỏi quãng, chủ yếu đi liền bậc
- Bố cục giữ nguyên suốt 7 ngày của một tuần, sang tuần mới mới đổi
- Tranh nền dựng đúng cấu trúc ở mọi mùa × buổi × tuần, không bị cắt trên màn hình dọc

---

## Cấu trúc thư mục

```
index.html              Khung trang
css/
  base.css              Reset và biến thiết kế
  layout.css            Bố cục, ưu tiên điện thoại
  scenes.css            Bảng màu 4 mùa × 4 khung giờ
  particles.css         Lớp hạt rơi
  finale.css            Màn hình ngày về
tools/
  serve.mjs             Máy chủ tĩnh nhỏ dùng lúc xem thử
  stamp-version.mjs     Gắn dấu phiên bản để cập nhật có hiệu lực ngay
js/
  config.js             ⚠ File duy nhất bạn cần sửa
  lunar.js              Đổi âm lịch ↔ dương lịch (thuật toán Hồ Ngọc Đức)
  target-date.js        Tìm mốc 28 tháng Chạp, đếm ngày theo giờ Việt Nam
  daypart.js            Xác định buổi trong ngày theo giờ máy người xem
  format.js             Định dạng ngày tháng kiểu Việt
  messages.js           152 câu, chia 4 giai đoạn
  message-picker.js     Chọn câu cố định theo ngày
  music.js              Nhạc nền ngũ cung tự sinh bằng Web Audio
  scene.js              Ghép mùa + tuần + buổi thành một cảnh
  scene-layouts.js      20 bố cục, mỗi mùa 5 cái, đổi theo tuần
  scene-art.js          Các mảnh hình SVG
  particles.js          Lá, tuyết, mưa, sương, cánh mai rơi trên canvas
  countdown.js          Đổ chữ ra màn hình, giữ nhịp đồng hồ
  audio.js              Bật tắt nhạc nền
  finale.js             Thư ngỏ và pháo hoa ngày về
  main.js               Ráp mọi thứ lại
tests/                  Kiểm thử, chạy bằng node --test
```

## Vài điều đã tính sẵn

- **Hai người ở hai múi giờ vẫn thấy cùng một con số.** Trang quy mọi phép tính
  về ngày lịch ở Việt Nam chứ không lấy hiệu thời gian chia cho 24 giờ.
- **Câu cố định theo ngày.** Mở lại trang mười lần trong ngày vẫn thấy đúng câu
  đó; sang ngày mới mới đổi câu. Giọng viết là kiểu nói ít, không hoa mỹ — tình
  cảm nằm ở chi tiết cụ thể chứ không nằm ở tính từ.
- **Trang tự đổi màu khi sang buổi mới.** Mở từ chiều tới tối mà không đóng thì
  bầu trời tự chuyển, không cần tải lại.
- **Về 0 rồi vẫn ở lại một tuần.** Hết mùng 5 Tết trang mới bắt đầu đếm cho lần
  gặp năm sau, chứ không nhảy số ngay hôm sau.
- **Máy bật chế độ giảm chuyển động** thì mọi hiệu ứng động tự tắt.
- **Xoay ngang điện thoại** thì tranh nền tự dựng lại cho khớp tỉ lệ màn hình.
- **Trang không lên Google.** Có `robots.txt` và thẻ `noindex` — ai có link vẫn
  mở được bình thường, chỉ là không nằm trong kết quả tìm kiếm.
