// import { QuestionItem } from '../types';

// const SYNONYMS: Record<string, string[]> = {
//   respiration: ['cellular respiration', 'etc', 'electron transport', 'aerobic'],
//   photosynthesis: ['calvin cycle', 'light dependent', 'light independent'],
//   selection: ['natural selection', 'fitness', 'adaptation'],
//   drift: ['genetic drift', 'sampling error', 'bottleneck', 'founder'],
//   antigen: ['mhc', 'hka', 'hla', 't cell', 'apc', 'presentation'],
//   quarantine: ['isolation', 'incubation', 'infectious'],
// };

// function norm(s: string) {
//   return s
//     .toLowerCase()
//     .normalize('NFKD')
//     .replace(/[^a-z0-9\s"]/g, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// // very small stemmer for common endings
// function stem(w: string) {
//   return w
//     .replace(/(ing|ed|ly|ious|ies|ive|es|s)$/i, '')
//     .replace(/(tion|sion)$/i, 't');
// }

// function tokenize(query: string): string[][] {
//   const q = norm(query);
//   const phrases: string[] = [];
//   const phraseRegex = /"([^"]+)"/g;
//   let m: RegExpExecArray | null;
//   let rest = q;
//   while ((m = phraseRegex.exec(q))) {
//     phrases.push(m[1]);
//     rest = rest.replace(m[0], ' ');
//   }

//   const words = rest.split(' ').filter(Boolean);

//   const buckets: string[][] = [];
//   for (const ph of phrases) {
//     const base = stem(ph);
//     buckets.push([ph, base, ...(SYNONYMS[base] || [])]);
//   }
//   for (const w of words) {
//     const base = stem(w);
//     const syns = SYNONYMS[base] || [];
//     buckets.push([w, base, ...syns]);
//   }
//   return buckets;
// }

// function buildSearchText(q: QuestionItem) {
//   return norm(
//     [
//       q.question,
//       q.answer,
//       q.topic,
//       q.qref,
//       q.areaOfStudy || '',
//       q.year,
//       q.provider,
//       (q.options || []).join(' '),
//       (q.extraTags || []).join(' '),
//       ...(q.ai?.relatedConcepts || []),
//       ...(q.ai?.learningObjectives || []),
//     ].join(' ')
//   );
// }

// export function searchQuestions(items: QuestionItem[], query: string) {
//   const buckets = tokenize(query);
//   if (buckets.length === 0) return items;

//   const cache = new Map<string, string>();
//   const textOf = (q: QuestionItem) => {
//     const c = cache.get(q.id);
//     if (c) return c;
//     const t = buildSearchText(q);
//     cache.set(q.id, t);
//     return t;
//   };

//   return items.filter((item) => {
//     const t = textOf(item);
//     // AND logic: every bucket must match at least one token
//     return buckets.every((alts) => alts.some((tok) => t.includes(norm(tok))));
//   });
// }
