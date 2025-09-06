// import React, { useEffect, useRef, useState } from 'react';
// import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// import type {
//   PDFDocumentProxy,
//   PDFPageProxy,
// } from 'pdfjs-dist/types/src/display/api';

// GlobalWorkerOptions.workerSrc = workerSrc;

// export type CropRect = { x: number; y: number; width: number; height: number };

// type Props = {
//   src: string;
//   page?: number;
//   scale?: number;
//   crop?: CropRect;
//   title?: string;
//   className?: string;
//   onRenderedDataUrl?: (dataUrl: string) => void;
//   onClickImage?: (dataUrl: string) => void;
// };

// const PdfPageCanvas: React.FC<Props> = ({
//   src,
//   page = 1,
//   scale = 1.6,
//   crop,
//   title,
//   className,
//   onRenderedDataUrl,
//   onClickImage,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const latestDataUrlRef = useRef<string | null>(null);
//   const renderTaskRef = useRef<any>(null);
//   const seqRef = useRef(0);

//   useEffect(() => {
//     let cancelled = false;
//     let pdfDoc: PDFDocumentProxy | null = null;
//     const seq = ++seqRef.current;

//     async function render() {
//       try {
//         renderTaskRef.current?.cancel();
//       } catch {}
//       setLoading(true);
//       setError(null);

//       try {
//         pdfDoc = await getDocument(src).promise;
//         if (cancelled || seq !== seqRef.current) return;

//         const pg: PDFPageProxy = await pdfDoc.getPage(page);
//         if (cancelled || seq !== seqRef.current) return;

//         const vp = pg.getViewport({ scale });
//         const canvas = canvasRef.current!;
//         const ctx = canvas.getContext('2d')!;

//         if (!crop) {
//           canvas.width = Math.ceil(vp.width);
//           canvas.height = Math.ceil(vp.height);
//           renderTaskRef.current = pg.render({
//             canvasContext: ctx,
//             viewport: vp,
//           });
//           await renderTaskRef.current.promise;
//         } else {
//           // render full page offscreen, then copy a crop
//           const off = document.createElement('canvas');
//           off.width = Math.ceil(vp.width);
//           off.height = Math.ceil(vp.height);
//           const offCtx = off.getContext('2d')!;
//           renderTaskRef.current = pg.render({
//             canvasContext: offCtx,
//             viewport: vp,
//           });
//           await renderTaskRef.current.promise;

//           const sx = Math.max(0, Math.floor(crop.x));
//           const sy = Math.max(0, Math.floor(crop.y));
//           const w = Math.min(off.width - sx, Math.floor(crop.width));
//           const h = Math.min(off.height - sy, Math.floor(crop.height));

//           canvas.width = w;
//           canvas.height = h;

//           const imgData = offCtx.getImageData(sx, sy, w, h);
//           ctx.putImageData(imgData, 0, 0);
//         }

//         if (cancelled || seq !== seqRef.current) return;
//         const dataUrl = canvas.toDataURL('image/png');
//         latestDataUrlRef.current = dataUrl;
//         onRenderedDataUrl?.(dataUrl);
//       } catch (err: any) {
//         if (!cancelled && seq === seqRef.current) {
//           setError(err?.message || 'Failed to render PDF');
//         }
//       } finally {
//         if (!cancelled && seq === seqRef.current) setLoading(false);
//         try {
//           await pdfDoc?.destroy();
//         } catch {}
//         renderTaskRef.current = null;
//       }
//     }

//     render();
//     return () => {
//       cancelled = true;
//       try {
//         renderTaskRef.current?.cancel();
//       } catch {}
//     };
//   }, [src, page, scale, crop, onRenderedDataUrl]);

//   function handleClick() {
//     const dataUrl =
//       latestDataUrlRef.current ||
//       canvasRef.current?.toDataURL('image/png') ||
//       '';
//     if (dataUrl && onClickImage) onClickImage(dataUrl);
//   }

//   return (
//     <div className={className}>
//       {title && <div className="text-sm text-gray-600 mb-2">{title}</div>}
//       <div
//         className="relative border border-gray-200 rounded overflow-hidden bg-white"
//         onClick={handleClick}
//       >
//         {loading && (
//           <div className="p-3 text-sm text-gray-600">
//             Loading page {page}...
//           </div>
//         )}
//         {error && (
//           <div className="p-3 text-sm text-red-600">PDF error: {error}</div>
//         )}
//         <canvas ref={canvasRef} className="block w-full" />
//       </div>
//     </div>
//   );
// };

// export default PdfPageCanvas;

import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export type CropRect = { x: number; y: number; width: number; height: number };

type Props = {
  src: string;
  page?: number;
  scale?: number;
  crop?: CropRect;
  title?: string;
  className?: string;
  onRenderedDataUrl?: (dataUrl: string) => void;
  onClickImage?: (dataUrl: string) => void;
};

const PdfPageCanvas: React.FC<Props> = ({
  src,
  page = 1,
  scale = 1.4,
  crop,
  title,
  className,
  onRenderedDataUrl,
  onClickImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestDataUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let pdfDoc: PDFDocumentProxy | null = null;

    async function render() {
      setLoading(true);
      setError(null);
      try {
        pdfDoc = await getDocument(src).promise;
        if (!mounted) return;
        const pg: PDFPageProxy = await pdfDoc.getPage(page);

        const vp = pg.getViewport({ scale });
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        if (!crop) {
          canvas.width = Math.ceil(vp.width);
          canvas.height = Math.ceil(vp.height);
          await pg.render({ canvasContext: ctx, viewport: vp }).promise;
        } else {
          const off = document.createElement('canvas');
          off.width = Math.ceil(vp.width);
          off.height = Math.ceil(vp.height);
          const offCtx = off.getContext('2d')!;
          await pg.render({ canvasContext: offCtx, viewport: vp }).promise;

          const [a, b, c, d, e, f] = vp.transform;
          const toPx = (x: number, y: number) => {
            const px = a * x + c * y + e;
            const py = b * x + d * y + f;
            return { px, py };
          };
          const tl = toPx(crop.x, crop.y + crop.height);
          const br = toPx(crop.x + crop.width, crop.y);

          const w = Math.round(Math.abs(br.px - tl.px));
          const h = Math.round(Math.abs(br.py - tl.py));
          const sx = Math.round(Math.min(tl.px, br.px));
          const sy = Math.round(Math.min(tl.py, br.py));

          canvas.width = w;
          canvas.height = h;

          const imgData = offCtx.getImageData(sx, sy, w, h);
          ctx.putImageData(imgData, 0, 0);
        }

        const dataUrl = canvas.toDataURL('image/png');
        latestDataUrlRef.current = dataUrl;
        onRenderedDataUrl?.(dataUrl);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to render PDF');
      } finally {
        setLoading(false);
        await pdfDoc?.destroy();
      }
    }

    render();
  }, [src, page, scale, JSON.stringify(crop)]);

  function handleClick() {
    const dataUrl = latestDataUrlRef.current;
    if (dataUrl && onClickImage) onClickImage(dataUrl);
  }

  return (
    <div className={className}>
      {title && (
        <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
      )}
      <div
        className="border rounded bg-white overflow-auto cursor-zoom-in"
        onClick={handleClick}
      >
        {loading && (
          <div className="p-3 text-sm text-gray-600">Loading page {page}…</div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-600">PDF error: {error}</div>
        )}
        <canvas ref={canvasRef} className="block w-full" />
      </div>
    </div>
  );
};

export default PdfPageCanvas;
