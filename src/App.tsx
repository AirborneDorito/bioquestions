import React, { useMemo, useState, useRef, useEffect } from 'react';
import PdfPageCanvas from './PdfPageCanvas';

// Types
type Provider = 'VCAA' | 'Other';
type PdfRef = { src: string; page: number };

type AIFields = {
  rationale?: string;
  steps?: string[];
  distractorReasons?: Record<string, string>;
  learningObjectives?: string[];
  relatedConcepts?: string[];
};

interface QuestionItem {
  id: string;
  year: number;
  provider: Provider;
  type: 'MCQ' | 'SAQ';
  qref: string;
  topic: string;
  areaOfStudy?: string;
  difficultyValue: number;
  difficultyLabel: string;
  question: string;
  options?: string[];
  correctOption?: string;
  answer: string;
  examPdf: PdfRef;
  reportPdf: PdfRef;
  extraTags?: string[];
  ai?: AIFields;
}

// Data
const BASE = 'https://AirborneDorito.github.io/bioquestions/pdfs';

const QUESTIONS: QuestionItem[] = [
  {
    id: '2023-Q22',
    year: 2023,
    provider: 'VCAA',
    type: 'MCQ',
    qref: 'Q22',
    topic: 'Antigen presentation',
    areaOfStudy: 'Unit 3 AOS2',
    difficultyValue: 53,
    difficultyLabel: '53% correct',
    question:
      'Allergens are presented by antigen presenting cells to T cells using which molecules?',
    options: [
      'A. Antibodies',
      'B. Interleukins',
      'C. Complement proteins',
      'D. MHC proteins',
    ],
    correctOption: 'D',
    answer: 'MHC proteins present antigens to T cells.',
    examPdf: { src: `${BASE}/2023vcebio.pdf`, page: 8 },
    reportPdf: { src: `${BASE}/2023vcebioreport.pdf`, page: 4 },
    extraTags: ['immunity'],
    ai: {
      learningObjectives: ['antigen presentation', 'adaptive immunity'],
      relatedConcepts: ['MHC', 'T cell receptor', 'APC', 'HLA'],
    },
  },
  {
    id: '2022-Q23',
    year: 2022,
    provider: 'VCAA',
    type: 'MCQ',
    qref: 'Q23',
    topic: 'Epidemiology',
    areaOfStudy: 'Science skills',
    difficultyValue: 28,
    difficultyLabel: '28% correct',
    question:
      'From a measles incubation infographic, 7 to 21 days, determine the minimum isolation period.',
    options: ['A. 14 days', 'B. 21 days', 'C. 7 days', 'D. 10 days'],
    correctOption: 'B',
    answer: 'Twenty-one days covers the longest incubation period.',
    examPdf: { src: `${BASE}/2022vcebio.pdf`, page: 7 },
    reportPdf: { src: `${BASE}/2022vcebioreport.pdf`, page: 3 },
    extraTags: ['public health'],
    ai: {
      relatedConcepts: [
        'incubation period',
        'quarantine',
        'infectious disease',
      ],
    },
  },
  {
    id: '2024-Q29',
    year: 2024,
    provider: 'VCAA',
    type: 'MCQ',
    qref: 'Q29',
    topic: 'Population genetics',
    areaOfStudy: 'Unit 4 AOS1',
    difficultyValue: 27,
    difficultyLabel: '27% correct',
    question:
      'Two cages of mice were bred over generations. Which process best explains the allele frequency change?',
    options: [
      'A. Natural selection',
      'B. Gene flow',
      'C. Genetic drift',
      'D. Mutation',
    ],
    correctOption: 'C',
    answer: 'Genetic drift is stronger in smaller populations.',
    examPdf: { src: `${BASE}/2024vcebio.pdf`, page: 15 },
    reportPdf: { src: `${BASE}/2024vcebioreport.pdf`, page: 6 },
    extraTags: ['data interpretation'],
    ai: {
      relatedConcepts: [
        'allele frequency',
        'sampling error',
        'bottleneck',
        'founder effect',
      ],
    },
  },
  {
    id: '2023-Q30',
    year: 2023,
    provider: 'VCAA',
    type: 'SAQ',
    qref: 'Q30a',
    topic: 'Cellular respiration',
    areaOfStudy: 'Unit 1 AOS1',
    difficultyValue: 45,
    difficultyLabel: 'Avg 1.2/3',
    question:
      'Explain the role of NAD+ in cellular respiration and describe what happens when it becomes reduced.',
    answer: 'NAD+ accepts electrons to become NADH, which donates to ETC.',
    examPdf: { src: `${BASE}/2023vcebio.pdf`, page: 13 },
    reportPdf: { src: `${BASE}/2023vcebioreport.pdf`, page: 6 },
    extraTags: ['metabolism', 'biochemistry'],
    ai: {
      relatedConcepts: ['redox', 'coenzymes', 'glycolysis', 'Krebs cycle'],
    },
  },
  {
    id: '2022-Q25',
    year: 2022,
    provider: 'VCAA',
    type: 'SAQ',
    qref: 'Q25b',
    topic: 'Photosynthesis',
    areaOfStudy: 'Unit 1 AOS1',
    difficultyValue: 38,
    difficultyLabel: 'Avg 0.8/2',
    question: 'Compare the light dependent and light independent reactions.',
    answer:
      'Light dependent in thylakoids makes ATP/NADPH. Light independent in stroma fixes CO₂ to sugars.',
    examPdf: { src: `${BASE}/2022vcebio.pdf`, page: 10 },
    reportPdf: { src: `${BASE}/2022vcebioreport.pdf`, page: 5 },
    extraTags: ['metabolism', 'plant biology'],
    ai: { relatedConcepts: ['Calvin cycle', 'photolysis', 'chloroplast'] },
  },
];

