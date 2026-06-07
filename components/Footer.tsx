import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">
              GPA<span className="text-blue-600">Calc</span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <Link href="/calculator" className="hover:text-slate-800 transition-colors">Calculator</Link>
            <Link href="/about" className="hover:text-slate-800 transition-colors">About Conversion</Link>
          </nav>

          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} GPACalc. All processing is done locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
