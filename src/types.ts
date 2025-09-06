export type Provider = 'VCAA' | 'Other';

export type PdfRef = { src: string; page: number };

export type AIFields = {
  rationale?: string; // model-friendly explanation
  steps?: string[]; // solution steps
  distractorReasons?: Record<string, string>; // A/B/C/D reasons
  learningObjectives?: string[]; // tags for mastery
  relatedConcepts?: string[]; // synonyms/topics to aid search
};

export type QuestionItem = {
  id: string;
  year: number;
  provider: Provider; // NEW: exam provider
  type: 'MCQ' | 'SAQ';
  qref: string;
  topic: string;
  areaOfStudy?: string;
  difficultyValue: number;
  difficultyLabel: string;
  question: string;
  options?: string[]; // MCQ
  correctOption?: string; // 'A' | 'B' | 'C' | 'D'
  answer: string;
  examPdf: PdfRef;
  reportPdf: PdfRef;
  extraTags?: string[];

  ai?: AIFields; // NEW: AI-friendly fields
};
