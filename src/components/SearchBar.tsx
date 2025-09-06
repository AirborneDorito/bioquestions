// import React, { useEffect, useState } from 'react';

// export default function SearchBar({
//   value,
//   onChange,
//   placeholder = 'Search by concept, skill, or phrase',
//   delay = 180,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   delay?: number;
// }) {
//   const [local, setLocal] = useState(value);

//   useEffect(() => {
//     const t = setTimeout(() => onChange(local), delay);
//     return () => clearTimeout(t);
//   }, [local, delay, onChange]);

//   useEffect(() => setLocal(value), [value]);

//   return (
//     <input
//       type="text"
//       value={local}
//       onChange={(e) => setLocal(e.target.value)}
//       placeholder={placeholder}
//       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//     />
//   );
// }
