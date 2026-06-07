export type GPAScale = 10 | 4;

// SGPA to GPA on 10-point scale (direct mapping)
export function convertSGPATo10(sgpa: number): number {
  return Math.min(10, Math.max(0, Math.round(sgpa * 100) / 100));
}

// SGPA to GPA on 4-point scale
// Common formula: GPA4 = (SGPA10 / 10) * 4
export function convertSGPATo4(sgpa: number): number {
  const gpa = (sgpa / 10) * 4;
  return Math.min(4, Math.max(0, Math.round(gpa * 100) / 100));
}

// Percentage to GPA on 10-point scale
// Formula: GPA10 = Percentage / 10
export function convertPercentageTo10(percentage: number): number {
  const gpa = percentage / 10;
  return Math.min(10, Math.max(0, Math.round(gpa * 100) / 100));
}

// Percentage to GPA on 4-point scale
// Formula: GPA4 = (Percentage / 100) * 4
export function convertPercentageTo4(percentage: number): number {
  const gpa = (percentage / 100) * 4;
  return Math.min(4, Math.max(0, Math.round(gpa * 100) / 100));
}

// Calculate cumulative GPA from multiple semester GPAs
export function calculateCumulativeGPA(semesterValues: number[]): number {
  if (semesterValues.length === 0) return 0;
  const sum = semesterValues.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / semesterValues.length) * 100) / 100;
}

// Get letter grade label from GPA (out of 10)
export function getGradeLabel10(gpa: number): string {
  if (gpa >= 9) return 'O (Outstanding)';
  if (gpa >= 8) return 'A+ (Excellent)';
  if (gpa >= 7) return 'A (Very Good)';
  if (gpa >= 6) return 'B+ (Good)';
  if (gpa >= 5) return 'B (Above Average)';
  if (gpa >= 4) return 'C (Average)';
  return 'F (Fail)';
}

// Get letter grade label from GPA (out of 4)
export function getGradeLabel4(gpa: number): string {
  if (gpa >= 3.7) return 'A / A+';
  if (gpa >= 3.3) return 'A-';
  if (gpa >= 3.0) return 'B+';
  if (gpa >= 2.7) return 'B';
  if (gpa >= 2.3) return 'B-';
  if (gpa >= 2.0) return 'C+';
  if (gpa >= 1.7) return 'C';
  if (gpa >= 1.3) return 'C-';
  if (gpa >= 1.0) return 'D';
  return 'F';
}

export interface ConversionResult {
  inputType: 'sgpa' | 'percentage' | 'upload';
  inputValues: number[];
  cumulativeInput: number;
  scale: GPAScale;
  finalGPA: number;
  gradeLabel: string;
  conversionMethod: string;
}

export function computeResult(
  inputType: 'sgpa' | 'percentage',
  values: number[],
  scale: GPAScale
): ConversionResult {
  const cumulativeInput =
    inputType === 'sgpa' ? calculateCumulativeGPA(values) : values[0];

  let finalGPA: number;
  let conversionMethod: string;

  if (inputType === 'sgpa') {
    finalGPA =
      scale === 10
        ? convertSGPATo10(cumulativeInput)
        : convertSGPATo4(cumulativeInput);
    conversionMethod =
      scale === 10
        ? 'Average SGPA → GPA/10 (direct)'
        : 'Average SGPA → GPA/4 = (SGPA/10)×4';
  } else {
    finalGPA =
      scale === 10
        ? convertPercentageTo10(cumulativeInput)
        : convertPercentageTo4(cumulativeInput);
    conversionMethod =
      scale === 10
        ? 'Percentage → GPA/10 = Percentage÷10'
        : 'Percentage → GPA/4 = (Percentage÷100)×4';
  }

  const gradeLabel =
    scale === 10 ? getGradeLabel10(finalGPA) : getGradeLabel4(finalGPA);

  return {
    inputType,
    inputValues: values,
    cumulativeInput,
    scale,
    finalGPA,
    gradeLabel,
    conversionMethod,
  };
}
