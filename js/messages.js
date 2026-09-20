/**
 * Kho câu, mỗi ngày hiện một câu.
 *
 * Mỗi câu là một ý đứng riêng được - kiểu châm ngôn, một quan sát về khoảng
 * cách, về chờ đợi, về thời gian. Không tường thuật một cảnh cụ thể, không gắn
 * vào một buổi sáng hay một bữa cơm nào.
 *
 * Bốn nhóm theo số ngày còn lại, đậm dần: nhóm xa nói về khoảng cách và nỗi
 * nhớ, nhóm giữa nói về thời gian và sự bền bỉ, nhóm gần nói về đoạn cuối,
 * nhóm cuối là lúc thôi triết lý mà nói thẳng với nhau.
 *
 * Ký hiệu {em} sẽ được thay bằng tên trong js/config.js.
 * Cứ sửa thoải mái - viết bằng lời của mình vẫn hơn.
 */

/** Còn hơn 90 ngày. Về khoảng cách, nỗi nhớ, và sự vắng mặt. */
const XA = [
  'Khoảng cách không đo bằng cây số. Nó đo bằng số lần muốn quay sang nói một câu mà không có ai ở đó.',
  'Nhớ một người là cách trí nhớ thừa nhận rằng nó đã quen có người đó.',
  'Xa nhau không làm tình cảm nhạt đi. Nó chỉ làm ta thấy rõ hơn mình đang thiếu ai.',
  'Người ta không nhớ nhau vì rảnh. Người ta nhớ nhau vì đã từng quen có nhau.',
  'Có những khoảng trống không ai lấp được. Đó là cách ta biết chỗ ấy vốn thuộc về một người.',
  'Thói quen là thứ ở lại lâu nhất sau khi một người rời đi.',
  'Cô đơn là không có ai bên cạnh. Lẻ loi là có đủ người mà vẫn thiếu một.',
  'Chờ đợi không phải là không làm gì. Chờ đợi là làm mọi thứ, trừ việc quên.',
  'Điều đáng sợ không phải xa nhau lâu, mà là xa nhau rồi thấy cũng bình thường.',
  'Tình cảm bền không nhờ những ngày rực rỡ, mà nhờ những ngày nhạt nhẽo vẫn không buông tay.',
  'Ai cũng nói yêu là cho đi. Thật ra yêu còn là chịu thiếu.',
  'Một người quan trọng hay không, cứ thử vắng mặt họ vài tháng là biết.',
  'Nỗi nhớ không ồn ào. Nó chỉ đứng im ở đó cho đến khi ta chịu nhìn.',
  'Ta không nhớ những dịp đặc biệt. Ta nhớ những buổi chiều chẳng có gì mà có nhau.',
  'Xa nhau dạy người ta một điều khó học: kiên nhẫn mà vẫn không nguội.',
  'Thời gian không chữa lành nỗi nhớ. Nó chỉ dạy ta mang nỗi nhớ mà vẫn sống tiếp.',
  'Có những người ta không gặp mỗi ngày, nhưng nghĩ đến mỗi ngày.',
  'Gần nhau thì dễ thương nhau. Xa nhau mà vẫn thương mới là chuyện đáng kể.',
  'Yêu xa là học cách tin vào điều mình không nhìn thấy.',
  'Khoảng cách chỉ đáng sợ với những người đang tìm cớ.',
  'Người ta bỏ nhau vì hết thương, chứ hiếm ai bỏ nhau chỉ vì xa.',
  'Đi xa mới biết: nhà không phải một địa chỉ, nhà là một người.',
  'Có những điều chỉ khi mất đi tạm thời ta mới biết mình đang có.',
  'Bình yên không phải là không thiếu gì, mà là biết rõ mình đang chờ điều gì.',
  'Nỗi nhớ không cần được nói ra mỗi ngày. Nhưng cần được giữ đều mỗi ngày.',
  'Thương một người ở xa là chấp nhận yêu phần lớn bằng trí nhớ.',
  'Ta không sợ đường dài. Ta chỉ sợ đi mãi mà không thấy ai ở cuối đường.',
  'Một mối quan hệ không đứt vì khoảng cách. Nó đứt vì im lặng.',
  'Người trưởng thành không hứa sẽ không bao giờ đi. Họ hứa sẽ luôn quay về.',
  'Có thứ càng đếm càng ngắn. Có thứ càng đếm càng thấy mình bền.',
  'Ngày thường trôi rất nhanh khi có nhau, và rất chậm khi không.',
  'Nhớ nhiều không làm ta yếu đi. Nó chỉ nhắc ta biết mình đang sống vì điều gì.',
  'Mọi chuyến đi xa đều có hai phần: phần rời đi và phần quay về. Phần thứ hai mới đáng kể.',
  'Yêu nhau là hai người cùng nhìn về một ngày, dù đang đứng ở hai múi giờ.',
  'Khoảng cách làm mọi lời nói trở nên đắt hơn. Vì vậy hãy nói những lời đáng nói.',
  'Đợi một người mà thấy đáng, thì thời gian không còn là mất mát.',
  'Những điều nhỏ mới là thứ khó thay thế nhất.',
  'Ta thường chỉ nhận ra một người quan trọng qua những việc rất tầm thường họ từng làm.',
  'Không phải ngày nào cũng nhớ dữ dội. Nhưng ngày nào cũng nhớ.',
  'Có những tình cảm không cần chứng minh mỗi ngày, chỉ cần không phản bội mỗi ngày.',
  'Người ta có thể quen với việc thiếu một người. Nhưng quen không có nghĩa là chấp nhận.',
  'Xa nhau là bài kiểm tra mà cả hai cùng phải qua, không ai làm hộ ai được.',
  'Mùa nào rồi cũng đổi. Thứ không đổi mới là thứ đáng giữ.',
  'Sự tử tế của tình yêu nằm ở chỗ người ở lại cũng vất vả không kém người ra đi.',
  'Ai cũng muốn được yêu nhiều. Ít ai chịu được yêu lâu.',
  'Điều làm ta cố gắng thường không phải một mục tiêu, mà là một người.',
  'Một ngày qua đi chẳng là gì. Nhưng ngày nào cũng qua đi thì thành một đoạn đường.',
  'Tình cảm giống như đường về: xa hay gần là do mình có định đi hay không.',
  'Có người khiến ta muốn trở thành bản tốt hơn của chính mình, kể cả khi họ không nhìn thấy.',
  'Xa cách chỉ là một chương. Không ai đọc một cuốn sách rồi dừng lại ở giữa.',
];

