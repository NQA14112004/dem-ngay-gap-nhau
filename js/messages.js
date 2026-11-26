/**
 * Kho câu, mỗi ngày hiện một câu.
 *
 * Giọng viết: anh nhắn cho em. Nói chuyện với em, hỏi han em, hứa với em -
 * chứ không ngồi bình luận về thời gian, khoảng cách hay sự kiên nhẫn.
 *
 * BỐN THỨ LÀM HỎNG MỘT CÂU
 *
 * 1. Cằn nhằn. Một câu "trời lạnh mặc ấm vào" thì ấm áp. Mười lăm câu ăn ngủ
 *    mặc ấm thì thành mẹ chứ không còn là người yêu. Cả kho để tối đa bốn câu
 *    dặn dò, còn lại phải là chuyện khác.
 *
 * 2. Bình phẩm thân hình với mặt mũi. "Em đừng gầy đi đấy", "thức khuya da
 *    xấu", "xinh nhất lúc không cố xinh" - nghe thì tưởng khen, thật ra là
 *    soi. Khen thì khen tính nết, cách nói chuyện, cách em quyết việc.
 *
 * 3. Nhõng nhẽo đòi dỗ. "Em có nhớ anh không? Nói thật đi" là đang xin em trấn
 *    an. Mệt cho người đọc. Nói chắc một câu rồi thôi.
 *
 * 4. Triết lý. "Chờ đợi là làm mọi thứ trừ việc quên" nghe thì kêu, nhưng đó
 *    là câu trích trên mạng, không phải câu người yêu nhắn cho nhau.
 *
 * MẤY THỨ LÀM CÂU HAY LÊN: hỏi hôm nay em thế nào, để em kể, cho em quyết,
 * hứa một việc rất cụ thể lúc về, và thỉnh thoảng tự nhận mình dở một câu.
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

/** Còn hơn 90 ngày. Hỏi han, để em kể, nhớ nhung kiểu thường ngày. */
const XA = [
  // Còn 99 ngày
  "Hôm nay có ai làm em bực không? Kể anh nghe, anh bực hộ.",
  // Còn 100 ngày
  "Hôm nay em thế nào? Kể anh nghe đi, dài bao nhiêu cũng được.",
  // Còn 101 ngày
  "Anh để chuông to cả đêm. Em gọi lúc nào anh cũng nghe thấy.",
  // Còn 102 ngày
  "Em cứ gửi ảnh đi. Anh chưa chê cái nào bao giờ.",
  // Còn 103 ngày
  "Anh thích nghe em kể chuyện linh tinh hơn là nghe nhạc.",
  // Còn 104 ngày
  "Anh nghĩ tới cảnh ngồi im cạnh em mà chẳng cần nói gì.",
  // Còn 105 ngày
  "Em đừng lo anh có nhớ không. Có.",
  // Còn 106 ngày
  "Anh không biết nói ngọt. Nhưng anh về đúng hẹn.",
  // Còn 107 ngày
  "Về anh dẫn em đi ăn. Em chọn quán, anh trả tiền.",
  // Còn 108 ngày
  "Hôm nào mệt thì nhắn anh một chữ \"mệt\" thôi. Anh hiểu.",
  // Còn 109 ngày
  "Em cười là anh quên mất đang định nói gì.",
  // Còn 110 ngày
  "Anh nhớ cách em nói chuyện. Nghe là biết em đang vui hay không.",
  // Còn 111 ngày
  "Em bận thì cứ bận. Anh không phải việc em phải để tâm cả ngày.",
  // Còn 112 ngày
  "Anh giữ hết tin nhắn của em, không xoá cái nào.",
  // Còn 113 ngày
  "Em mặc gì cũng hợp. Cái này anh nói thật chứ không nịnh.",
  // Còn 114 ngày
  "Anh không giỏi dỗ dành. Nhưng em buồn thì cứ nói.",
  // Còn 115 ngày
  "Hôm nay có chuyện gì vui không em? Anh đang cần một chuyện vui.",
  // Còn 116 ngày
  "Em thích gì cứ bảo anh. Anh ghi lại hết.",
  // Còn 117 ngày
  "Nhớ em nhất là lúc ngồi ăn cơm một mình.",
  // Còn 118 ngày
  "Em đừng ngại nhắn trước. Anh thích em nhắn trước.",
  // Còn 119 ngày
  "Anh đếm ngày được về, chứ không đếm ngày phải xa.",
  // Còn 120 ngày
  "Em cứ đi chơi với bạn đi. Anh thích nghe em kể lúc về.",
  // Còn 121 ngày
  "Anh muốn về để cãi nhau xong là làm lành được ngay trong ngày.",
  // Còn 122 ngày
  "Em lo được hết, anh biết. Nhưng cần gì thì cứ gọi anh.",
  // Còn 123 ngày
  "Anh không cần em đợi cho giỏi. Anh cần em vui.",
  // Còn 124 ngày
  "Chuyện gì em cũng kể anh nhé. Chuyện bé tí cũng được.",
  // Còn 125 ngày
  "Hôm nào em rảnh thì gọi video. Anh chẳng bận gì đâu.",
  // Còn 126 ngày
  "Anh nhìn giờ bên em trước rồi mới nhìn giờ bên này.",
  // Còn 127 ngày
  "Em không cần nhắn lại ngay đâu. Anh không giận chuyện đó.",
  // Còn 128 ngày
  "Về anh ôm em một cái thật lâu, bù cho mấy tháng này.",
  // Còn 129 ngày
  "Anh sợ nhất là em buồn mà không chịu nói.",
  // Còn 130 ngày
  "Anh thích cái kiểu em quyết chuyện gì là làm luôn.",
  // Còn 131 ngày
  "Anh nhớ em kiểu bình thường thôi. Nhưng ngày nào cũng nhớ.",
  // Còn 132 ngày
  "Em nhắn gì anh cũng đọc, kể cả lúc đang bận ngập đầu.",
  // Còn 133 ngày
  "Về anh học nấu món em thích. Em dạy anh nhé.",
  // Còn 134 ngày
  "Hôm nay em làm được việc gì hay? Anh muốn nghe em khoe.",
  // Còn 135 ngày
  "Năm nay anh có mỗi một việc quan trọng. Là về với em.",
  // Còn 136 ngày
  "Em cứ nói thẳng với anh. Anh không giỏi đoán ý đâu.",
  // Còn 137 ngày
  "Anh thích nhất lúc em nhắn \"anh ơi\".",
  // Còn 138 ngày
  "Em kể gì anh cũng nhớ. Hôm nào thử kiểm tra anh xem.",
  // Còn 139 ngày
  "Hôm nay anh nghĩ tới em mấy lần, đếm không xuể.",
  // Còn 140 ngày
  "Em mà ốm là anh ngồi đây cũng chẳng yên.",
  // Còn 141 ngày
  "Anh không hứa trời hứa biển. Anh hứa đúng một ngày.",
  // Còn 142 ngày
  "Em cứ sống cho vui. Phần nhớ nhung để anh lo.",
];

