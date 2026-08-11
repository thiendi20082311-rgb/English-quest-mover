# English Quest Movers — Slice 0

## 1. Tổng quan

Website học tiếng Anh A1 cho học sinh. Slice 0 chứng minh một vòng học hoàn chỉnh cho Unit 1 **At the park**: học từ vựng, học ngữ pháp, làm quiz, xem điểm và tiến trình trên điện thoại hoặc máy tính khi có mạng.

Hướng dẫn hiển thị bằng tiếng Việt; từ, câu mẫu và bài tập bằng tiếng Anh. Nghĩa tiếng Việt chỉ hỗ trợ hiểu từ.

## 2. Mục tiêu

- Học sinh tự đi hết Unit 1 mà không cần người lớn hướng dẫn.
- Điểm và trạng thái hoàn thành không mất sau khi tải lại trang.
- Chạy đúng trên Chrome và Safari ở chiều rộng 360px và 1280px.
- Không có lỗi chặn luồng học.
- Một tài khoản không đọc được dữ liệu của tài khoản khác.

## 3. Phạm vi Slice 0

### Có trong Slice 0

- Trang chủ với ba lối vào: Từ vựng, Ngữ pháp và Quiz.
- Unit 1 có 5 từ, một chủ điểm so sánh hơn, 3 câu luyện tập và 10 câu quiz.
- Flashcard có ảnh, TTS giọng `en-US`, nghĩa và câu mẫu.
- Mỗi lượt quiz lấy 7/10 câu không lặp, có đủ ba dạng câu và có cả từ vựng lẫn ngữ pháp.
- Điểm, thanh tiến trình và trạng thái hoàn thành ba phần.
- Phụ huynh đăng nhập bằng magic link và chọn hồ sơ học sinh.
- Giao diện responsive và dùng được bằng bàn phím.

### Hoãn sang Slice sau

- Offline, hàng đợi đồng bộ và giải quyết xung đột.
- Streak, Unit 2–12 và audio MP3 thu âm thật.
- Bảng điều khiển giáo viên, spaced repetition và huy hiệu.

### Ngoài phạm vi

- Thanh toán, quảng cáo, chat và xếp hạng công khai.
- Cho trẻ nhập tên thật, email, tải ảnh hoặc thông tin cá nhân.
- Sao chép nội dung từ sách tham chiếu.
- Ứng dụng native.

## 4. Điểm và quy tắc hoàn thành

- Hoàn thành Từ vựng lần đầu: 10 điểm.
- Hoàn thành Ngữ pháp lần đầu: 10 điểm.
- Quiz đạt từ 70%: hoàn thành và nhận 20 điểm lần đầu.
- Quiz luôn lưu phần trăm cao nhất.
- Làm lại một hoạt động không cộng điểm lần hai.

Mỗi hoạt động có một `activity_id`: `unit01-vocabulary`, `unit01-grammar`, hoặc `unit01-quiz`. Khóa duy nhất của sổ điểm là `(learner_profile_id, activity_id)`.

## 5. Ba dạng quiz

1. Thấy từ tiếng Anh và chọn nghĩa tiếng Việt.
2. Nhìn hình và chọn từ tiếng Anh.
3. Chọn từ đúng để hoàn thành câu so sánh hơn.

Không dùng kéo-thả.

## 6. Hợp đồng nội dung

`src/content/schema.ts` là nguồn sự thật. Mỗi Unit có:

- Mã, slug, tiêu đề Anh/Việt, mô tả tiếng Việt và cấp độ A1.
- Đúng 5 từ: mã, từ, nghĩa Việt, câu mẫu Anh, ảnh, alt text và nguồn phát âm.
- Đúng một bài ngữ pháp: giải thích Việt, công thức, ví dụ Anh và 3 câu luyện tập.
- Đúng 10 câu quiz thuộc đủ ba dạng; mỗi câu có đáp án và lời giải.
- Điểm thưởng 10/10/20 và ngưỡng quiz 70%.

Mọi mã phải duy nhất; đáp án đúng phải nằm trong lựa chọn; câu hỏi hình ảnh bắt buộc có ảnh và alt text. Chỉ đổi schema sau khi Owner duyệt và ghi `docs/DECISIONS.md`.

## 7. Kiến trúc

- Frontend: Next.js, TypeScript và Tailwind CSS.
- Nội dung: `src/content/units/unit-01.ts`.
- Auth và dữ liệu: Supabase Auth, Postgres và Row-Level Security.
- Tiến trình: đọc/ghi Supabase khi có mạng; không có hàng đợi offline.
- Triển khai: Vercel nối GitHub; mỗi Pull Request có preview URL.

Các bảng Slice 0: `learner_profiles`, `unit_progress`, `reward_ledger`.

## 8. Ranh giới cộng tác

- Engine dùng `unit-00-fixture.ts`; không phụ thuộc nội dung thật trong lúc build.
- Builder sở hữu `unit-01.ts`, ảnh Unit 1 và QA nội dung.
- Owner sở hữu engine, migration Supabase, secrets, merge và production.
- Điểm gặp duy nhất là `src/content/schema.ts`.
- Chi tiết vùng file nằm trong `docs/FILE-MAP.md`.

## 9. Definition of Done

Một tính năng chỉ xong khi:

- Đạt tiêu chí nghiệm thu của issue.
- Có trạng thái loading, empty và error phù hợp.
- Chạy ở 360px và 1280px; dùng được bằng bàn phím và có focus rõ.
- Không có lỗi console nghiêm trọng.
- Không cộng điểm trùng.
- Có kiểm thử chứng minh RLS cách ly tài khoản.
- Nội dung và media không sao chép từ sách, phù hợp trẻ em.
- Người còn lại đã review và bản build đạt.

## 10. Kịch bản nghiệm thu

### A — Flashcard

Xem/nghe đủ 5 từ, hoàn thành và nhận 10 điểm. Tải lại vẫn thấy hoàn thành; làm lại không cộng thêm.

### B — Ngữ pháp

Xem công thức và ví dụ, làm 3 câu luyện tập, nhận 10 điểm. Trả lời sai vẫn tiếp tục được và có lời giải.

### C — Quiz

Lấy 7/10 câu không lặp, có đủ ba dạng. Chấm đúng, lưu điểm tốt nhất; từ 70% mới hoàn thành và nhận 20 điểm lần đầu.

### D — Bảo mật

Cùng tài khoản phụ huynh có thể xem tiến trình sau khi đăng nhập lại. Một tài khoản khác không đọc được dữ liệu đó.

## 11. Các chặng triển khai

1. **Chặng 1 — Nền chung:** chốt schema, tạo fixture, khởi tạo dự án, preview, Supabase và RLS.
2. **Chặng 2 — Song song:** xây engine trên fixture; viết Unit 1 thật theo cùng schema.
3. **Chặng 3 — Ghép và QA:** thay fixture bằng Unit 1, chạy bốn kịch bản nghiệm thu, kiểm tra RLS và deploy production.

Các quyết định thay đổi phạm vi được lưu tại `docs/DECISIONS.md`.
