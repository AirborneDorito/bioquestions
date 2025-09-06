// import React from 'react';

// type State =
//   | { hasError: true; message: string; stack?: string }
//   | { hasError: false };

// export default class ErrorBoundary extends React.Component<
//   React.PropsWithChildren<{}>,
//   State
// > {
//   constructor(props: any) {
//     super(props);
//     this.state = { hasError: false };
//   }
//   static getDerivedStateFromError(err: any): State {
//     return {
//       hasError: true,
//       message: String(err?.message || err),
//       stack: err?.stack,
//     };
//   }
//   componentDidCatch(err: any, info: any) {
//     // keep console noise on for dev
//     console.error('ErrorBoundary caught:', err, info);
//   }
//   render() {
//     if (!('hasError' in this.state) || !this.state.hasError)
//       return this.props.children;
//     return (
//       <div className="p-4 max-w-3xl mx-auto">
//         <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4">
//           <h2 className="font-semibold mb-2">App error</h2>
//           <pre className="whitespace-pre-wrap text-sm mb-2">
//             {this.state.message}
//           </pre>
//           {this.state.stack && (
//             <details className="text-xs opacity-80">
//               <summary>stack</summary>
//               <pre className="whitespace-pre-wrap">{this.state.stack}</pre>
//             </details>
//           )}
//         </div>
//       </div>
//     );
//   }
// }