// Search
const SYNONYMS: Record<string, string[]> = {
  respiration: ['cellular respiration', 'etc', 'electron transport', 'aerobic'],
  photosynthesis: ['calvin cycle', 'light dependent', 'light independent'],
  selection: ['natural selection', 'fitness', 'adaptation'],
  drift: ['genetic drift', 'sampling error', 'bottleneck', 'founder'],
  antigen: ['mhc', 'hka', 'hla', 't cell', 'apc', 'presentation'],
  quarantine: ['isolation', 'incubation', 'infectious'],
};

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stem(w: string) {
  return w
    .replace(/(ing|ed|ly|ious|ies|ive|es|s)$/i, '')
    .replace(/(tion|sion)$/i, 't');
}

function tokenize(query: string): string[][] {
  const q = norm(query);
  const phrases: string[] = [];
  const phraseRegex = /"([^"]+)"/g;
  let m: RegExpExecArray | null;
  let rest = q;
  while ((m = phraseRegex.exec(q))) {
    phrases.push(m[1]);
    rest = rest.replace(m[0], ' ');
  }
  const words = rest.split(' ').filter(Boolean);

  const buckets: string[][] = [];
  for (const ph of phrases) {
    const base = stem(ph);
    buckets.push([ph, base, ...(SYNONYMS[base] || [])]);
  }
  for (const w of words) {
    const base = stem(w);
    const syns = SYNONYMS[base] || [];
    buckets.push([w, base, ...syns]);
  }
  return buckets;
}

function buildSearchText(q: QuestionItem) {
  return norm(
    [
      q.question,
      q.answer,
      q.topic,
      q.qref,
      q.areaOfStudy || '',
      q.year,
      q.provider,
      (q.options || []).join(' '),
      (q.extraTags || []).join(' '),
      ...(q.ai?.relatedConcepts || []),
      ...(q.ai?.learningObjectives || []),
    ].join(' ')
  );
}

function searchQuestions(items: QuestionItem[], query: string) {
  const buckets = tokenize(query);
  if (buckets.length === 0) return items;

  const cache = new Map<string, string>();
  const textOf = (q: QuestionItem) => {
    const c = cache.get(q.id);
    if (c) return c;
    const t = buildSearchText(q);
    cache.set(q.id, t);
    return t;
  };

  return items.filter((item) => {
    const t = textOf(item);
    return buckets.every((alts) => alts.some((tok) => t.includes(norm(tok))));
  });
}

