'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TestReport {
  tested: boolean;
  lastTestedAt: string | null;
  value: string | number | boolean | null;
}

interface TestReports {
  [key: string]: TestReport;
  text: TestReport;
  number: TestReport;
  range: TestReport;
  checkbox: TestReport;
  radio: TestReport;
  select: TestReport;
  textarea: TestReport;
  date: TestReport;
  color: TestReport;
  submit: TestReport;
  verticalScroll: TestReport;
  horizontalScroll: TestReport;
  drag: TestReport;
}

interface ReportContextType {
  reportData: TestReports | null;
  setReportData: (data: TestReports) => void;
}

export const ReportContext = createContext<ReportContextType>({
  reportData: null,
  setReportData: () => {},
});

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportData, setReportData] = useState<TestReports | null>(null);

  return (
    <ReportContext.Provider value={{ reportData, setReportData }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport(): ReportContextType {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
} 