/** Còn 31 tới 90 ngày. Rét cuối năm, nhưng vẫn là chuyện của hai đứa. */
const GIUA = [
  // Còn 35 ngày
  "Lạnh thì em mặc ấm vào nhé. Đừng ra đường mỗi cái áo mỏng.",
  // Còn 36 ngày
  "Cuối năm việc dồn, em có mệt lắm không?",
  // Còn 37 ngày
  "Trời rét mà em ốm là anh xót.",
  // Còn 38 ngày
  "Anh nhớ mấy hôm mình ngồi với nhau lâu, chẳng làm gì cả.",
  // Còn 39 ngày
  "Hôm nào mưa em nhắn anh. Anh kể chuyện cho đỡ chán.",
  // Còn 40 ngày
  "Anh nói chuyện hơi khô. Về em dạy anh nói cho có duyên.",
  // Còn 41 ngày
  "Cuối năm bận thì cứ bận. Anh không đòi em phải rảnh vì anh.",
  // Còn 42 ngày
  "Em đi đường chậm thôi. Anh cần em nguyên vẹn.",
  // Còn 43 ngày
  "Lạnh thế này mà có nồi lẩu với em thì thích.",
  // Còn 44 ngày
  "Về anh chở em đi ăn đêm, đi lòng vòng tới lúc buồn ngủ.",
  // Còn 45 ngày
  "Em thèm gì cứ mua đi, đừng tiếc.",
  // Còn 46 ngày
  "Anh nhớ em nhất mấy hôm trời xám xịt.",
  // Còn 47 ngày
  "Em mà ốm thì nhắn anh ngay, đừng giấu.",
  // Còn 48 ngày
  "Cuối năm mệt thì nghỉ. Chẳng ai chấm điểm mình đâu.",
  // Còn 49 ngày
  "Tiền anh để dành là để về dẫn em đi chơi cho đã.",
  // Còn 50 ngày
  "Em cứ mua cái áo em thích. Đừng đợi anh về mới mua.",
  // Còn 51 ngày
  "Anh muốn về để đắp chăn xem phim với em.",
  // Còn 52 ngày
  "Em ngủ ngon không? Dạo này anh hay hỏi câu đó.",
  // Còn 53 ngày
  "Trời lạnh làm người ta lười. Em lười cũng được.",
  // Còn 54 ngày
  "Anh nhớ cái mùi bếp nhà mùa lạnh. Bên này chẳng có mùi ấy.",
  // Còn 55 ngày
  "Em cứ nhắn cả ngày cũng được. Anh không phiền đâu.",
  // Còn 56 ngày
  "Còn mấy tháng nữa thôi. Rồi mình tính chuyện đi chơi xa.",
  // Còn 57 ngày
  "Anh không mong gì nhiều. Mong về thấy em khoẻ là được.",
  // Còn 58 ngày
  "Mùa đông nào rồi cũng hết. Năm nào chẳng thế.",
  // Còn 59 ngày
  "Em có lạnh không? Nhắn cho anh một câu đi.",
  // Còn 60 ngày
  "Anh thích mùa này, vì mùa này là sắp được về.",
  // Còn 61 ngày
  "Em thức khuya thì rủ anh thức cùng. Anh đang rảnh.",
  // Còn 62 ngày
  "Về anh pha trà cho em. Anh pha hơi đặc, em chịu khó.",
  // Còn 63 ngày
  "Về anh mua cho em cái khăn. Em thích màu gì?",
  // Còn 64 ngày
  "Em kể hôm nay em làm gì đi. Anh nghe không chán đâu.",
  // Còn 65 ngày
  "Anh đang cố cho xong việc. Xong là anh về.",
  // Còn 66 ngày
  "Em muốn gì cứ nói thẳng. Anh thích thế hơn là phải đoán.",
  // Còn 67 ngày
  "Thật buồn khi mất đi một người mà mình yêu thương nhỉ.",
  // Còn 68 ngày
  "Vậy là phải tạm biệt ông rồi, hành trình tiễn đưa một người mà mình thương yêu thật khó khăn. Nhưng anh tin ông vẫn dõi theo và phù hộ cho hành trình của em.",
  // Còn 69 ngày
  "Hôm nay lại phải đi làm gòi mệt nhỉ khum biết em bé ổn hơn chưa.",
  // Còn 70 ngày
  "Anh muốn về ngồi uống chè nóng với em ở vỉa hè.",
  // Còn 71 ngày
  "Anh muốn về để có người cãi lại anh cho vui cửa vui nhà.",
  // Còn 72 ngày
  "Nói chuyện nhớ nhung anh thấy hơi ngượng. Nhưng anh nhớ thật.",
  // Còn 73 ngày
  "Em gọi là anh bắt máy. Anh chưa lỡ cuộc nào đâu.",
  // Còn 74 ngày
  "Mấy tháng nữa thôi. Em cứ đếm đi rồi thấy nhanh.",
  // Còn 75 ngày
  "Anh hay nghĩ tới em trước lúc ngủ. Nghĩ xong anh ngủ ngon hơn.",
  // Còn 76 ngày
  "Về anh nấu cho em một bát canh nóng.",
  // Còn 77 ngày
  "Về mình đi ăn bún riêu buổi tối. Trời rét ăn mới ngon.",
  // Còn 78 ngày
  "Em buồn thì gọi anh, giờ nào cũng được.",
  // Còn 79 ngày
  "Anh thích nghe em kể chuyện hơn nghe ai nói chuyện hay.",
  // Còn 80 ngày
  "Em đừng ngại làm phiền anh. Anh rảnh cho em suốt.",
  // Còn 81 ngày
  "Cuối năm ai cũng vội. Mình cứ từ từ.",
  // Còn 82 ngày
  "Anh muốn về, để gọi em dậy xong là đi ăn sáng cùng luôn.",
  // Còn 83 ngày
  "Em cứ vui với bạn bè đi. Phần anh anh lo.",
  // Còn 84 ngày
  "Anh nhớ em nhiều hơn anh nói ra.",
  // Còn 85 ngày
  "Anh không hỏi em có nhớ anh không. Anh biết là có.",
  // Còn 86 ngày
  "Về anh dẫn em đi xem phim. Em chọn phim.",
  // Còn 87 ngày
  "Trời rét mà được nắm tay em thì chẳng cần gì thêm.",
  // Còn 88 ngày
  "Em cứ gọi anh lúc em cần. Anh không bận đâu.",
  // Còn 89 ngày
  "Anh hay lo vớ vẩn. Em kệ anh, lo là việc của anh.",
  // Còn 90 ngày
  "Mùa này tối nhanh. Tối sớm thì ngày chóng hết, anh thích.",
  // Còn 91 ngày
  "Anh về là mình đi chụp ảnh. Em thích chỗ nào?",
  // Còn 92 ngày
  "Em cứ làm cho xong việc của em. Anh không giục đâu.",
  // Còn 93 ngày
  "Nghĩ tới hôm gặp lại là tự nhiên anh thấy khoẻ hẳn.",
  // Còn 94 ngày
  "Em nhắn cho anh một câu trước khi ngủ nhé.",
  // Còn 95 ngày
  "Mấy hôm nay em có vui không? Anh hỏi thật đấy.",
  // Còn 96 ngày
  "Em thích ăn gì nói anh nhớ. Về anh dẫn đi.",
  // Còn 97 ngày
  "Anh không đếm cho sốt ruột. Anh đếm cho đỡ nhớ.",
  // Còn 98 ngày
  "Còn mấy tháng nữa thôi, rồi mình lại ngồi cạnh nhau.",
];

