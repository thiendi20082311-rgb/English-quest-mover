import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quyền riêng tư và nguồn media | English Quest Movers",
  description:
    "Thông tin về dữ liệu, đăng nhập và nguồn hình ảnh, âm thanh của English Quest Movers.",
};

const dataItems = [
  {
    title: "Tài khoản phụ huynh",
    description:
      "Phụ huynh đăng nhập bằng magic link gửi tới email. Email chỉ dùng để xác thực tài khoản và không hiển thị cho học sinh.",
  },
  {
    title: "Hồ sơ học sinh",
    description:
      "Ứng dụng dùng hồ sơ học tập do phụ huynh quản lý. Trẻ không được yêu cầu nhập tên thật, email, ảnh hoặc thông tin liên hệ.",
  },
  {
    title: "Tiến trình học",
    description:
      "Ứng dụng lưu phần đã hoàn thành, điểm quiz tốt nhất và tổng điểm để kết quả không mất khi tải lại trang.",
  },
];

const safeguards = [
  "Mỗi tài khoản chỉ được đọc dữ liệu thuộc tài khoản đó bằng Row-Level Security.",
  "Không có quảng cáo, thanh toán, chat hoặc bảng xếp hạng công khai.",
  "Trẻ không thể tải ảnh hay đăng nội dung cá nhân lên ứng dụng.",
  "Dữ liệu Slice 0 chỉ được lưu khi thiết bị có kết nối mạng.",
];

const mediaItems = [
  {
    label: "Hình ảnh Unit 1",
    value:
      "Năm hình swing, slide, kite, bench và pond được tạo mới bằng công cụ AI cho dự án, theo phong cách minh họa trẻ em. Hình không sao chép từ sách tham chiếu.",
  },
  {
    label: "Phát âm",
    value:
      "Từ vựng được đọc bằng Web Speech API của trình duyệt với ngôn ngữ en-US. Slice 0 chưa sử dụng file MP3 thu âm.",
  },
  {
    label: "Câu mẫu và câu hỏi",
    value:
      "Toàn bộ câu mẫu, bài luyện ngữ pháp, câu quiz và alt text được viết mới cho Unit 1 ở mức A1.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-800 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-600"
        >
          <span aria-hidden="true">←</span>
          <span className="ml-2">Về trang chủ</span>
        </Link>

        <header className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 px-6 py-10 text-white shadow-xl shadow-sky-900/10 sm:px-10 sm:py-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-cyan-100">
            English Quest Movers
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Quyền riêng tư và nguồn media
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-cyan-50 sm:text-lg">
            Chúng tôi thiết kế Slice 0 để trẻ học tiếng Anh trong một môi
            trường đơn giản, không quảng cáo và không yêu cầu trẻ chia sẻ thông
            tin cá nhân.
          </p>
        </header>

        <section aria-labelledby="data-heading" className="mt-12">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sky-700">
              Dữ liệu
            </p>
            <h2
              id="data-heading"
              className="mt-2 text-2xl font-black tracking-tight sm:text-3xl"
            >
              Ứng dụng lưu những gì?
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Chỉ lưu thông tin cần thiết để phụ huynh đăng nhập và để học sinh
              tiếp tục bài học của mình.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dataItems.map((item, index) => (
              <article
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-base font-black text-sky-800">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="safety-heading"
          className="mt-12 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-md shadow-emerald-900/10">
              <span aria-hidden="true">✓</span>
            </div>
            <div>
              <h2
                id="safety-heading"
                className="text-2xl font-black tracking-tight text-emerald-950"
              >
                Cách chúng tôi bảo vệ dữ liệu
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-emerald-950 sm:text-base">
                {safeguards.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-2 shrink-0 rounded-full bg-emerald-600"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="media-heading" className="mt-12">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-700">
            Nội dung học
          </p>
          <h2
            id="media-heading"
            className="mt-2 text-2xl font-black tracking-tight sm:text-3xl"
          >
            Nguồn media của Unit 1
          </h2>

          <dl className="mt-6 divide-y divide-orange-100 overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm">
            {mediaItems.map((item) => (
              <div key={item.label} className="p-6 sm:grid sm:grid-cols-3 sm:gap-8 sm:p-8">
                <dt className="font-extrabold text-orange-900">{item.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600 sm:col-span-2 sm:mt-0 sm:text-base sm:leading-7">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="mt-12 rounded-3xl bg-slate-900 px-6 py-7 text-slate-100 sm:px-8">
          <h2 className="text-xl font-black">Phạm vi của Slice 0</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Phiên bản đầu tiên hoạt động online. Tính năng offline, audio MP3 thu
            âm thật và Unit 2–12 được hoãn sang các Slice sau. Khi nguồn media
            thay đổi, trang này sẽ được cập nhật để phụ huynh biết rõ.
          </p>
        </aside>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">
          Cập nhật lần cuối: 15/08/2026 · English Quest Movers — Slice 0
        </footer>
      </div>
    </main>
  );
}
