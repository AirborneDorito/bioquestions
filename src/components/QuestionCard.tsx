// import React from 'react';
// import { Link } from 'react-router-dom';
// import { QuestionItem } from '../types';
// import { Tag } from './Tag';

// export default function QuestionCard({ q }: { q: QuestionItem }) {
//   const diffColor =
//     q.difficultyValue < 35
//       ? 'text-red-600'
//       : q.difficultyValue < 60
//       ? 'text-orange-600'
//       : 'text-green-600';

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-2">
//             {/* type with distinct visual */}
//             <Tag variant={q.type === 'MCQ' ? 'type-mcq' : 'type-saq'}>
//               {q.type}
//             </Tag>
//             <span className="text-sm text-gray-500">{q.qref}</span>
//             <span className="text-sm text-gray-400">•</span>
//             <Tag variant="year">{q.year}</Tag>
//             <Tag variant="provider">{q.provider}</Tag>
//           </div>

//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             {q.topic}
//           </h3>

//           <div className="flex flex-wrap gap-1">
//             {q.areaOfStudy && <Tag>{q.areaOfStudy}</Tag>}
//             {q.extraTags?.map((t) => (
//               <Tag key={t}>{t}</Tag>
//             ))}
//           </div>
//         </div>

//         <div className="text-right ml-4">
//           <div className="text-xs text-gray-500 mb-1">Difficulty</div>
//           <div className={`text-lg font-bold ${diffColor}`}>
//             {q.difficultyLabel}
//           </div>
//         </div>
//       </div>

//       <p className="text-gray-800 text-sm line-clamp-3">{q.question}</p>

//       <div className="mt-4">
//         <Link
//           to={`/q/${q.id}`}
//           className="inline-flex items-center gap-2 px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//         >
//           View details
//           <span>↗</span>
//         </Link>
//       </div>
//     </div>
//   );
// }