/** Còn 8 tới 30 ngày. Sắp về: rộn ràng, hồi hộp, hẹn trước với em. */
const GAN = [
  // Còn 8 ngày
  "Sắp rồi em ạ. Anh đếm cả giờ chứ không chỉ đếm ngày nữa.",
  // Còn 9 ngày
  "Em thích hoa gì? Nói đi, anh ghi vào.",
  // Còn 10 ngày
  "Hôm anh về em muốn ăn gì? Anh chiều hết.",
  // Còn 11 ngày
  "Hôm về mình đi đâu trước? Anh để em chọn.",
  // Còn 12 ngày
  "Em để dành cho anh một hôm nhé, chỉ hai đứa thôi.",
  // Còn 13 ngày
  "Hôm đó em rảnh không? Bận thì mình hẹn hôm khác cũng được.",
  // Còn 14 ngày
  "Anh về là đi gặp em trước, mọi việc tính sau.",
  // Còn 15 ngày
  "Em có cần anh mang gì về không? Em hỏi sớm thì anh còn kịp.",
  // Còn 16 ngày
  "Mấy hôm này anh thấy ngày trôi chậm kinh khủng.",
  // Còn 17 ngày
  "Em ngủ sớm đi, mấy hôm nữa còn thức khuya với anh.",
  // Còn 18 ngày
  "Anh hồi hộp như sắp đi thi.",
  // Còn 19 ngày
  "Sắp Tết rồi. Năm nay anh ăn Tết ở nhà, cạnh em.",
  // Còn 20 ngày
  "Hôm đó anh mặc đẹp. Em cứ thoải mái, kiểu gì anh cũng thích.",
  // Còn 21 ngày
  "Cứ nghĩ tới cảnh gặp em là anh làm gì cũng nhanh.",
  // Còn 22 ngày
  "Còn mấy việc cuối thôi. Xong là anh lên đường.",
  // Còn 23 ngày
  "Mấy hôm nữa thôi. Em có cần anh giúp gì từ xa không?",
  // Còn 24 ngày
  "Mình sắp hết những hôm nhìn nhau qua màn hình rồi.",
  // Còn 25 ngày
  "Anh hứa về là về. Anh không hoãn đâu.",
  // Còn 26 ngày
  "Em chuẩn bị tinh thần đi, về anh nói nhiều lắm đấy.",
  // Còn 27 ngày
  "Mấy hôm nữa là được nghe em nói ngoài đời rồi.",
  // Còn 28 ngày
  "Anh muốn gặp em ở chỗ đông người, để được nhìn em đi tới.",
  // Còn 29 ngày
  "Dịp Tết em thích đi đâu? Anh đưa đi.",
  // Còn 30 ngày
  "Sắp tới rồi. Anh gần hết kiên nhẫn, theo nghĩa tốt.",
  // Còn 31 ngày
  "Anh về chắc trời vẫn rét. Nhưng rét mà có em thì khác.",
  // Còn 32 ngày
  "Anh đang đếm từng hôm, đếm mà cười một mình.",
  // Còn 33 ngày
  "Em có hồi hộp không? Anh thì có.",
  // Còn 34 ngày
  "Sắp được cầm tay em rồi.",
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
  // Còn 7 ngày
  "Một tuần nữa thôi. Em đếm với anh nhé.",
  // Còn 6 ngày
  "Sáu hôm nữa. Anh đếm bằng đầu ngón tay được rồi đấy.",
  // Còn 5 ngày
  "Năm hôm nữa. Nghĩ tới là vui cả ngày.",
  // Còn 4 ngày
  "Bốn hôm. Anh nhìn đồng hồ còn nhiều hơn nhìn điện thoại.",
  // Còn 3 ngày
  "Ba hôm nữa thôi. Em có hồi hộp bằng anh không?",
  // Còn 2 ngày
  "Còn hai đêm nữa thôi, {em}. Hai đêm thì nhanh lắm.",
  // Còn 1 ngày
  "Mai anh về. Ngủ ngon nhé, {em}.",
];

