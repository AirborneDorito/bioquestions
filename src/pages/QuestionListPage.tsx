// import React, { useMemo, useState } from 'react';
// import QUESTIONS from '../data/questions';
// import { QuestionItem } from '../types';
// import QuestionCard from '../components/QuestionCard';
// import SearchBar from '../components/SearchBar';
// import { searchQuestions } from '../lib/search';

// function SegmentedType({
//   showMCQ, showSAQ, onToggle,
// }: {
//   showMCQ: boolean; showSAQ: boolean; onToggle: (key: 'MCQ' | 'SAQ') => void;
// }) {
//   return (
//     <div className="w-full">
//       <div className="text-sm font-medium text-gray-700 mb-3">Question type</div>
//       <div className="relative w-full max-w-xs select-none">
//         <div className="relative grid grid-cols-2 rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
//           {/* MCQ highlight */}
//           <span
//             className={`absolute inset-y-1 left-1 w-[calc(50%-0.5rem)] rounded-full bg-blue-100 shadow transition-all duration-200 ${
//               showMCQ ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
//             }`}
//             style={{ zIndex: 0 }}
//             aria-hidden
//           />
//           {/* SAQ highlight */}
//           <span
//             className={`absolute inset-y-1 right-1 w-[calc(50%-0.5rem)] rounded-full bg-purple-100 shadow transition-all duration-200 ${
//               showSAQ ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
//             }`}
//             style={{ zIndex: 0 }}
//             aria-hidden
//           />

//           <button
//             type="button"
//             onClick={() => onToggle('MCQ')}
//             className="relative z-10 px-4 py-2 text-sm font-medium"
//           >
//             MCQ
//           </button>
//           <button
//             type="button"
//             onClick={() => onToggle('SAQ')}
//             className="relative z-10 px-4 py-2 text-sm font-medium"
//           >
//             SAQ
//           </button>
//         </div>
//         <div className="mt-1 text-xs text-gray-500">Toggle either or both</div>
//       </div>
//     </div>
//   );
// }

// function YearButton({
//   year,
//   selectedYears,
//   onToggle,
// }: {
//   year: number;
//   selectedYears: number[];
//   onToggle: (y: number) => void;
// }) {
//   const isSelected = selectedYears.includes(year);
//   return (
//     <button
//       onClick={() => onToggle(year)}
//       className={`px-3 py-1 text-sm border rounded transition-colors ${
//         isSelected
//           ? 'bg-green-600 text-white border-green-600'
//           : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
//       }`}
//     >
//       {year}
//     </button>
//   );
// }

// export default function QuestionListPage() {
//   const [showMCQ, setShowMCQ] = useState(true);
//   const [showSAQ, setShowSAQ] = useState(true);
//   const [selectedYears, setSelectedYears] = useState<number[]>([
//     2022, 2023, 2024,
//   ]);
//   const [query, setQuery] = useState('');

//   const filtered: QuestionItem[] = useMemo(() => {
//     const base = QUESTIONS.filter(
//       (q) =>
//         (showMCQ || q.type !== 'MCQ') &&
//         (showSAQ || q.type !== 'SAQ') &&
//         selectedYears.includes(q.year)
//     );
//     return query.trim() ? searchQuestions(base, query) : base;
//   }, [showMCQ, showSAQ, selectedYears, query]);

//   return (
//     <div>
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           VCE Biology Questions
//         </h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Hardest past exam questions with answers. Use filters and search
//           below. Click any card to view details.
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg border p-4 mb-6">
//         <div className="grid md:grid-cols-3 gap-6 items-start">
//           <SegmentedType
//             showMCQ={showMCQ}
//             showSAQ={showSAQ}
//             onToggle={(k) =>
//               k === 'MCQ' ? setShowMCQ((v) => !v) : setShowSAQ((v) => !v)
//             }
//           />
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-3">
//               Exam Year
//             </h3>
//             <div className="flex gap-2">
//               {[2022, 2023, 2024].map((y) => (
//                 <YearButton
//                   key={y}
//                   year={y}
//                   selectedYears={selectedYears}
//                   onToggle={(yy) =>
//                     setSelectedYears((prev) =>
//                       prev.includes(yy)
//                         ? prev.filter((v) => v !== yy)
//                         : [...prev, yy]
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Search
//             </label>
//             <SearchBar value={query} onChange={setQuery} />
//             <div className="mt-1 text-xs text-gray-500">
//               Tips: use quotes for phrases, for example “electron transport”,
//               and multiple words will narrow results.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Results */}
//       {filtered.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="text-4xl mb-3">🔍</div>
//           <h2 className="text-lg font-medium text-gray-700 mb-2">
//             No questions found
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Adjust filters or search terms
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium text-gray-800">
//               {filtered.length} question{filtered.length !== 1 ? 's' : ''}
//               {query.trim() && ` for "${query}"`}
//             </h2>
//             <div className="text-xs text-gray-500">Hardest questions first</div>
//           </div>

//           <div className="space-y-4">
//             {filtered
//               .sort((a, b) =>
//                 a.difficultyValue !== b.difficultyValue
//                   ? a.difficultyValue - b.difficultyValue
//                   : a.topic.localeCompare(b.topic)
//               )
//               .map((q) => (
//                 <QuestionCard key={q.id} q={q} />
//               ))}
//           </div>
//         </>
//       )}

//       {/* Footer */}
//       <div className="mt-12 pt-6 border-t text-center">
//         <p className="text-gray-500 text-xs">
//           VCE Biology past exam questions 2022 to 2024, data sourced from VCAA
//         </p>
//       </div>
//     </div>
//   );
// }