// UI bits
function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'year' | 'type-mcq' | 'type-saq' | 'provider';
}) {
  const styles: Record<string, string> = {
    default: 'bg-green-50 text-green-700 border-green-200',
    year: 'bg-gray-100 text-gray-700 border-gray-300',
    'type-mcq': 'bg-blue-50 text-blue-700 border-blue-200',
    'type-saq': 'bg-purple-50 text-purple-700 border-purple-200',
    provider: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-[2px] text-xs leading-none rounded border ${styles[variant]} mr-1 mb-1`}
    >
      {children}
    </span>
  );
}

function SegmentedType({
  showMCQ,
  showSAQ,
  onToggle,
}: {
  showMCQ: boolean;
  showSAQ: boolean;
  onToggle: (key: 'MCQ' | 'SAQ') => void;
}) {
  return (
    <div className="w-full">
      <div className="text-sm font-medium text-gray-700 mb-3">
        Question type
      </div>
      <div className="relative w-full max-w-xs select-none">
        <div className="relative grid grid-cols-2 rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
          <span
            className={`absolute inset-y-1 left-1 w-[calc(50%-0.5rem)] rounded-full bg-blue-100 shadow transition-all duration-200 ${
              showMCQ ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ zIndex: 0 }}
            aria-hidden
          />
          <span
            className={`absolute inset-y-1 right-1 w-[calc(50%-0.5rem)] rounded-full bg-purple-100 shadow transition-all duration-200 ${
              showSAQ ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ zIndex: 0 }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => onToggle('MCQ')}
            className="relative z-10 px-4 py-2 text-sm font-medium"
          >
            MCQ
          </button>
          <button
            type="button"
            onClick={() => onToggle('SAQ')}
            className="relative z-10 px-4 py-2 text-sm font-medium"
          >
            SAQ
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500">Toggle either or both</div>
      </div>
    </div>
  );
}

function YearButton({
  year,
  selectedYears,
  onToggle,
}: {
  year: number;
  selectedYears: number[];
  onToggle: (y: number) => void;
}) {
  const isSelected = selectedYears.includes(year);
  return (
    <button
      onClick={() => onToggle(year)}
      className={`px-3 py-1 text-sm border rounded transition-colors ${
        isSelected
          ? 'bg-green-600 text-white border-green-600'
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
      style={{ width: 72 }}
      aria-pressed={isSelected}
    >
      {year}
    </button>
  );
}

// Background, stable across page length changes
const ICONS = [
  '/icons/dna_3d.png',
  '/icons/microbe_3d.png',
  '/icons/seedling_3d.png',
  '/icons/microscope_3d.png',
  '/icons/test_tube_3d.png',
  '/icons/bone_3d.png',
  '/icons/green_heart_3d.png',
  '/icons/herb_3d.png',
];

function EmojiBackgroundEven({
  count = 24,
  jitter = 7,
}: {
  count?: number;
  jitter?: number;
}) {
  // Generate once per mount so icons do not jump when content height changes
  const layout = useMemo(() => {
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    const clamp = (v: number, min = 0, max = 100) =>
      Math.max(min, Math.min(max, v));
    return Array.from({ length: count }).map((_, i) => {
      const src = ICONS[i % ICONS.length];
      const r = Math.floor(i / cols);
      const c = i % cols;
      const cellTop = ((r + 0.5) / rows) * 100;
      const cellLeft = ((c + 0.5) / cols) * 100;
      const offT = (Math.random() * 2 - 1) * jitter;
      const offL = (Math.random() * 2 - 1) * jitter;
      const top = clamp(cellTop + offT, 0, 100);
      const left = clamp(cellLeft + offL, 0, 100);
      const size = 4 + Math.random() * 5;
      const opacity = 0.25 + Math.random() * 0.25;
      return { src, top, left, size, opacity };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no deps, never recompute until reload

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {layout.map((it, i) => (
        <img
          key={i}
          src={it.src}
          alt=""
          className="absolute select-none pointer-events-none"
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            width: `${it.size}rem`,
            height: `${it.size}rem`,
            opacity: it.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------- Cards with expand/collapse ---------- */

function QuestionOption({
  text,
  isCorrect,
}: {
  text: string;
  isCorrect: boolean;
}) {
  return (
    <div
      className={`p-2 rounded border ${
        isCorrect
          ? 'bg-green-50 border-green-300 font-medium'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm">{text}</span>
        {isCorrect && <span className="text-xs text-green-600">✓</span>}
      </div>
    </div>
  );
}

function QuestionCard({ q }: { q: QuestionItem }) {
  const [expanded, setExpanded] = useState(false);
  const [imageModal, setImageModal] = useState<null | {
    src: string;
    title: string;
  }>(null);
  const modalBackdropRef = useRef<HTMLDivElement | null>(null);

  const diffColor =
    q.difficultyValue < 35
      ? 'text-red-600'
      : q.difficultyValue < 60
      ? 'text-orange-600'
      : 'text-green-600';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 h-6 text-xs font-medium rounded border bg-blue-50 text-blue-700 border-blue-200">
              {q.type}
            </span>

            <span className="inline-flex items-center text-sm text-gray-500 h-6">
              {q.qref}
            </span>

            <span className="inline-flex items-center text-gray-400 h-6">
              •
            </span>

            <span className="inline-flex items-center px-2 h-6 text-xs font-medium rounded border bg-gray-100 text-gray-700 border-gray-300">
              {q.year}
            </span>

            <span className="inline-flex items-center px-2 h-6 text-xs font-medium rounded border bg-amber-50 text-amber-700 border-amber-200">
              {q.provider}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {q.topic}
          </h3>
          <div className="flex flex-wrap gap-1">
            {q.areaOfStudy && <Tag>{q.areaOfStudy}</Tag>}
            {q.extraTags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="text-xs text-gray-500 mb-1">Difficulty</div>
          <div className={`text-lg font-bold ${diffColor}`}>
            {q.difficultyLabel}
          </div>
        </div>
      </div>

      <button
        className="w-full text-left p-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors flex items-center justify-between"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-sm font-medium">
          {expanded ? 'Hide details' : 'View details'}
        </span>
        <span
          className={`transform transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Question</h4>
            <p className="text-gray-900">{q.question}</p>
            {q.type === 'MCQ' && q.options && (
              <ul className="mt-3 space-y-2">
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const correct = q.correctOption === letter;
                  return (
                    <QuestionOption key={i} text={opt} isCorrect={correct} />
                  );
                })}
              </ul>
            )}
          </div>

          <div className="bg-green-50 rounded p-4 border-l-4 border-green-400 mb-6">
            <h4 className="text-sm font-medium text-green-800 mb-2">Answer</h4>
            <p className="text-green-900 text-sm leading-relaxed">{q.answer}</p>
            {q.ai?.steps && q.ai.steps.length > 0 && (
              <>
                <h5 className="mt-3 text-sm font-medium text-green-800">
                  Steps
                </h5>
                <ol className="list-decimal list-inside text-green-900 text-sm">
                  {q.ai.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </>
            )}
          </div>

          {/* Inline, toolbar-free PDF renders with working pdf.js canvas */}
          <div className="grid md:grid-cols-2 gap-4">
            <PdfPageCanvas
              key={`${q.examPdf.src}#${q.examPdf.page}`}
              title={`${q.year} Exam`}
              src={q.examPdf.src}
              page={q.examPdf.page}
              scale={1.6}
              onClickImage={(dataUrl) =>
                setImageModal({
                  src: dataUrl,
                  title: `${q.year} Exam - ${q.qref}`,
                })
              }
            />
            <PdfPageCanvas
              key={`${q.reportPdf.src}#${q.reportPdf.page}`}
              title={`${q.year} Report`}
              src={q.reportPdf.src}
              page={q.reportPdf.page}
              scale={1.6}
              onClickImage={(dataUrl) =>
                setImageModal({
                  src: dataUrl,
                  title: `${q.year} Report - ${q.qref}`,
                })
              }
            />
          </div>

          {/* Per-card image modal */}
          {imageModal && (
            <div
              ref={modalBackdropRef}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === modalBackdropRef.current) setImageModal(null);
              }}
            >
              <div className="relative inline-block max-w-[95vw] max-h-[85vh]">
                <button
                  onClick={() => setImageModal(null)}
                  className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 shadow flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>

                <img
                  src={imageModal.src}
                  alt={imageModal.title}
                  className="block max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */

export default function App() {
  const [showMCQ, setShowMCQ] = useState(true);
  const [showSAQ, setShowSAQ] = useState(true);
  const [selectedYears, setSelectedYears] = useState<number[]>([
    2022, 2023, 2024,
  ]);
  const [query, setQuery] = useState('');

  const filtered: QuestionItem[] = useMemo(() => {
    const base = QUESTIONS.filter(
      (q) =>
        (showMCQ || q.type !== 'MCQ') &&
        (showSAQ || q.type !== 'SAQ') &&
        selectedYears.includes(q.year)
    );
    return query.trim() ? searchQuestions(base, query) : base;
  }, [showMCQ, showSAQ, selectedYears, query]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <EmojiBackgroundEven count={24} jitter={7} />
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <ErrorBoundary>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              VCE Biology Questions
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hardest past exam questions with answers. Use filters and search
              below. Click a card to expand.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <SegmentedType
                showMCQ={showMCQ}
                showSAQ={showSAQ}
                onToggle={(k) =>
                  k === 'MCQ' ? setShowMCQ((v) => !v) : setShowSAQ((v) => !v)
                }
              />
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Exam Year
                </h3>
                <div className="flex gap-2">
                  {[2022, 2023, 2024].map((y) => (
                    <YearButton
                      key={y}
                      year={y}
                      selectedYears={selectedYears}
                      onToggle={(yy) =>
                        setSelectedYears((prev) =>
                          prev.includes(yy)
                            ? prev.filter((v) => v !== yy)
                            : [...prev, yy]
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Use quotes for phrases, for example "electron transport"'
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Multiple words narrow results
                </div>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                No questions found
              </h2>
              <p className="text-gray-500 text-sm">
                Adjust filters or search terms
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {filtered.length} question{filtered.length !== 1 ? 's' : ''}
                  {query.trim() && ` for "${query}"`}
                </h2>
                <div className="text-xs text-gray-500">
                  Hardest questions first
                </div>
              </div>

              <div className="space-y-4">
                {filtered
                  .sort((a, b) =>
                    a.difficultyValue !== b.difficultyValue
                      ? a.difficultyValue - b.difficultyValue
                      : a.topic.localeCompare(b.topic)
                  )
                  .map((q) => (
                    <QuestionCard key={q.id} q={q} />
                  ))}
              </div>
            </>
          )}

          <div className="mt-12 pt-6 border-t text-center">
            <p className="text-gray-500 text-xs">
              VCE Biology past exam questions 2022 to 2024, data sourced from
              VCAA
            </p>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
