import Link from "next/link";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Find your course",
    desc: "Search by course name, code, or university. Browse resources uploaded by students who took it before you.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M17 8l-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    ),
    title: "Upload your materials",
    desc: "Create a course folder and upload PDFs, past papers, and notes. Help the next cohort skip the hunt.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Ace your exams",
    desc: "Download everything in one place. No more scattered links or broken Drive shares.",
  },
];

const testimonials = [
  {
    quote:
      "I spent my first two years begging seniors for past questions on WhatsApp. CourseShare would have saved me hundreds of hours.",
    name: "Chidinma O.",
    role: "Computer Science, UNILAG",
  },
  {
    quote:
      "Uploaded all my 300-level notes in one evening. Three months later, juniors were still thanking me for it.",
    name: "Tunde A.",
    role: "Electrical Engineering, OAU",
  },
  {
    quote:
      "The week before exams used to be chaos — hunting for slides across five group chats. Now it's one search.",
    name: "Fatima B.",
    role: "Economics, ABU Zaria",
  },
];

const faqs = [
  {
    q: "Is CourseShare really free?",
    a: "Yes — completely free, forever. It's an open-source project built by students, for students. No premium tiers, no locked features.",
  },
  {
    q: "Who can upload resources?",
    a: "Anyone with an account. Create a course folder for any course at any university, then upload PDFs, slides, past papers, or notes up to 50 MB per file.",
  },
  {
    q: "What about copyrighted material?",
    a: "Upload only material you have the right to share — your own notes, past questions, and openly licensed resources. Anything reported for copyright is reviewed and removed.",
  },
  {
    q: "My course isn't listed. What do I do?",
    a: "Create it yourself in under a minute — just the course name, code, university, and semester. It's immediately visible to every other student.",
  },
  {
    q: "Can I delete something I uploaded?",
    a: "Yes. You can delete your own uploads at any time from the course page. Only you (and moderators) can remove your files.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-20 text-center sm:pt-28">
          <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-[13px] font-medium text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Open source, free forever
          </div>

          <h1 className="animate-fade-up mx-auto mb-5 max-w-3xl text-4xl font-semibold leading-[1.08] text-zinc-900 sm:text-6xl">
            Every course. Every semester.
            <br />
            <span className="text-indigo-600">All in one place.</span>
          </h1>

          <p className="animate-fade-up-delay-1 mx-auto mb-9 max-w-xl text-lg leading-relaxed text-zinc-600">
            Stop chasing PDFs across WhatsApp groups. CourseShare is where
            students upload and share course resources — so the next cohort
            starts ahead.
          </p>

          <div className="animate-fade-up-delay-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Courses
                <svg className="ml-2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Upload Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              How it works
            </p>
            <h2 className="text-3xl font-semibold text-zinc-900">
              Three steps to a stress-free semester
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {steps.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 bg-white p-7"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    {icon}
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Testimonials
            </p>
            <h2 className="text-3xl font-semibold text-zinc-900">
              Loved by students everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <figure
                key={name}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-7"
              >
                <svg className="mb-4 text-indigo-300" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.3 5.1C7.6 7.3 5.4 10.4 5.4 14.5c0 2.8 1.7 4.4 3.8 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.9-1.3-3.1-3-3.1-.3 0-.7 0-.8.1.3-2 2-4.1 4-5.3l-1.4-2.3zm8.4 0c-3.7 2.2-5.9 5.3-5.9 9.4 0 2.8 1.7 4.4 3.8 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.9-1.3-3.1-3-3.1-.3 0-.7 0-.8.1.3-2 2-4.1 4-5.3l-1.4-2.3z" />
                </svg>
                <blockquote className="mb-6 flex-1 text-[15px] leading-relaxed text-zinc-600">
                  {quote}
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold text-zinc-900">{name}</p>
                  <p className="text-[13px] text-zinc-500">{role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold text-zinc-900">
                Frequently asked questions
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-zinc-200 bg-white px-6 py-4 open:pb-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-zinc-800 [&::-webkit-details-marker]:hidden">
                    {q}
                    <svg
                      className="shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-45"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/60" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-indigo-500/40" />

            <div className="relative">
              <h2 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">
                Took a course? Pay it forward.
              </h2>
              <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-indigo-100">
                Your old notes and past papers are gold to the students coming
                after you. Upload them in under a minute.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-indigo-700 transition hover:bg-indigo-50 active:scale-[0.98] sm:w-auto"
                >
                  Get started free
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex w-full items-center justify-center rounded-full border border-indigo-400 px-7 py-3 text-[15px] font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98] sm:w-auto"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
