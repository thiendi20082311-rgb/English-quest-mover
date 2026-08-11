<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# English Quest Movers

## Dự án

Website học tiếng Anh A1 cho học sinh, bắt đầu bằng Slice 0: Unit 1 "At the park".

## Quy ước

- Giao diện hướng dẫn bằng tiếng Việt; nội dung học bằng tiếng Anh.
- Giữ code đơn giản, dễ đọc và có kiểu dữ liệu rõ ràng.
- Không thêm tính năng ngoài `SPEC.md`; tôn trọng Non-Goals.
- `src/content/schema.ts` là hợp đồng chung. Chỉ đổi sau khi Owner duyệt và ghi `docs/DECISIONS.md`.
- Nội dung Unit 1 chỉ nằm trong `src/content/units/unit-01.ts` và media Unit 1.
- Engine nằm trong `src/components/` và `src/features/`; không nhúng nội dung riêng của Unit 1 vào engine.
- Không đưa secrets hoặc dữ liệu cá nhân của trẻ em vào repository.

## Cách chạy và kiểm thử

- `pnpm dev`: chạy bản xem trước.
- `pnpm lint`: kiểm tra mã nguồn.
- `pnpm build`: kiểm tra bản triển khai.

## Khi mở Pull Request

- Một issue cho mỗi nhánh và mỗi Pull Request.
- Ghi rõ đã làm gì, thuộc mục nào của SPEC và đã thử những gì.
- Nếu đổi giao diện, kèm ảnh hoặc video ngắn ở 360px và 1280px.
- Chỉ merge khi người còn lại đã review và kiểm tra đạt.