/**
 * Câu cho ngày về. Nó còn hiện suốt mấy ngày ân hạn sau đó nữa, nên chỉ nói
 * về chuyện hết đếm - hôm nào trong quãng ấy đọc cũng đúng.
 */
export const CAU_NGAY_VE = 'Hết đếm rồi, {em} ạ.';

/**
 * Câu nhắn cố định theo số ngày còn lại.
 *
 * Mỗi mục bên dưới là câu của đúng một ngày. Chỉ sửa phần chữ ngay dưới
 * comment có số ngày tương ứng; không đổi số ở bên trái, để các câu luôn
 * giữ đúng vị trí ngày của chúng. Nếu muốn thêm ngày mới, dùng mẫu sau:
 *
 * // Còn 12 ngày
 * 12: 'Câu nhắn bạn muốn hiện khi đồng hồ còn 12 ngày.',
 *
 * Số ở bên trái là số hiển thị trên đồng hồ. Câu ở đây luôn được ưu tiên
 * hơn kho câu theo nhóm ở dưới, nên không bị đổi theo năm hay theo lần mở
 * trang. Có thể dùng {em} và {anh}; trang sẽ tự thay bằng tên trong config.
 */
export const MESSAGES_BY_DAYS_REMAINING = {
  // Còn 1 ngày
  1: "Mai anh về. Ngủ ngon nhé, {em}.",

  // Còn 2 ngày
  2: "Còn hai đêm nữa thôi, {em}. Hai đêm thì nhanh lắm.",

  // Còn 3 ngày
  3: "Ba hôm nữa thôi. Em có hồi hộp bằng anh không?",

  // Còn 4 ngày
  4: "Bốn hôm. Anh nhìn đồng hồ còn nhiều hơn nhìn điện thoại.",

  // Còn 5 ngày
  5: "Năm hôm nữa. Nghĩ tới là vui cả ngày.",

  // Còn 6 ngày
  6: "Sáu hôm nữa. Anh đếm bằng đầu ngón tay được rồi đấy.",

  // Còn 7 ngày
  7: "Một tuần nữa thôi. Em đếm với anh nhé.",

  // Còn 8 ngày
  8: "Sắp rồi em ạ. Anh đếm cả giờ chứ không chỉ đếm ngày nữa.",

  // Còn 9 ngày
  9: "Em thích hoa gì? Nói đi, anh ghi vào.",

  // Còn 10 ngày
  10: "Hôm anh về em muốn ăn gì? Anh chiều hết.",

  // Còn 11 ngày
  11: "Hôm về mình đi đâu trước? Anh để em chọn.",

  // Còn 12 ngày
  12: "Em để dành cho anh một hôm nhé, chỉ hai đứa thôi.",

  // Còn 13 ngày
  13: "Hôm đó em rảnh không? Bận thì mình hẹn hôm khác cũng được.",

  // Còn 14 ngày
  14: "Anh về là đi gặp em trước, mọi việc tính sau.",

  // Còn 15 ngày
  15: "Em có cần anh mang gì về không? Em hỏi sớm thì anh còn kịp.",

  // Còn 16 ngày
  16: "Mấy hôm này anh thấy ngày trôi chậm kinh khủng.",

  // Còn 17 ngày
  17: "Em ngủ sớm đi, mấy hôm nữa còn thức khuya với anh.",

  // Còn 18 ngày
  18: "Anh hồi hộp như sắp đi thi.",

  // Còn 19 ngày
  19: "Sắp Tết rồi. Năm nay anh ăn Tết ở nhà, cạnh em.",

  // Còn 20 ngày
  20: "Hôm đó anh mặc đẹp. Em cứ thoải mái, kiểu gì anh cũng thích.",

  // Còn 21 ngày
  21: "Cứ nghĩ tới cảnh gặp em là anh làm gì cũng nhanh.",

  // Còn 22 ngày
  22: "Còn mấy việc cuối thôi. Xong là anh lên đường.",

  // Còn 23 ngày
  23: "Mấy hôm nữa thôi. Em có cần anh giúp gì từ xa không?",

  // Còn 24 ngày
  24: "Mình sắp hết những hôm nhìn nhau qua màn hình rồi.",

  // Còn 25 ngày
  25: "Anh hứa về là về. Anh không hoãn đâu.",

  // Còn 26 ngày
  26: "Em chuẩn bị tinh thần đi, về anh nói nhiều lắm đấy.",

  // Còn 27 ngày
  27: "Mấy hôm nữa là được nghe em nói ngoài đời rồi.",

  // Còn 28 ngày
  28: "Anh muốn gặp em ở chỗ đông người, để được nhìn em đi tới.",

  // Còn 29 ngày
  29: "Dịp Tết em thích đi đâu? Anh đưa đi.",

  // Còn 30 ngày
  30: "Sắp tới rồi. Anh gần hết kiên nhẫn, theo nghĩa tốt.",

  // Còn 31 ngày
  31: "Anh về chắc trời vẫn rét. Nhưng rét mà có em thì khác.",

  // Còn 32 ngày
  32: "Anh đang đếm từng hôm, đếm mà cười một mình.",

  // Còn 33 ngày
  33: "Em có hồi hộp không? Anh thì có.",

  // Còn 34 ngày
  34: "Sắp được cầm tay em rồi.",

  // Còn 35 ngày
  35: "Lạnh thì em mặc ấm vào nhé. Đừng ra đường mỗi cái áo mỏng.",

  // Còn 36 ngày
  36: "Cuối năm việc dồn, em có mệt lắm không?",

  // Còn 37 ngày
  37: "Trời rét mà em ốm là anh xót.",

  // Còn 38 ngày
  38: "Anh nhớ mấy hôm mình ngồi với nhau lâu, chẳng làm gì cả.",

  // Còn 39 ngày
  39: "Hôm nào mưa em nhắn anh. Anh kể chuyện cho đỡ chán.",

  // Còn 40 ngày
  40: "Anh nói chuyện hơi khô. Về em dạy anh nói cho có duyên.",

  // Còn 41 ngày
  41: "Cuối năm bận thì cứ bận. Anh không đòi em phải rảnh vì anh.",

  // Còn 42 ngày
  42: "Em đi đường chậm thôi. Anh cần em nguyên vẹn.",

  // Còn 43 ngày
  43: "Lạnh thế này mà có nồi lẩu với em thì thích.",

  // Còn 44 ngày
  44: "Về anh chở em đi ăn đêm, đi lòng vòng tới lúc buồn ngủ.",

  // Còn 45 ngày
  45: "Em thèm gì cứ mua đi, đừng tiếc.",

  // Còn 46 ngày
  46: "Anh nhớ em nhất mấy hôm trời xám xịt.",

  // Còn 47 ngày
  47: "Em mà ốm thì nhắn anh ngay, đừng giấu.",

  // Còn 48 ngày
  48: "Cuối năm mệt thì nghỉ. Chẳng ai chấm điểm mình đâu.",

  // Còn 49 ngày
  49: "Tiền anh để dành là để về dẫn em đi chơi cho đã.",

  // Còn 50 ngày
  50: "Em cứ mua cái áo em thích. Đừng đợi anh về mới mua.",

  // Còn 51 ngày
  51: "Anh muốn về để đắp chăn xem phim với em.",

  // Còn 52 ngày
  52: "Em ngủ ngon không? Dạo này anh hay hỏi câu đó.",

  // Còn 53 ngày
  53: "Trời lạnh làm người ta lười. Em lười cũng được.",

  // Còn 54 ngày
  54: "Anh nhớ cái mùi bếp nhà mùa lạnh. Bên này chẳng có mùi ấy.",

  // Còn 55 ngày
  55: "Em cứ nhắn cả ngày cũng được. Anh không phiền đâu.",

  // Còn 56 ngày
  56: "Còn mấy tháng nữa thôi. Rồi mình tính chuyện đi chơi xa.",

  // Còn 57 ngày
  57: "Anh không mong gì nhiều. Mong về thấy em khoẻ là được.",

  // Còn 58 ngày
  58: "Mùa đông nào rồi cũng hết. Năm nào chẳng thế.",

  // Còn 59 ngày
  59: "Em có lạnh không? Nhắn cho anh một câu đi.",

  // Còn 60 ngày
  60: "Anh thích mùa này, vì mùa này là sắp được về.",

  // Còn 61 ngày
  61: "Em thức khuya thì rủ anh thức cùng. Anh đang rảnh.",

  // Còn 62 ngày
  62: "Về anh pha trà cho em. Anh pha hơi đặc, em chịu khó.",

  // Còn 63 ngày
  63: "Về anh mua cho em cái khăn. Em thích màu gì?",

  // Còn 64 ngày
  64: "Em kể hôm nay em làm gì đi. Anh nghe không chán đâu.",

  // Còn 65 ngày
  65: "Hôm nay lại phải đi làm gòi mệt nhỉ khum biết em bé ổn hơn chưa.",

  // Còn 66 ngày
  66: "Vậy là phải tạm biệt ông rồi, hành trình tiễn đưa một người mà mình thương yêu thật khó khăn. Nhưng anh tin ông vẫn dõi theo và phù hộ cho hành trình của em.",

  // Còn 67 ngày
  67: "Thật buồn khi mất đi một người mà mình yêu thương nhỉ.",

  // Còn 68 ngày
  68: "Anh nhớ em cả lúc đang bận. Anh cũng chẳng hiểu kiểu gì.",

  // Còn 69 ngày
  69: "Trời lạnh ăn gì cũng ngon. Về mình đi ăn một vòng.",

  // Còn 70 ngày
  70: "Anh muốn về ngồi uống chè nóng với em ở vỉa hè.",

  // Còn 71 ngày
  71: "Anh muốn về để có người cãi lại anh cho vui cửa vui nhà.",

  // Còn 72 ngày
  72: "Nói chuyện nhớ nhung anh thấy hơi ngượng. Nhưng anh nhớ thật.",

  // Còn 73 ngày
  73: "Em gọi là anh bắt máy. Anh chưa lỡ cuộc nào đâu.",

  // Còn 74 ngày
  74: "Mấy tháng nữa thôi. Em cứ đếm đi rồi thấy nhanh.",

  // Còn 75 ngày
  75: "Anh hay nghĩ tới em trước lúc ngủ. Nghĩ xong anh ngủ ngon hơn.",

  // Còn 76 ngày
  76: "Về anh nấu cho em một bát canh nóng.",

  // Còn 77 ngày
  77: "Về mình đi ăn bún riêu buổi tối. Trời rét ăn mới ngon.",

  // Còn 78 ngày
  78: "Em buồn thì gọi anh, giờ nào cũng được.",

  // Còn 79 ngày
  79: "Anh thích nghe em kể chuyện hơn nghe ai nói chuyện hay.",

  // Còn 80 ngày
  80: "Em đừng ngại làm phiền anh. Anh rảnh cho em suốt.",

  // Còn 81 ngày
  81: "Cuối năm ai cũng vội. Mình cứ từ từ.",

  // Còn 82 ngày
  82: "Anh muốn về, để gọi em dậy xong là đi ăn sáng cùng luôn.",

  // Còn 83 ngày
  83: "Em cứ vui với bạn bè đi. Phần anh anh lo.",

  // Còn 84 ngày
  84: "Anh nhớ em nhiều hơn anh nói ra.",

  // Còn 85 ngày
  85: "Anh không hỏi em có nhớ anh không. Anh biết là có.",

  // Còn 86 ngày
  86: "Về anh dẫn em đi xem phim. Em chọn phim.",

  // Còn 87 ngày
  87: "Trời rét mà được nắm tay em thì chẳng cần gì thêm.",

  // Còn 88 ngày
  88: "Em cứ gọi anh lúc em cần. Anh không bận đâu.",

  // Còn 89 ngày
  89: "Anh hay lo vớ vẩn. Em kệ anh, lo là việc của anh.",

  // Còn 90 ngày
  90: "Mùa này tối nhanh. Tối sớm thì ngày chóng hết, anh thích.",

  // Còn 91 ngày
  91: "Anh về là mình đi chụp ảnh. Em thích chỗ nào?",

  // Còn 92 ngày
  92: "Em cứ làm cho xong việc của em. Anh không giục đâu.",

  // Còn 93 ngày
  93: "Nghĩ tới hôm gặp lại là tự nhiên anh thấy khoẻ hẳn.",

  // Còn 94 ngày
  94: "Em nhắn cho anh một câu trước khi ngủ nhé.",

  // Còn 95 ngày
  95: "Mấy hôm nay em có vui không? Anh hỏi thật đấy.",

  // Còn 96 ngày
  96: "Em thích ăn gì nói anh nhớ. Về anh dẫn đi.",

  // Còn 97 ngày
  97: "Anh không đếm cho sốt ruột. Anh đếm cho đỡ nhớ.",

  // Còn 98 ngày
  98: "Còn mấy tháng nữa thôi, rồi mình lại ngồi cạnh nhau.",

  // Còn 99 ngày
  99: "Hôm nay có ai làm em bực không? Kể anh nghe, anh bực hộ.",

  // Còn 100 ngày
  100: "Hôm nay em thế nào? Kể anh nghe đi, dài bao nhiêu cũng được.",

  // Còn 101 ngày
  101: "Anh để chuông to cả đêm. Em gọi lúc nào anh cũng nghe thấy.",

  // Còn 102 ngày
  102: "Em cứ gửi ảnh đi. Anh chưa chê cái nào bao giờ.",

  // Còn 103 ngày
  103: "Anh thích nghe em kể chuyện linh tinh hơn là nghe nhạc.",

  // Còn 104 ngày
  104: "Anh nghĩ tới cảnh ngồi im cạnh em mà chẳng cần nói gì.",

  // Còn 105 ngày
  105: "Em đừng lo anh có nhớ không. Có.",

  // Còn 106 ngày
  106: "Anh không biết nói ngọt. Nhưng anh về đúng hẹn.",

  // Còn 107 ngày
  107: "Về anh dẫn em đi ăn. Em chọn quán, anh trả tiền.",

  // Còn 108 ngày
  108: "Hôm nào mệt thì nhắn anh một chữ \"mệt\" thôi. Anh hiểu.",

  // Còn 109 ngày
  109: "Em cười là anh quên mất đang định nói gì.",

  // Còn 110 ngày
  110: "Anh nhớ cách em nói chuyện. Nghe là biết em đang vui hay không.",

  // Còn 111 ngày
  111: "Em bận thì cứ bận. Anh không phải việc em phải để tâm cả ngày.",

  // Còn 112 ngày
  112: "Anh giữ hết tin nhắn của em, không xoá cái nào.",

  // Còn 113 ngày
  113: "Em mặc gì cũng hợp. Cái này anh nói thật chứ không nịnh.",

  // Còn 114 ngày
  114: "Anh không giỏi dỗ dành. Nhưng em buồn thì cứ nói.",

  // Còn 115 ngày
  115: "Hôm nay có chuyện gì vui không em? Anh đang cần một chuyện vui.",

  // Còn 116 ngày
  116: "Em thích gì cứ bảo anh. Anh ghi lại hết.",

  // Còn 117 ngày
  117: "Nhớ em nhất là lúc ngồi ăn cơm một mình.",

  // Còn 118 ngày
  118: "Em đừng ngại nhắn trước. Anh thích em nhắn trước.",

  // Còn 119 ngày
  119: "Anh đếm ngày được về, chứ không đếm ngày phải xa.",

  // Còn 120 ngày
  120: "Em cứ đi chơi với bạn đi. Anh thích nghe em kể lúc về.",

  // Còn 121 ngày
  121: "Anh muốn về để cãi nhau xong là làm lành được ngay trong ngày.",

  // Còn 122 ngày
  122: "Em lo được hết, anh biết. Nhưng cần gì thì cứ gọi anh.",

  // Còn 123 ngày
  123: "Anh không cần em đợi cho giỏi. Anh cần em vui.",

  // Còn 124 ngày
  124: "Chuyện gì em cũng kể anh nhé. Chuyện bé tí cũng được.",

  // Còn 125 ngày
  125: "Hôm nào em rảnh thì gọi video. Anh chẳng bận gì đâu.",

  // Còn 126 ngày
  126: "Anh nhìn giờ bên em trước rồi mới nhìn giờ bên này.",

  // Còn 127 ngày
  127: "Em không cần nhắn lại ngay đâu. Anh không giận chuyện đó.",

  // Còn 128 ngày
  128: "Về anh ôm em một cái thật lâu, bù cho mấy tháng này.",

  // Còn 129 ngày
  129: "Anh sợ nhất là em buồn mà không chịu nói.",

  // Còn 130 ngày
  130: "Anh thích cái kiểu em quyết chuyện gì là làm luôn.",

  // Còn 131 ngày
  131: "Anh nhớ em kiểu bình thường thôi. Nhưng ngày nào cũng nhớ.",

  // Còn 132 ngày
  132: "Em nhắn gì anh cũng đọc, kể cả lúc đang bận ngập đầu.",

  // Còn 133 ngày
  133: "Về anh học nấu món em thích. Em dạy anh nhé.",

  // Còn 134 ngày
  134: "Hôm nay em làm được việc gì hay? Anh muốn nghe em khoe.",

  // Còn 135 ngày
  135: "Năm nay anh có mỗi một việc quan trọng. Là về với em.",

  // Còn 136 ngày
  136: "Em cứ nói thẳng với anh. Anh không giỏi đoán ý đâu.",

  // Còn 137 ngày
  137: "Anh thích nhất lúc em nhắn \"anh ơi\".",

  // Còn 138 ngày
  138: "Em kể gì anh cũng nhớ. Hôm nào thử kiểm tra anh xem.",

  // Còn 139 ngày
  139: "Hôm nay anh nghĩ tới em mấy lần, đếm không xuể.",

  // Còn 140 ngày
  140: "Em mà ốm là anh ngồi đây cũng chẳng yên.",

  // Còn 141 ngày
  141: "Anh không hứa trời hứa biển. Anh hứa đúng một ngày.",

  // Còn 142 ngày
  142: "Em cứ sống cho vui. Phần nhớ nhung để anh lo.",

};

/** Toàn bộ kho câu, gom theo nhóm. */
export const MESSAGES = { xa: XA, giua: GIUA, gan: GAN, cuoi: CUOI };
