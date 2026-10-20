/**
 * Kho câu, mỗi ngày hiện một câu.
 *
 * Giọng viết: anh nhắn cho em. Nói chuyện với em, hỏi han em, hứa với em -
 * chứ không ngồi bình luận về thời gian, khoảng cách hay sự kiên nhẫn.
 *
 * Mấy thứ làm câu dở đi:
 *   - Triết lý. "Chờ đợi là làm mọi thứ trừ việc quên" nghe thì kêu, nhưng đó
 *     là câu trích trên mạng, không phải câu người yêu nhắn cho nhau.
 *   - Vế đối. "A không phải là X, A là Y" - dùng một lần thì hay, dùng mười
 *     lần thì lộ ra là viết theo khuôn.
 *   - Từ to tát: bền bỉ, trưởng thành, chung thuỷ, định mệnh, mãi mãi.
 *
 * Mấy thứ làm câu hay lên: hỏi em hôm nay thế nào, dặn em ăn ngủ tử tế, khen
 * một chi tiết rất nhỏ, hứa một việc rất cụ thể sẽ làm lúc về, và thỉnh
 * thoảng đùa một câu tự nhận mình dở.
 *
 * QUY TẮC CỨNG: viết lời chung, đừng khai chuyện cụ thể.
 *
 * Câu nằm sẵn trong kho từ trước, không ai biết hôm đó thật sự xảy ra chuyện
 * gì. Viết "vali đóng xong rồi" mà hôm ấy chưa đóng, hay "trời hôm nay đẹp"
 * mà hôm ấy mưa, là trang tự nói dối hộ mình. Hỏi thì được, dặn thì được,
 * hứa thì được; khẳng định một việc đã xảy ra thì không.
 *
 * Bốn nhóm theo số ngày còn lại. Vì mốc là 25 tháng Chạp nên ba nhóm sau rơi
 * đúng vào mùa: nhóm giữa luôn là tháng Mười một tới đầu tháng Một (trời rét),
 * nhóm gần luôn là quãng trước Tết, nhóm cuối là tuần cuối cùng. Nhóm xa thì
 * rơi vào bất cứ tháng nào nên không nhắc tới mùa.
 *
 * Riêng số ngày thì cứ nói thẳng được: nhóm cuối chạy theo thứ tự cố định nên
 * "ba hôm nữa" rơi đúng vào hôm còn ba ngày, không bao giờ lệch.
 *
 * Ký hiệu {em} và {anh} sẽ được thay bằng tên trong js/config.js.
 * Cứ sửa thoải mái - viết bằng lời của mình vẫn hơn.
 *
 * Một câu nên gói trong khoảng 90 ký tự. Dài hơn thì trên điện thoại nó tràn
 * quá bốn dòng, khối chữ xô xuống và con số đếm ngược mất chỗ đứng.
 */

