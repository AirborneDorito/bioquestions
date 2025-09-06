// import React, { useMemo, useRef, useState } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import QUESTIONS from '../data/questions';
// import { QuestionItem } from '../types';
// import { Tag } from '../components/Tag';
// import PdfPageCanvas from '../PdfPageCanvas';

// export default function QuestionDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const nav = useNavigate();
//   const q: QuestionItem | undefined = useMemo(
//     () => QUESTIONS.find((x) => x.id === id),
//     [id]
//   );

//   const [imageModal, setImageModal] = useState<null | {
//     src: string;
//     title: string;
//   }>(null);
//   const backdropRef = useRef<HTMLDivElement | null>(null);

//   if (!q) {
//     return (
//       <div>
//         <p className="mb-4">Question not found.</p>
//         <button
//           onClick={() => nav(-1)}
//           className="px-3 py-2 rounded bg-gray-200"
//         >
//           Go back
//         </button>
//       </div>
//     );
//   }

//   const diffColor =
//     q.difficultyValue < 35
//       ? 'text-red-600'
//       : q.difficultyValue < 60
//       ? 'text-orange-600'
//       : 'text-green-600';

//   return (
//     <div>
//       <div className="mb-4">
//         <Link to="/" className="text-green-700 underline">
//           ← Back to list
//         </Link>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
//         <div className="flex justify-between items-start mb-3">
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-2">
//               <Tag variant={q.type === 'MCQ' ? 'type-mcq' : 'type-saq'}>
//                 {q.type}
//               </Tag>
//               <span className="text-sm text-gray-500">{q.qref}</span>
//               <span className="text-sm text-gray-400">•</span>
//               <Tag variant="year">{q.year}</Tag>
//               <Tag variant="provider">{q.provider}</Tag>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">{q.topic}</h1>
//             <div className="flex flex-wrap gap-1">
//               {q.areaOfStudy && <Tag>{q.areaOfStudy}</Tag>}
//               {q.extraTags?.map((t) => (
//                 <Tag key={t}>{t}</Tag>
//               ))}
//             </div>
//           </div>
//           <div className="text-right ml-4">
//             <div className="text-xs text-gray-500 mb-1">Difficulty</div>
//             <div className={`text-lg font-bold ${diffColor}`}>
//               {q.difficultyLabel}
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded p-4 mb-4">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">Question</h4>
//           <p className="text-gray-900">{q.question}</p>
//           {q.type === 'MCQ' && q.options && (
//             <ul className="mt-3 space-y-2">
//               {q.options.map((opt, i) => {
//                 const letter = String.fromCharCode(65 + i);
//                 const correct = q.correctOption === letter;
//                 return (
//                   <li
//                     key={i}
//                     className={`p-2 rounded border ${
//                       correct
//                         ? 'bg-green-50 border-green-300'
//                         : 'bg-white border-gray-200'
//                     }`}
//                   >
//                     {opt}{' '}
//                     {correct && <span className="ml-2 text-green-700">✓</span>}
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         <div className="bg-green-50 rounded p-4 border-l-4 border-green-400 mb-6">
//           <h4 className="text-sm font-medium text-green-800 mb-2">Answer</h4>
//           <p className="text-green-900 text-sm leading-relaxed">{q.answer}</p>
//           {q.ai?.steps && q.ai.steps.length > 0 && (
//             <>
//               <h5 className="mt-3 text-sm font-medium text-green-800">Steps</h5>
//               <ol className="list-decimal list-inside text-green-900 text-sm">
//                 {q.ai.steps.map((s, idx) => (
//                   <li key={idx}>{s}</li>
//                 ))}
//               </ol>
//             </>
//           )}
//         </div>

//         {/* PDFs with click-to-zoom image modal */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <PdfPageCanvas
//             key={`${q.examPdf.src}#${q.examPdf.page}`}
//             title={`${q.year} Exam`}
//             src={q.examPdf.src}
//             page={q.examPdf.page}
//             scale={1.6}
//             onClickImage={(dataUrl) =>
//               setImageModal({
//                 src: dataUrl,
//                 title: `${q.year} Exam - ${q.qref}`,
//               })
//             }
//           />
//           <PdfPageCanvas
//             key={`${q.reportPdf.src}#${q.reportPdf.page}`}
//             title={`${q.year} Report`}
//             src={q.reportPdf.src}
//             page={q.reportPdf.page}
//             scale={1.6}
//             onClickImage={(dataUrl) =>
//               setImageModal({
//                 src: dataUrl,
//                 title: `${q.year} Report - ${q.qref}`,
//               })
//             }
//           />
//         </div>
//       </div>

//       {/* Modal */}
//       {imageModal && (
//         <div
//           ref={backdropRef}
//           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//           onClick={(e) => {
//             if (e.target === backdropRef.current) setImageModal(null);
//           }}
//         >
//           <div className="relative max-w-5xl w-full">
//             <button
//               onClick={() => setImageModal(null)}
//               className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 shadow flex items-center justify-center text-gray-700"
//               aria-label="Close"
//             >
//               ✕
//             </button>
//             <div className="bg-white rounded shadow overflow-hidden">
//               <img
//                 src={imageModal.src}
//                 alt={imageModal.title}
//                 className="block w-full h-auto"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
