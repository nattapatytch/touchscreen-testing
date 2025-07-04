'use client';

import { useRouter } from 'next/navigation';
import { useReport } from '@/context/ReportContext';

export default function ReportPage() {
  const router = useRouter();
  const { reportData } = useReport();

  if (!reportData) {
    router.push('/');
    return null;
  }

  const handleRestartTest = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-wrapper border-2 border-gray-300 rounded-lg p-6 w-1/2 sm:w-[70%] min-w-[300px] bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Input Testing Report
          </h1>
          <button
            onClick={handleRestartTest}
            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-lg hover:from-blue-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
          >
            Start New Test
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-6">Test Results Summary</h2>
          
          {/* Regular Inputs */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">Input Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(reportData)
                .filter(([name]) => !['verticalScroll', 'horizontalScroll'].includes(name))
                .map(([name, report]) => (
                  <div key={name} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{name}</span>
                      <span className={report.tested ? 'text-green-500' : 'text-red-500'}>
                        {report.tested ? '✓ Tested' : '✗ Not Tested'}
                      </span>
                    </div>
                    {report.tested && (
                      <div className="text-sm text-gray-600">
                        <div>Last Tested: {report.lastTestedAt}</div>
                        <div>Value: {report.value?.toString() || 'No value'}</div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Scroll Tests */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Scroll Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['verticalScroll', 'horizontalScroll'].map(scrollType => {
                const report = reportData[scrollType];
                return (
                  <div key={scrollType} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {scrollType === 'verticalScroll' ? 'Vertical Scroll' : 'Horizontal Scroll'}
                      </span>
                      <span className={report?.tested ? 'text-green-500' : 'text-red-500'}>
                        {report?.tested ? '✓ Tested' : '✗ Not Tested'}
                      </span>
                    </div>
                    {report?.tested && (
                      <div className="text-sm text-gray-600">
                        <div>Last Tested: {report.lastTestedAt}</div>
                        <div>Progress: {report.value}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 