/** Còn hơn 90 ngày. Hỏi han, dặn dò, nhớ nhung kiểu thường ngày. */
const XA = [
  'Em ăn cơm chưa? Hỏi thật đấy, không phải hỏi cho có đâu.',
  'Hôm nay em thế nào? Kể anh nghe đi, dài bao nhiêu cũng được.',
  'Anh để chuông to cả đêm. Em gọi lúc nào anh cũng nghe thấy.',
  'Em cứ gửi ảnh đi. Anh chưa chê cái nào bao giờ.',
  'Anh thích nghe em kể chuyện linh tinh hơn là nghe nhạc.',
  'Em ngủ chưa đấy? Khuya rồi, đi ngủ đi.',
  'Em đừng lo anh có nhớ không. Có.',
  'Anh không biết nói ngọt. Nhưng anh về đúng hẹn.',
  'Về anh dẫn em đi ăn. Em chọn quán, anh trả tiền.',
  'Hôm nào mệt thì nhắn anh một chữ "mệt" thôi. Anh hiểu.',
  'Em cười là anh quên mất đang định nói gì.',
  'Anh nhớ giọng em hơn nhớ mặt. Nghe hơi lạ nhưng thật.',
  'Em bận cũng được. Anh đợi quen rồi.',
  'Anh giữ hết tin nhắn của em, không xoá cái nào.',
  'Em mặc gì cũng được, miễn là đủ ấm.',
  'Anh không giỏi dỗ dành. Nhưng em buồn thì cứ nói.',
  'Hôm nay có chuyện gì vui không em? Anh đang cần một chuyện vui.',
  'Em thích gì cứ bảo anh. Anh ghi lại hết.',
  'Nhớ em nhất là lúc ngồi ăn cơm một mình.',
  'Em đừng ngại nhắn trước. Anh thích em nhắn trước.',
  'Anh đếm ngày được về, chứ không đếm ngày phải xa.',
  'Em cứ đi chơi với bạn đi. Anh không ghen đâu. Ít thôi.',
  'Anh muốn về để cãi nhau xong là làm lành được ngay trong ngày.',
  'Em uống đủ nước chưa? Anh hỏi phiền thế đấy, chịu khó nhé.',
  'Anh không cần em đợi cho giỏi. Anh cần em vui.',
  'Chuyện gì em cũng kể anh nhé. Chuyện bé tí cũng được.',
  'Hôm nào em rảnh thì gọi video. Anh chẳng bận gì đâu.',
  'Anh nhìn giờ bên em trước rồi mới nhìn giờ bên này.',
  'Em mà im lâu là anh ngồi đọc lại tin nhắn cũ.',
  'Về anh ôm em một cái thật lâu, bù cho mấy tháng này.',
  'Anh sợ nhất là em buồn mà không chịu nói.',
  'Em xinh nhất lúc không cố xinh. Anh nói thật đấy.',
  'Anh nhớ em kiểu bình thường thôi. Nhưng ngày nào cũng nhớ.',
  'Em nhắn gì anh cũng đọc. Kể cả lúc đang bận ngập đầu.',
  'Về anh học nấu món em thích. Em dạy anh nhé.',
  'Em đừng gầy đi đấy. Anh về là anh nhìn ra ngay.',
  'Năm nay anh có mỗi một việc quan trọng. Là về với em.',
  'Em cứ mè nheo đi. Anh nghe được, nghe cả ngày cũng được.',
  'Anh thích nhất lúc em nhắn "anh ơi".',
  'Em kể gì anh cũng nhớ. Hôm nào thử kiểm tra anh xem.',
  'Hôm nay anh nghĩ tới em mấy lần, đếm không xuể.',
  'Em mà ốm là anh ngồi đây cũng chẳng yên.',
  'Anh không hứa trời hứa biển. Anh hứa đúng một ngày.',
  'Em cứ sống cho vui. Phần nhớ nhung để anh lo.',
];

