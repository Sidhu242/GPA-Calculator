export interface ExtractedData {
  rawText: string;
  sgpaValues: number[];
  cgpa: number | null;
  percentage: number | null;
  detectedType: 'sgpa' | 'cgpa' | 'percentage' | 'mixed' | 'unknown';
}

function parseFloats(text: string, pattern: RegExp): number[] {
  const matches = Array.from(text.matchAll(pattern));
  return matches
    .map((m) => parseFloat(m[1]))
    .filter((v) => !isNaN(v) && v >= 0 && v <= 100);
}

export function extractDataFromText(rawText: string): ExtractedData {
  const text = rawText.toUpperCase();

  // Extract SGPA values - look for patterns like "SGPA: 8.5" or "SGPA 8.50"
  const sgpaMatches = parseFloats(
    text,
    /SGPA[\s:=]+(\d+\.?\d*)/g
  ).filter((v) => v <= 10);

  // Extract CGPA - look for "CGPA: 8.2" or "CGPA 8.20"
  const cgpaMatches = parseFloats(
    text,
    /CGPA[\s:=]+(\d+\.?\d*)/g
  ).filter((v) => v <= 10);

  // Extract percentage - look for patterns like "75.5%" or "Percentage: 75.5"
  const percentagePatternMatches = parseFloats(
    text,
    /(?:PERCENTAGE|PERCENT|PCT|MARKS[\s%]*)[\s:=]+(\d+\.?\d*)/g
  );
  const percentSignMatches = parseFloats(text, /(\d+\.?\d*)\s*%/g).filter(
    (v) => v <= 100
  );

  const percentageValues = [
    ...percentagePatternMatches,
    ...percentSignMatches,
  ].filter((v) => v > 10 && v <= 100);

  // Remove duplicates from percentage values
  const uniquePercentages = Array.from(new Set(percentageValues));

  // Also look for generic decimal values that might be semester grades (fallback)
  const genericGrades = parseFloats(
    text,
    /(?:SEM(?:ESTER)?[\s\w]*|GRADE[\s:=]+)(\d+\.?\d*)/g
  ).filter((v) => v <= 10);

  const cgpa = cgpaMatches.length > 0 ? cgpaMatches[0] : null;
  const percentage =
    uniquePercentages.length > 0 ? uniquePercentages[0] : null;

  let detectedType: ExtractedData['detectedType'] = 'unknown';
  if (sgpaMatches.length > 0 && cgpa !== null) {
    detectedType = 'mixed';
  } else if (sgpaMatches.length > 0) {
    detectedType = 'sgpa';
  } else if (cgpa !== null) {
    detectedType = 'cgpa';
  } else if (percentage !== null) {
    detectedType = 'percentage';
  }

  return {
    rawText,
    sgpaValues: sgpaMatches.length > 0 ? sgpaMatches : genericGrades,
    cgpa,
    percentage,
    detectedType,
  };
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');

  // Use CDN worker to avoid Next.js bundling issues
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const Tesseract = await import('tesseract.js');
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: (m: any) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  const url = URL.createObjectURL(blob);

  try {
    const result = await worker.recognize(url);
    return result.data.text;
  } finally {
    URL.revokeObjectURL(url);
    await worker.terminate();
  }
}

export async function processUploadedFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExtractedData> {
  let rawText = '';

  if (file.type === 'application/pdf') {
    onProgress?.(10);
    rawText = await extractTextFromPDF(file);
    onProgress?.(100);
  } else if (file.type.startsWith('image/')) {
    rawText = await extractTextFromImage(file, onProgress);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or image.');
  }

  return extractDataFromText(rawText);
}