/** Còn 31 tới 90 ngày. Về thời gian, sự bền bỉ, và đoạn giữa khó nhất. */
const GIUA = [
  'Thời gian đi nhanh với người đang vui và đi chậm với người đang đợi. Vẫn là một cái đồng hồ.',
  'Đếm ngược là cách con người biến sự chờ đợi thành một thứ nhìn thấy được.',
  'Đoạn giữa bao giờ cũng khó nhất. Lúc mới bắt đầu còn hăng, lúc sắp xong đã thấy đích.',
  'Kiên nhẫn không phải là chờ giỏi. Kiên nhẫn là giữ được sự tử tế trong lúc chờ.',
  'Mỗi ngày trôi qua đều lấy đi một chút của quãng đường còn lại.',
  'Việc lớn không hoàn thành trong một ngày, nhưng được hoàn thành bằng từng ngày.',
  'Người ta thường bỏ cuộc ở chỗ gần đến, chỉ vì không biết mình đã gần đến.',
  'Cái khó của chặng giữa là không còn mới mẻ mà cũng chưa thấy kết thúc.',
  'Thứ đều đặn bao giờ cũng mạnh hơn thứ mãnh liệt.',
  'Một lời hứa chỉ có giá trị khi nó còn được giữ vào ngày người ta mệt nhất.',
  'Mùa đông không kéo dài mãi. Chưa năm nào như thế cả.',
  'Giữ ấm cho nhau không nhất thiết phải ở cạnh nhau.',
  'Có những ngày ta không tiến thêm được bước nào. Không sao, miễn là không lùi.',
  'Chờ đợi dễ chịu hơn nhiều khi ta biết rõ mình đang chờ ai.',
  'Thời gian không công bằng với ai cả, nhưng nó luôn đi về phía trước.',
  'Người biết đợi không phải người chậm. Là người chắc.',
  'Hy vọng không phải là tin chắc mọi chuyện sẽ tốt, mà là vẫn cố dù chưa chắc.',
  'Nửa đường là chỗ dễ nản nhất, và cũng là chỗ quay lại cũng xa như đi tiếp.',
  'Đừng đo tình cảm bằng những ngày dễ dàng.',
  'Mọi cuộc chờ đợi đều có một ngày cuối cùng.',
  'Cái giá của một điều đáng giá thường là thời gian.',
  'Người ta không mạnh lên vì chuyện dễ. Người ta mạnh lên vì chịu được chuyện dài.',
  'Cuối năm là lúc người ta đếm lại xem mình còn giữ được gì.',
  'Điều tốt nhất của một năm khó khăn là nó vẫn sẽ kết thúc.',
  'Xa nhau một mùa không đáng kể gì, nếu sau đó là rất nhiều mùa có nhau.',
  'Càng gần ngày hẹn, thời gian càng như trêu người.',
  'Nhớ là việc của trái tim, đếm là việc của lý trí. Cả hai đang làm cùng một việc.',
  'Có những con số càng nhỏ lại càng khiến người ta vui.',
  'Sự bền bỉ hiếm khi trông oai. Nó chỉ trông rất bình thường, lặp đi lặp lại.',
  'Ta không rút ngắn được thời gian, nhưng sống tử tế trong lúc chờ thì được.',
  'Người lớn không đòi mọi thứ ngay. Họ học cách đợi mà không oán.',
  'Giữa hai người thật lòng, im lặng không phải là xa cách.',
  'Điều đáng quý của một lời hứa là nó được giữ cả khi không ai giám sát.',
  'Một mùa lạnh sẽ qua nhanh hơn nếu biết cuối mùa có ai đang đợi.',
  'Đường dài không đáng sợ bằng đi một mình. Mà ta thì không đi một mình.',
  'Thời gian lấy đi nhiều thứ, nhưng cũng đưa ta đến gần những điều mình mong.',
  'Việc của hôm nay là sống cho xong hôm nay. Ngày mai tự khắc đến.',
  'Không ai đợi mà không mệt. Nhưng có những cái mệt đáng chịu.',
  'Người ta hay nói còn lâu. Thật ra chưa có cái gì là lâu mãi.',
  'Cái hay của đếm ngược là nó chỉ đi một chiều.',
  'Điều gì đến đúng lúc thì đáng chờ, dù chờ hơi lâu.',
  'Ta không chọn được hoàn cảnh, nhưng chọn được cách cư xử trong hoàn cảnh đó.',
  'Một mối quan hệ tốt là nơi cả hai cùng cố, chứ không phải một người cố gấp đôi.',
  'Nhớ đúng một người trong thời gian dài là một dạng chung thuỷ ít ai khen.',
  'Càng về cuối, mỗi ngày càng đáng giá hơn ngày trước.',
  'Những gì bền bỉ đều bắt đầu bằng việc không bỏ cuộc vào một ngày rất bình thường.',
  'Đừng đếm những ngày đã mất. Đếm những ngày còn lại thì hơn.',
  'Không có đường tắt cho những thứ cần thời gian.',
  'Có những niềm vui phải để dành, và để dành cũng là một phần của niềm vui.',
  'Người ta thường đánh giá thấp sức mạnh của việc cứ tiếp tục.',
  'Mùa đông tồn tại để người ta biết quý hơi ấm.',
  'Khi không thể đi nhanh hơn, hãy đi cho đều.',
  'Thứ ta chờ càng rõ ràng thì việc chờ càng dễ chịu.',
  'Lòng tin là thứ giữ hai người lại với nhau khi khoảng cách cố kéo họ ra.',
  'Mỗi buổi sáng là một lần con số nhỏ đi.',
  'Có những ngày chẳng có gì xảy ra. Đó cũng là những ngày đưa ta tới gần hơn.',
  'Trưởng thành là biết rằng điều mình muốn không nhất thiết phải có ngay.',
  'Cuối một con đường dài bao giờ cũng là một điều rất giản dị.',
  'Đợi lâu không làm người ta chai sạn, nếu biết vì sao mình đợi.',
  'Không phải ai cũng chịu được đoạn giữa. Ai qua được đoạn đó mới tới đoạn cuối.',
  'Điều đáng mong nhất năm nay hoá ra rất đơn giản: được về.',
  'Một năm có bốn mùa, và mùa nào rồi cũng qua.',
  'Hai người cùng đếm một con số thì con số đó không còn là con số nữa.',
  'Sắp tới rồi. Câu này mỗi ngày lại đúng hơn hôm qua.',
];