/** Còn 31 tới 90 ngày. Vẫn hỏi han dặn dò, thêm cái rét cuối năm. */
const GIUA = [
  'Lạnh thì mặc ấm vào em nhé. Đừng ra đường mỗi cái áo mỏng.',
  'Em ăn sáng chưa? Đừng bỏ bữa sáng nữa.',
  'Trời rét mà em ốm là anh xót.',
  'Em ngủ sớm đi. Anh không ở đó để nhắc hai lần đâu.',
  'Mùa này hay mưa, em nhớ mang ô theo.',
  'Tay lạnh thì đi găng. Anh nói nghe như mẹ, kệ anh.',
  'Cuối năm bận thì cứ bận, nhưng nhớ ăn uống tử tế.',
  'Em đi đường chậm thôi. Anh cần em nguyên vẹn.',
  'Lạnh thế này mà có nồi lẩu với em thì thích.',
  'Về anh chở em đi ăn đêm. Nhớ mặc hai áo vào.',
  'Em thèm gì cứ mua đi, đừng tiếc.',
  'Anh nhớ em nhất mấy hôm trời xám xịt.',
  'Em mà ốm thì nhắn anh ngay, đừng giấu.',
  'Cuối năm mệt thì nghỉ. Chẳng ai chấm điểm mình đâu.',
  'Tiền anh để dành là để về dẫn em đi chơi cho đã.',
  'Em cứ mua cái áo em thích. Đừng đợi anh về mới mua.',
  'Anh muốn về để đắp chăn xem phim với em.',
  'Em ngủ ngon không? Dạo này anh hay hỏi câu đó.',
  'Trời lạnh làm người ta lười. Em lười cũng được.',
  'Anh nhớ cái mùi bếp nhà mùa lạnh. Bên này không có.',
  'Em cứ nhắn cả ngày cũng được. Anh không phiền đâu.',
  'Còn mấy tháng nữa thôi. Em chịu khó với anh một tí.',
  'Anh không mong gì nhiều. Mong về thấy em khoẻ là được.',
  'Mùa đông nào rồi cũng hết. Năm nào chẳng thế.',
  'Em có lạnh không? Nhắn cho anh một câu đi.',
  'Anh thích mùa này, vì mùa này là sắp được về.',
  'Em đừng thức khuya. Thức khuya da xấu, anh về anh mách.',
  'Mấy hôm trời rét em nhớ uống nước ấm.',
  'Về anh mua cho em cái khăn. Em thích màu gì?',
  'Em kể hôm nay em làm gì đi. Anh nghe không chán đâu.',
  'Anh đang cố cho xong việc. Xong là anh về.',
  'Em cứ đòi hỏi đi. Anh thích em đòi hỏi.',
  'Cuối năm đường đông, em đi đâu cũng cẩn thận.',
  'Anh nhớ em cả lúc đang bận. Không hiểu kiểu gì.',
  'Ăn được thì ăn nhiều vào em. Trời lạnh mà.',
  'Anh muốn về ngồi uống chè nóng với em ở vỉa hè.',
  'Em nhớ đi ngủ trước mười hai giờ hộ anh.',
  'Anh không giỏi nói nhớ. Nhưng anh nhớ thật.',
  'Em mà nhắn "anh ơi" là anh bỏ hết việc.',
  'Mấy tháng nữa thôi. Đếm đi rồi thấy nhanh.',
  'Em có mơ thấy anh không? Anh thì có.',
  'Về anh nấu cho em một bát canh nóng.',
  'Trời rét em nhớ ủ ấm chân. Lạnh chân là khó ngủ.',
  'Em buồn thì gọi anh. Giờ nào cũng được.',
  'Anh thích nghe em kể chuyện hơn nghe ai nói chuyện hay.',
  'Em đừng ngại làm phiền anh. Anh rảnh cho em suốt.',
  'Cuối năm ai cũng vội. Mình cứ từ từ.',
  'Anh muốn về, để gọi em dậy xong là đi ăn sáng cùng luôn.',
  'Em cứ vui với bạn bè đi. Phần anh anh lo.',
  'Anh nhớ em nhiều hơn anh nói ra.',
  'Em nhớ anh không? Nói thật đi, anh không trêu đâu.',
  'Về anh dẫn em đi xem phim. Em chọn phim.',
  'Trời rét mà được nắm tay em thì chẳng cần gì thêm.',
  'Em cứ gọi anh lúc em cần. Anh không bận đâu.',
  'Em đừng quên ăn tối. Anh hay lo mỗi chuyện đó.',
  'Mùa này tối nhanh. Em về nhà sớm nhé.',
  'Anh về là mình đi chụp ảnh. Em thích chỗ nào?',
  'Em giữ sức khoẻ hộ anh. Đấy là việc quan trọng nhất.',
  'Nghĩ tới hôm gặp lại là tự nhiên anh thấy khoẻ hẳn.',
  'Em nhắn cho anh một câu trước khi ngủ nhé.',
  'Mấy hôm nay em có vui không? Anh hỏi thật đấy.',
  'Em thích ăn gì nói anh nhớ. Về anh dẫn đi.',
  'Anh không đếm cho sốt ruột. Anh đếm cho đỡ nhớ.',
  'Còn mấy tháng nữa thôi, rồi mình lại ngồi cạnh nhau.',
];

