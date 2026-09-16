# Nhạc nền

Muốn có nhạc thì chép một file `.mp3` vào đúng thư mục này, rồi mở
`js/config.js` và sửa dòng `fileNhac` cho khớp tên file.

Ví dụ: chép file `em-cua-ngay-hom-qua.mp3` vào đây thì sửa thành:

```js
fileNhac: 'assets/audio/em-cua-ngay-hom-qua.mp3',
```

Chưa có nhạc cũng không sao — nút loa sẽ tự ẩn và trang vẫn chạy bình thường.

Lưu ý: nhạc không tự phát khi mở trang (trình duyệt chặn, và mở ở chỗ đông
người mà tự nhiên có nhạc thì phiền). Người xem bấm nút loa thì mới phát, và
lần sau mở lại trang thì trình duyệt nhớ lựa chọn đó.
