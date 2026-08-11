# Bản đồ vùng file

| Vùng | Người phụ trách | Quy tắc |
| --- | --- | --- |
| `src/content/units/unit-01.ts` | Builder | Chỉ chứa nội dung Unit 1 theo schema đã duyệt |
| `public/images/unit-01/` | Builder | Ảnh phù hợp trẻ em, có nguồn/quyền dùng |
| `src/components/`, `src/features/` | Owner / engine | Không nhúng nội dung riêng của Unit 1 |
| `supabase/migrations/` | Owner | Mọi bảng bật RLS và có kiểm thử cách ly tài khoản |
| `src/content/schema.ts` | Cả hai | Chỉ đổi khi Owner duyệt và ghi quyết định |
| `docs/DECISIONS.md` | Owner | Ghi mọi thay đổi phạm vi hoặc hợp đồng |

Điểm gặp giữa hai phần là `src/content/schema.ts`. Engine dùng `unit-00-fixture.ts`; nội dung thật dùng cùng schema và được ghép sau.
