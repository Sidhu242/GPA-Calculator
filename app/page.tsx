import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Upload,
  Keyboard,
  BarChart3,
  Shield,
  Zap,
  RefreshCw,
} from 'lucide-react';

const features = [
  {
    icon: Keyboard,
    title: 'Manual Entry',
    desc: 'Enter SGPA for each semester or your overall percentage. Instant calculation.',
  },
  {
    icon: Upload,
    title: 'Marksheet Upload',
    desc: 'Upload PDF or image marksheets. We extract values automatically using OCR.',
  },
  {
    icon: BarChart3,
    title: 'Dual Scale Support',
    desc: 'Convert to GPA on both 10-point and 4-point (US) scales simultaneously.',
  },
  {
    icon: Shield,
    title: 'Completely Private',
    desc: 'All processing happens in your browser. No data is uploaded or stored.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    desc: 'Get your GPA in milliseconds with the conversion formula displayed clearly.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Correction',
    desc: 'After uploading, review and manually correct any extracted values before calculating.',
  },
];

const steps = [
  { step: '01', title: 'Choose input method', desc: 'Enter SGPA/percentage manually or upload your marksheet' },
  { step: '02', title: 'Select GPA scale', desc: 'Choose between GPA/10 (Indian standard) or GPA/4 (US standard)' },
  { step: '03', title: 'Get your result', desc: 'See your GPA, letter grade, and the conversion formula used' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 text-sm text-blue-300 mb-6">
              <GraduationCap className="h-4 w-4" />
              <span>Free &bull; Private &bull; Instant</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Calculate Your GPA{' '}
              <span className="text-blue-400">Instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Convert SGPA, CGPA, or percentage to GPA on 10 or 4-point scales. Upload your marksheet and let us extract the values automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
              >
                Start Calculating
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '2 Scales', label: 'GPA/10 & GPA/4' },
              { value: '3 Modes', label: 'SGPA, %, Upload' },
              { value: '100%', label: 'Browser-based' },
              { value: '0s', label: 'Data stored' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
          <p className="mt-3 text-slate-500">A complete GPA toolkit built for students</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 mb-4 group-hover:bg-blue-100 transition-colors">
                <f.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-500">Three simple steps to your GPA</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-full h-px border-t-2 border-dashed border-slate-300" />
                )}
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to calculate?</h2>
          <p className="text-blue-100 text-lg mb-8">
            No sign-up. No ads. No data collection. Just fast, accurate GPA conversion.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Open Calculator
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