/** Còn 8 tới 30 ngày. Sắp về: rộn ràng, hồi hộp, hẹn hò trước. */
const GAN = [
  'Sắp rồi em ạ. Anh đếm cả giờ chứ không chỉ đếm ngày nữa.',
  'Em thích hoa gì? Nói đi, anh ghi vào.',
  'Hôm anh về em muốn ăn gì? Anh chiều hết.',
  'Sắp được gặp em rồi. Nghĩ thôi đã thấy vui.',
  'Em để dành cho anh một hôm nhé, chỉ hai đứa thôi.',
  'Em đừng hẹn ai hôm đó. Hôm đó anh xin.',
  'Anh về là đi gặp em trước, mọi việc tính sau.',
  'Em có cần anh mang gì về không? Hỏi sớm thì còn kịp.',
  'Mấy hôm này đếm chậm kinh khủng.',
  'Em ngủ sớm đi, mấy hôm nữa còn thức khuya với anh.',
  'Anh hồi hộp như sắp đi thi.',
  'Sắp Tết rồi. Năm nay anh ăn Tết ở nhà, cạnh em.',
  'Hôm đó em mặc đẹp nhé. Anh cũng mặc đẹp.',
  'Cứ nghĩ tới cảnh gặp em là anh làm gì cũng nhanh.',
  'Còn mấy việc cuối thôi. Xong là anh lên đường.',
  'Em nhớ ngủ đủ. Anh về mà thấy em hốc hác là anh xót.',
  'Sắp hết những hôm nhìn nhau qua màn hình rồi.',
  'Anh hứa về là về. Không hoãn.',
  'Em chuẩn bị tinh thần đi, về anh nói nhiều lắm đấy.',
  'Mấy hôm nữa là được nghe em nói ngoài đời rồi.',
  'Anh muốn gặp em ở chỗ đông người, để được nhìn em đi tới.',
  'Dịp Tết em thích đi đâu? Anh đưa đi.',
  'Gần tới rồi. Em chịu khó thêm một tí nữa thôi.',
  'Về tới nơi chắc vẫn rét. Nhưng rét cạnh em thì khác.',
  'Anh đang đếm từng hôm, đếm mà cười một mình.',
  'Em có hồi hộp không? Anh thì có.',
  'Sắp được cầm tay em rồi.',
];

/**
 * Còn 1 tới 7 ngày. Nhóm này chạy theo thứ tự chứ không xoay vòng, nên số câu
 * phải bằng đúng số ngày nó phủ - bảy câu cho bảy ngày.
 *
 * Nhiều hơn bảy thì mấy câu đầu không bao giờ được dùng và cả dãy bị đẩy lệch:
 * câu viết cho hôm sát ngày về sẽ rơi vào hôm trước đó.
 *
 * Đây là nhóm duy nhất nói thẳng được số ngày, vì thứ tự đã khớp cứng với số
 * ngày còn lại. Nhưng vẫn đừng khai chuyện cụ thể: "vali đóng xong rồi" thì
 * hôm ấy chưa chắc đã đóng, còn "còn hai đêm nữa" thì chắc chắn đúng.
 *
 * Câu cuối cùng là của ngày còn đúng 1. Ngày chạm 0 có màn hình riêng với bức
 * thư trong js/config.js, phần chữ nền lúc đó lấy CAU_NGAY_VE bên dưới.
 */
const CUOI = [
  'Một tuần nữa thôi. Em đếm với anh nhé.',
  'Sáu hôm nữa. Đếm bằng đầu ngón tay được rồi đấy.',
  'Năm hôm nữa. Nghĩ tới là vui cả ngày.',
  'Bốn hôm. Anh nhìn đồng hồ còn nhiều hơn nhìn điện thoại.',
  'Ba hôm nữa. Em ngủ sớm đi, đừng thức đếm cùng anh.',
  'Còn hai đêm nữa thôi, {em}. Hai đêm thì nhanh lắm.',
  'Mai anh về. Ngủ ngon nhé, {em}.',
];

/**
 * Câu cho ngày về. Nó còn hiện suốt mấy ngày ân hạn sau đó nữa, nên chỉ nói
 * về chuyện hết đếm - hôm nào trong quãng ấy đọc cũng đúng.
 */
export const CAU_NGAY_VE = 'Hết đếm rồi, {em} ạ.';

/** Toàn bộ kho câu, gom theo nhóm. */
export const MESSAGES = { xa: XA, giua: GIUA, gan: GAN, cuoi: CUOI };
