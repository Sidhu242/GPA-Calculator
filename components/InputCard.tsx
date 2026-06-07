'use client';

import { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GPAScale } from '@/lib/gpa-converter';

interface InputCardProps {
  onCalculate: (
    inputType: 'sgpa' | 'percentage',
    values: number[],
    scale: GPAScale
  ) => void;
}

export default function InputCard({ onCalculate }: InputCardProps) {
  const [mode, setMode] = useState<'sgpa' | 'percentage'>('sgpa');
  const [scale, setScale] = useState<GPAScale>(10);
  const [semesterValues, setSemesterValues] = useState<string[]>(['']);
  const [percentageValue, setPercentageValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  function addSemester() {
    setSemesterValues((prev) => [...prev, '']);
  }

  function removeSemester(index: number) {
    setSemesterValues((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSemester(index: number, value: string) {
    setSemesterValues((prev) =>
      prev.map((v, i) => (i === index ? value : v))
    );
  }

  function validate(): { valid: boolean; values: number[] } {
    setErrors([]);
    if (mode === 'sgpa') {
      const parsed = semesterValues.map((v) => parseFloat(v.trim()));
      const newErrors: string[] = [];
      parsed.forEach((v, i) => {
        if (isNaN(v)) newErrors.push(`Semester ${i + 1}: Please enter a valid number`);
        else if (v < 0 || v > 10) newErrors.push(`Semester ${i + 1}: SGPA must be between 0 and 10`);
      });
      if (newErrors.length > 0) {
        setErrors(newErrors);
        return { valid: false, values: [] };
      }
      return { valid: true, values: parsed };
    } else {
      const val = parseFloat(percentageValue.trim());
      if (isNaN(val)) {
        setErrors(['Please enter a valid percentage']);
        return { valid: false, values: [] };
      }
      if (val < 0 || val > 100) {
        setErrors(['Percentage must be between 0 and 100']);
        return { valid: false, values: [] };
      }
      return { valid: true, values: [val] };
    }
  }

  function handleCalculate() {
    const { valid, values } = validate();
    if (valid) {
      onCalculate(mode, values, scale);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setMode('sgpa')}
          className={cn(
            'flex-1 py-3.5 text-sm font-medium transition-colors',
            mode === 'sgpa'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          )}
        >
          SGPA / Semester
        </button>
        <button
          onClick={() => setMode('percentage')}
          className={cn(
            'flex-1 py-3.5 text-sm font-medium transition-colors',
            mode === 'percentage'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          )}
        >
          Percentage
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* GPA Scale selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target GPA Scale
          </label>
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

        {/* SGPA inputs */}
        {mode === 'sgpa' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Semester SGPA Values
            </label>
            <div className="space-y-2">
              {semesterValues.map((val, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 shrink-0">
                    S{index + 1}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="e.g. 8.5"
                    value={val}
                    onChange={(e) => updateSemester(index, e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {semesterValues.length > 1 && (
                    <button
                      onClick={() => removeSemester(index)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addSemester}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add semester
            </button>
          </div>
        )}

        {/* Percentage input */}
        {mode === 'percentage' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Overall Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 75.5"
                value={percentageValue}
                onChange={(e) => setPercentageValue(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-4 pr-12 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                %
              </span>
            </div>
          </div>
        )}

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-red-600">
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <Calculator className="h-4 w-4" />
          Calculate GPA
        </button>
      </div>
    </div>
  );
}