/** Còn 8 tới 30 ngày. Về đoạn cuối, sự hồi hộp, và ngày sắp tới. */
const GAN = [
  'Chặng cuối bao giờ cũng dài hơn nó vốn có.',
  'Càng gần đích, thời gian càng cố tình đi chậm.',
  'Hồi hộp là cách cơ thể báo rằng điều sắp tới thật sự quan trọng.',
  'Chuẩn bị cho một ngày vui cũng đã là một phần của niềm vui.',
  'Những ngày cuối của việc chờ đợi thường khó hơn tất cả những ngày trước cộng lại.',
  'Đã đi được đến đây thì không có lý do gì để sốt ruột.',
  'Điều sắp xảy ra bao giờ cũng khiến hiện tại trở nên bồn chồn.',
  'Đếm được bằng đầu ngón tay là lúc mọi thứ bắt đầu thành thật.',
  'Sự chờ đợi sắp kết thúc luôn ngọt hơn sự chờ đợi vừa bắt đầu.',
  'Càng gần ngày gặp, những chuyện nhỏ càng dễ khiến người ta xúc động.',
  'Cuối cùng thì mọi con đường dài đều có đoạn cuối.',
  'Niềm vui lớn nhất thường đến sau quãng chờ dài nhất.',
  'Không còn nhiều ngày nữa để nhớ theo kiểu cũ.',
  'Có những ngày ta sống chỉ để chờ một ngày khác.',
  'Gói ghém đồ đạc cũng là gói ghém lại một quãng thời gian.',
  'Sắp gặp lại là lúc người ta bỗng nhớ ra cả những điều tưởng đã quên.',
  'Mọi cuộc trở về đều bắt đầu từ một ngày rất bình thường.',
  'Khi đích đã hiện ra, mệt mỏi cũng nhẹ đi một nửa.',
  'Điều khó nhất của đoạn cuối là giữ được bình tĩnh.',
  'Chuyện gì chờ lâu rồi cũng đến, chỉ là không sớm hơn được.',
  'Tết không nằm ở mâm cỗ. Tết nằm ở chỗ ai cũng có nơi để về.',
  'Một năm được đo không phải bằng ngày tháng, mà bằng những lần đoàn tụ.',
  'Người đi xa nào rồi cũng có ngày quay đầu về phía nhà.',
  'Sắp hết những ngày phải nhìn nhau qua màn hình.',
  'Điều đáng mong nhất lúc này lại là thứ giản dị nhất: được ngồi cạnh nhau.',
  'Những ngày cuối cùng của chờ đợi cũng là những ngày đẹp nhất của nó.',
  'Ngày ấy đã gần đến mức có thể gọi tên.',
  'Chờ đến đây rồi thì mấy hôm nữa chẳng là gì.',
];

