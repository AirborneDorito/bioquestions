import React, { useMemo, useState } from "react";

// vSeek — VCE Biology 2022–2024 hardest questions browser
// Updated to embed PDFs from simplestudy CDN directly in a side panel

export default function VSeekApp() {
  type QType = "MCQ" | "SAQ";
  type Source = { label: string; url: string };
  type PdfRef = { src: string; page?: number };

  type QuestionItem = {
    id: string;
    year: 2022 | 2023 | 2024;
    type: QType;
    qref: string;
    topic: string;
    areaOfStudy?: string;
    difficultyValue: number;
    difficultyLabel: string;
    question: string;
    answer: string;
    options?: string[];
    correctOption?: string;
    pdfExam?: PdfRef;
    pdfReport?: PdfRef;
    sources: Source[];
    extraTags?: string[];
  };

  const DATA: QuestionItem[] = [
    {
      id: "2023-Q22",
      year: 2023,
      type: "MCQ",
      qref: "Q22",
      topic: "Antigen presentation",
      areaOfStudy: "Unit 3 AOS2",
      difficultyValue: 53,
      difficultyLabel: "53% correct",
      question: "Allergens are presented by antigen presenting cells to T cells using which molecules?",
      options: [
        "A. Antibodies",
        "B. Interleukins",
        "C. Complement proteins",
        "D. MHC proteins",
      ],
      correctOption: "D",
      answer: "MHC proteins present antigens to T cells.",
      pdfExam: { src: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2023-qp-hd7x5al.pdf", page: 8 },
      pdfReport: { src: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2023-ms-hd7x5al.pdf", page: 4 },
      sources: [
        { label: "2023 exam paper", url: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2023-qp-hd7x5al.pdf" },
        { label: "2023 exam report", url: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2023-ms-hd7x5al.pdf" },
      ],
      extraTags: ["immunity"],
    },
    {
      id: "2022-Q23",
      year: 2022,
      type: "MCQ",
      qref: "Q23",
      topic: "Epidemiology",
      areaOfStudy: "Science skills",
      difficultyValue: 28,
      difficultyLabel: "28% correct",
      question: "From a measles incubation infographic (7–21 days), determine the minimum isolation period.",
      options: ["A. 14 days", "B. 21 days", "C. 7 days", "D. 10 days"],
      correctOption: "B",
      answer: "21 days is needed to cover the full incubation range.",
      
      pdfReport: { src: "https://www.vcaa.vic.edu.au/Documents/exams/biology/2022/2022biology-emark-cpr-w.pdf", page: 1 },
      sources: [
        { label: "2022 exam paper", url: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2022-qp-hd7x5al.pdf" },
        { label: "2022 examiner report", url: "https://www.vcaa.vic.edu.au/Documents/exams/biology/2022/2022biology-emark-cpr-w.pdf" },
      ],
      extraTags: ["public health"],
    },
    {
      id: "2024-Q3a",
      year: 2024,
      type: "SAQ",
      qref: "Q3a",
      topic: "Fermentation graph reasoning",
      areaOfStudy: "Unit 3 AOS2",
      difficultyValue: 0.5,
      difficultyLabel: "Avg 0.5/2",
      question: "From a glucose over time graph, explain why glucose does not fall to zero after about 500 hours.",
      answer: "Residual substrate; limits on pathway rates; competing processes; measurement resolution.",
      pdfExam: { src: "https://www.vcaa.vic.edu.au/sites/default/files/2025-03/2024biology-w.pdf" },
      pdfReport: { src: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2024-ms-hd7x5al.pdf", page: 5 },
      sources: [
        { label: "2024 exam paper", url: "https://www.vcaa.vic.edu.au/sites/default/files/2025-03/2024biology-w.pdf" },
        { label: "2024 exam report", url: "https://cdn.simplestudy.io/assets/backend/uploads/exam_papers/VCE-Biology-2024-ms-hd7x5al.pdf" },
      ],
      extraTags: ["graphs", "science skills"],
    },
  ];

  const accent = {
    border: "border-green-200",
    btn: "bg-green-600 hover:bg-green-700 text-white",
    btnGhost: "hover:bg-green-50",
    link: "text-green-700 hover:underline",
  } as const;

  const [modeMCQ, setModeMCQ] = useState(true);
  const [modeSAQ, setModeSAQ] = useState(true);
  const [yearFilter, setYearFilter] = useState<(2022 | 2023 | 2024)[]>([2022, 2023, 2024]);
  const [query, setQuery] = useState("");
  const [pdfPane, setPdfPane] = useState<{ title: string; url: string } | null>(null);

  function openPdf(ref?: PdfRef, title?: string) {
    if (!ref?.src) return;
    const href = `${ref.src}${ref.page ? `#page=${ref.page}` : ""}`;
    setPdfPane({ title: title || "Document", url: href });
  }

  function PdfPane() {
    if (!pdfPane) return null;
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-[60%] bg-white border-l border-green-300 shadow-2xl z-40 flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="font-semibold text-green-900">{pdfPane.title}</div>
          <button onClick={() => setPdfPane(null)} className="px-3 py-1 border rounded">Close</button>
        </div>
        <iframe title={pdfPane.title} src={pdfPane.url} className="flex-1 w-full" />
      </div>
    );
  }

  function OptionRow({ text, isCorrect }: { text: string; isCorrect?: boolean }) {
    return (
      <li className={`px-3 py-2 rounded-lg border ${accent.border} ${isCorrect ? "font-semibold" : ""}`}>
        {text}
        {isCorrect && <span className="ml-2 text-xs bg-green-100 px-2 py-0.5 rounded-full">correct</span>}
      </li>
    );
  }

  function ItemCard({ q }: { q: QuestionItem }) {
    const [open, setOpen] = useState(false);
    return (
      <div className={`rounded-2xl border ${accent.border} p-4 mb-4 bg-white`}>
        <div className="flex justify-between">
          <div>
            <div className="text-sm opacity-70">{q.type} • {q.qref}</div>
            <h3 className="font-semibold">{q.topic}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-70">Difficulty</div>
            <div className="font-bold">{q.difficultyLabel}</div>
          </div>
        </div>
        <button className={`mt-3 w-full border ${accent.border} px-3 py-2 ${accent.btnGhost}`} onClick={() => setOpen(!open)}>
          {open ? "Hide" : "Show"} details
        </button>
        {open && (
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-xs opacity-60">Question</div>
              <p>{q.question}</p>
              {q.type === "MCQ" && q.options && (
                <ul className="mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <OptionRow key={i} text={opt} isCorrect={q.correctOption === String.fromCharCode(65 + i)} />
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="text-xs opacity-60">Answer</div>
              <p>{q.answer}</p>
            </div>
            <div className="flex gap-2">
              {q.pdfExam && <button onClick={() => openPdf(q.pdfExam, `${q.year} exam • ${q.qref}`)} className={accent.btn}>Show exam page</button>}
              {q.pdfReport && <button onClick={() => openPdf(q.pdfReport, `${q.year} report • ${q.qref}`)} className={accent.btn}>Show report page</button>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen">
      <PdfPane />
      <h1 className="text-2xl font-bold text-green-900 mb-6">vSeek — VCE Biology hardest questions</h1>
      <div>
        {DATA.map((q) => (
          <ItemCard key={q.id} q={q} />
        ))}
      </div>
    </div>
  );
}
