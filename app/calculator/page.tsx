'use client';

import { useState } from 'react';
import InputCard from '@/components/InputCard';
import UploadCard from '@/components/UploadCard';
import ResultsCard from '@/components/ResultsCard';
import { computeResult } from '@/lib/gpa-converter';
import type { ConversionResult, GPAScale } from '@/lib/gpa-converter';
import type { ExtractedData } from '@/lib/document-extractor';
import { FileUp, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'manual' | 'upload';

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>('manual');
  const [result, setResult] = useState<ConversionResult | null>(null);

  function handleManualCalculate(
    inputType: 'sgpa' | 'percentage',
    values: number[],
    scale: GPAScale
  ) {
    const res = computeResult(inputType, values, scale);
    setResult(res);
    setTimeout(() => {
      document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function handleUploadCalculate(
    inputType: 'sgpa' | 'percentage',
    values: number[],
    scale: GPAScale,
    _extracted: ExtractedData
  ) {
    const res = computeResult(inputType, values, scale);
    setResult(res);
    setTimeout(() => {
      document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function handleReset() {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            GPA Calculator
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Convert your SGPA or percentage to GPA on a 10 or 4-point scale. All processing happens instantly in your browser.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
            <button
              onClick={() => setTab('manual')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === 'manual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Keyboard className="h-4 w-4" />
              Enter Manually
            </button>
            <button
              onClick={() => setTab('upload')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <FileUp className="h-4 w-4" />
              Upload Marksheet
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Input */}
          <div>
            {tab === 'manual' ? (
              <InputCard onCalculate={handleManualCalculate} />
            ) : (
              <UploadCard onCalculate={handleUploadCalculate} />
            )}
          </div>

          {/* Right: Result */}
          <div id="results-anchor">
            {result ? (
              <ResultsCard result={result} onReset={handleReset} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center py-20 px-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-slate-300">?</span>
                </div>
                <p className="font-medium text-slate-400">Your GPA result will appear here</p>
                <p className="text-sm text-slate-400 mt-1">Fill in the form and click Calculate</p>
              </div>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[
            {
              title: 'SGPA to GPA/10',
              formula: 'Average of all semester SGPAs',
              note: 'Direct scale — no conversion needed',
            },
            {
              title: 'SGPA to GPA/4',
              formula: '(SGPA ÷ 10) × 4',
              note: 'Standard US 4-point scale conversion',
            },
            {
              title: 'Percentage to GPA',
              formula: 'GPA/10 = % ÷ 10\nGPA/4 = (% ÷ 100) × 4',
              note: 'Widely accepted academic formula',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">{card.title}</p>
              <p className="font-mono text-blue-600 text-sm whitespace-pre-line">{card.formula}</p>
              <p className="text-xs text-slate-400 mt-1">{card.note}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