/**
 * Còn 1 tới 7 ngày. Nhóm này chạy theo thứ tự chứ không xoay vòng, nên số câu
 * phải bằng đúng số ngày nó phủ - bảy câu cho bảy ngày.
 *
 * Nhiều hơn bảy thì mấy câu đầu không bao giờ được dùng và cả dãy bị đẩy lệch:
 * câu viết cho ngày về sẽ rơi vào hôm trước đó.
 *
 * Câu cuối cùng là của ngày còn đúng 1. Ngày chạm 0 đã có màn hình riêng với
 * bức thư trong js/config.js, không lấy câu từ đây.
 */
const CUOI = [
  'Chặng cuối rồi. Từ đây trở đi mỗi ngày đều đáng kể.',
  'Những ngày cuối cùng của một cuộc chờ đợi luôn trôi chậm nhất.',
  'Sắp đến lúc không cần đếm nữa.',
  'Mọi con đường dài đều kết thúc bằng một bước chân rất bình thường.',
  'Đã đi hết quãng xa, giờ chỉ còn quãng gần, {em}.',
  'Đồ đã xếp xong. Chỉ còn hai đêm nữa thôi.',
  'Mai là ngày đó. Ngủ ngon nhé, {em}.',
];

/** Toàn bộ kho câu, gom theo nhóm. */
export const MESSAGES = { xa: XA, giua: GIUA, gan: GAN, cuoi: CUOI };
