import Link from 'next/link';
import { BookOpen, ArrowRight, Info, CheckCircle } from 'lucide-react';

const conversionTable10 = [
  { percentage: '90 – 100', gpa10: '9.0 – 10.0', grade: 'O (Outstanding)' },
  { percentage: '80 – 89', gpa10: '8.0 – 8.9', grade: 'A+ (Excellent)' },
  { percentage: '70 – 79', gpa10: '7.0 – 7.9', grade: 'A (Very Good)' },
  { percentage: '60 – 69', gpa10: '6.0 – 6.9', grade: 'B+ (Good)' },
  { percentage: '50 – 59', gpa10: '5.0 – 5.9', grade: 'B (Above Average)' },
  { percentage: '40 – 49', gpa10: '4.0 – 4.9', grade: 'C (Average)' },
  { percentage: 'Below 40', gpa10: 'Below 4.0', grade: 'F (Fail)' },
];

const conversionTable4 = [
  { gpa4: '4.0', letter: 'A+', percentage: '97 – 100' },
  { gpa4: '4.0', letter: 'A', percentage: '93 – 96' },
  { gpa4: '3.7', letter: 'A-', percentage: '90 – 92' },
  { gpa4: '3.3', letter: 'B+', percentage: '87 – 89' },
  { gpa4: '3.0', letter: 'B', percentage: '83 – 86' },
  { gpa4: '2.7', letter: 'B-', percentage: '80 – 82' },
  { gpa4: '2.3', letter: 'C+', percentage: '77 – 79' },
  { gpa4: '2.0', letter: 'C', percentage: '73 – 76' },
  { gpa4: '1.7', letter: 'C-', percentage: '70 – 72' },
  { gpa4: '1.3', letter: 'D+', percentage: '67 – 69' },
  { gpa4: '1.0', letter: 'D', percentage: '60 – 66' },
  { gpa4: '0.0', letter: 'F', percentage: 'Below 60' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            About GPA Conversion
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Understand how your academic scores are calculated and converted using industry-standard formulas.
          </p>
        </div>

        {/* What is GPA */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What is GPA?</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-800">GPA (Grade Point Average)</strong> is a standardized measure of academic achievement. It summarizes a student's academic performance into a single number, making it easy to compare across institutions and countries.
            </p>
            <p>
              <strong className="text-slate-800">SGPA (Semester Grade Point Average)</strong> is the GPA for a single semester. <strong className="text-slate-800">CGPA (Cumulative GPA)</strong> is the average of all SGPAs across all completed semesters.
            </p>
          </div>
        </section>

        {/* Formulas */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Conversion Formulas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'SGPA → GPA / 10',
                formula: 'GPA = Average(SGPA₁, SGPA₂, ...)',
                desc: 'Average all semester SGPA values. Since both are on the 10-point scale, no further conversion is needed.',
              },
              {
                title: 'SGPA → GPA / 4',
                formula: 'GPA = (Average SGPA ÷ 10) × 4',
                desc: 'First calculate the average SGPA (out of 10), then linearly scale it to the 4-point system used in the US.',
              },
              {
                title: 'Percentage → GPA / 10',
                formula: 'GPA = Percentage ÷ 10',
                desc: 'Dividing by 10 maps the 0-100 percentage scale onto the 0-10 GPA scale proportionally.',
              },
              {
                title: 'Percentage → GPA / 4',
                formula: 'GPA = (Percentage ÷ 100) × 4',
                desc: 'Scale the percentage (0-100) to the 4-point scale proportionally.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <div className="bg-blue-50 rounded-xl px-4 py-2.5 font-mono text-blue-700 text-sm mb-3">
                  {item.formula}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GPA / 10 table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Percentage to GPA/10 Table</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Percentage</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">GPA / 10</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Grade</th>
                </tr>
              </thead>
              <tbody>
                {conversionTable10.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-600">{row.percentage}</td>
                    <td className="px-5 py-3 font-medium text-blue-700">{row.gpa10}</td>
                    <td className="px-5 py-3 text-slate-600">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* GPA / 4 table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">US 4.0 GPA Scale</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">GPA / 4</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Letter Grade</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {conversionTable4.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-blue-700">{row.gpa4}</td>
                    <td className="px-5 py-3 text-slate-600">{row.letter}</td>
                    <td className="px-5 py-3 text-slate-600">{row.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Important Notes</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            {[
              'GPA conversion formulas may vary between institutions. Always verify with your university\'s official guidelines.',
              'This calculator uses standard widely-accepted formulas for educational reference purposes.',
              'The 10-point GPA scale is commonly used by Indian universities (UGC/NAAC guidelines).',
              'The 4.0 GPA scale is standard in the United States and Canada.',
              'All calculations are performed entirely in your browser — no data is sent to any server.',
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Open Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
