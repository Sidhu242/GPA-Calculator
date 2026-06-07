'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, Image, AlertCircle, Pencil, Calculator, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtractedData } from '@/lib/document-extractor';
import type { GPAScale } from '@/lib/gpa-converter';

interface UploadCardProps {
  onCalculate: (
    inputType: 'sgpa' | 'percentage',
    values: number[],
    scale: GPAScale,
    extracted: ExtractedData
  ) => void;
}

type UploadStatus = 'idle' | 'processing' | 'extracted' | 'error';

export default function UploadCard({ onCalculate }: UploadCardProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [scale, setScale] = useState<GPAScale>(10);
  const [editMode, setEditMode] = useState<'sgpa' | 'percentage'>('sgpa');
  const [editedSGPA, setEditedSGPA] = useState<string[]>([]);
  const [editedPercent, setEditedPercent] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  async function processFile(file: File) {
    if (!file) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Please upload a PDF, JPG, PNG, or WebP file.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setExtracted(null);
    setErrorMsg('');

    try {
      const { processUploadedFile } = await import('@/lib/document-extractor');
      const result = await processUploadedFile(file, (p) => setProgress(p));
      setExtracted(result);
      setStatus('extracted');

      // Pre-fill edit fields
      if (result.sgpaValues.length > 0) {
        setEditedSGPA(result.sgpaValues.map(String));
        setEditMode('sgpa');
      } else if (result.cgpa !== null) {
        setEditedSGPA([String(result.cgpa)]);
        setEditMode('sgpa');
      } else if (result.percentage !== null) {
        setEditedPercent(String(result.percentage));
        setEditMode('percentage');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process file.');
      setStatus('error');
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  function handleCalculate() {
    if (!extracted) return;
    if (editMode === 'sgpa') {
      const vals = editedSGPA.map((v) => parseFloat(v)).filter((v) => !isNaN(v));
      if (vals.length === 0) return;
      onCalculate('sgpa', vals, scale, extracted);
    } else {
      const val = parseFloat(editedPercent);
      if (isNaN(val)) return;
      onCalculate('percentage', [val], scale, extracted);
    }
  }

  function reset() {
    setStatus('idle');
    setProgress(0);
    setExtracted(null);
    setErrorMsg('');
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="font-semibold text-slate-900">Upload Marksheet</h3>
        <p className="text-sm text-slate-500 mt-0.5">PDF, JPG, or PNG — processed in your browser</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Drop zone */}
        {(status === 'idle' || status === 'error') && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 px-6 text-center transition-all cursor-pointer',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
            )}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex gap-3 mb-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <Image className="h-6 w-6 text-blue-400" />
            </div>
            <p className="font-medium text-slate-700 mb-1">Drop your marksheet here</p>
            <p className="text-sm text-slate-400">or click to browse — PDF, JPG, PNG</p>
          </div>
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Extracting text...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Processing failed</p>
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Extracted results */}
        {status === 'extracted' && extracted && (
          <div className="space-y-5">
            {/* Detection summary */}
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Detected Values</p>
              <div className="space-y-1 text-sm text-green-700">
                {extracted.sgpaValues.length > 0 && (
                  <p>SGPA Values: {extracted.sgpaValues.join(', ')}</p>
                )}
                {extracted.cgpa !== null && (
                  <p>CGPA: {extracted.cgpa}</p>
                )}
                {extracted.percentage !== null && (
                  <p>Percentage: {extracted.percentage}%</p>
                )}
                {extracted.detectedType === 'unknown' && (
                  <p className="text-amber-700">Could not auto-detect values. Please enter manually below.</p>
                )}
              </div>
            </div>

            {/* GPA Scale */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target GPA Scale</label>
              <div className="flex gap-3">
                {([10, 4] as GPAScale[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                      scale === s
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    GPA / {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit mode tabs */}
            <div>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-3">
                <button
                  onClick={() => setEditMode('sgpa')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium transition-colors',
                    editMode === 'sgpa' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  Use SGPA
                </button>
                <button
                  onClick={() => setEditMode('percentage')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium transition-colors',
                    editMode === 'percentage' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  Use Percentage
                </button>
              </div>

              {editMode === 'sgpa' && (
                <div className="space-y-2">
                  {editedSGPA.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-6">S{i + 1}</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={val}
                        onChange={(e) =>
                          setEditedSGPA((prev) =>
                            prev.map((v, idx) => (idx === i ? e.target.value : v))
                          )
                        }
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setEditedSGPA((prev) => [...prev, ''])}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add semester
                  </button>
                </div>
              )}

              {editMode === 'percentage' && (
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={editedPercent}
                  onChange={(e) => setEditedPercent(e.target.value)}
                  placeholder="Enter percentage"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleCalculate}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Calculate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
