'use client';

import { useState } from 'react';
import { Copy, Check, RotateCcw, TrendingUp } from 'lucide-react';
import type { ConversionResult } from '@/lib/gpa-converter';

interface ResultsCardProps {
  result: ConversionResult;
  onReset: () => void;
}

export default function ResultsCard({ result, onReset }: ResultsCardProps) {
  const [copied, setCopied] = useState(false);

  const percentage = (result.finalGPA / result.scale) * 100;

  function getGPAColor(gpa: number, scale: number): string {
    const ratio = gpa / scale;
    if (ratio >= 0.85) return 'text-emerald-600';
    if (ratio >= 0.70) return 'text-blue-600';
    if (ratio >= 0.55) return 'text-amber-600';
    return 'text-red-500';
  }

  function getRingColor(ratio: number): string {
    if (ratio >= 0.85) return '#10b981';
    if (ratio >= 0.70) return '#2563eb';
    if (ratio >= 0.55) return '#d97706';
    return '#ef4444';
  }

  function copyResult() {
    const inputSummary =
      result.inputType === 'sgpa'
        ? `Semester SGPA values: ${result.inputValues.join(', ')}\nAverage SGPA: ${result.cumulativeInput}`
        : `Percentage: ${result.cumulativeInput}%`;

    const text = `GPA Calculation Result
----------------------
${inputSummary}
Final GPA: ${result.finalGPA} / ${result.scale}
Grade: ${result.gradeLabel}
Method: ${result.conversionMethod}
Calculated via GPACalc`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const ratio = result.finalGPA / result.scale;
  const circleCircumference = 2 * Math.PI * 54;
  const strokeDashoffset = circleCircumference * (1 - ratio);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-slate-900">Your Result</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* GPA ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={getRingColor(ratio)}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getGPAColor(result.finalGPA, result.scale)}`}>
                {result.finalGPA}
              </span>
              <span className="text-xs text-slate-400 font-medium">out of {result.scale}</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              {result.gradeLabel}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
            <span className="text-sm text-slate-500">Input Type</span>
            <span className="text-sm font-medium text-slate-800 capitalize">
              {result.inputType === 'sgpa' ? 'SGPA (Semesters)' : 'Percentage'}
            </span>
          </div>

          {result.inputType === 'sgpa' && result.inputValues.length > 0 && (
            <div className="flex justify-between items-start py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500">Semester Values</span>
              <span className="text-sm font-medium text-slate-800 text-right max-w-[55%]">
                {result.inputValues.join(', ')}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              {result.inputType === 'sgpa' ? 'Average SGPA' : 'Percentage'}
            </span>
            <span className="text-sm font-medium text-slate-800">
              {result.cumulativeInput}{result.inputType === 'percentage' ? '%' : ''}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
            <span className="text-sm text-slate-500">Final GPA</span>
            <span className={`text-sm font-bold ${getGPAColor(result.finalGPA, result.scale)}`}>
              {result.finalGPA} / {result.scale}
            </span>
          </div>

          <div className="py-2.5">
            <p className="text-sm text-slate-500 mb-1">Conversion Method</p>
            <p className="text-sm font-medium text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              {result.conversionMethod}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={copyResult}
            className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Result
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
