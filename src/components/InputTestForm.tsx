'use client';

import { useState, useRef, ChangeEvent, TouchEvent, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/context/ReportContext';
import VirtualKeyboard from './VirtualKeyboard';

// Add TestReport interface
interface TestReport {
  tested: boolean;
  lastTestedAt: string | null;
  value: string | number | boolean | null;
}

// Update TestReports interface with index signature
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

// Add type for form data
interface FormData {
  text: string;
  number: number;
  range: number;
  checkbox: boolean;
  radio: string;
  select: string;
  textarea: string;
  date: string;
  color: string;
  submit: boolean;
  verticalScroll: boolean;
  horizontalScroll: boolean;
  drag: boolean;
}

export default function InputTestForm() {
  const router = useRouter();
  const { setReportData } = useReport();
  const [formData, setFormData] = useState<FormData>({
    text: '',
    number: 0,
    range: 50,
    checkbox: false,
    radio: 'option1',
    select: '',
    textarea: '',
    date: '',
    color: '#000000',
    submit: false,
    verticalScroll: false,
    horizontalScroll: false,
    drag: false,
  });

  const [testReports, setTestReports] = useState<TestReports>({
    text: { tested: false, lastTestedAt: null, value: null },
    number: { tested: false, lastTestedAt: null, value: null },
    range: { tested: false, lastTestedAt: null, value: null },
    checkbox: { tested: false, lastTestedAt: null, value: null },
    radio: { tested: false, lastTestedAt: null, value: null },
    select: { tested: false, lastTestedAt: null, value: null },
    textarea: { tested: false, lastTestedAt: null, value: null },
    date: { tested: false, lastTestedAt: null, value: null },
    color: { tested: false, lastTestedAt: null, value: null },
    submit: { tested: false, lastTestedAt: null, value: null },
    verticalScroll: { tested: false, lastTestedAt: null, value: null },
    horizontalScroll: { tested: false, lastTestedAt: null, value: null },
    drag: { tested: false, lastTestedAt: null, value: null },
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // Global event listeners for better mobile support
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        handleDragMoveDOM(e);
      }
    };

    const handleGlobalMouseUp = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        handleDragEndDOM(e);
      }
    };

    const handleGlobalTouchMove = (e: globalThis.TouchEvent) => {
      if (isDragging) {
        handleDragMoveDOM(e);
      }
    };

    const handleGlobalTouchEnd = (e: globalThis.TouchEvent) => {
      if (isDragging) {
        handleDragEndDOM(e);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, dragOffset]);

  // DOM event handlers for global listeners
  const handleDragMoveDOM = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (!isDragging || !dragRef.current || !containerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const newX = clientX - containerRect.left - dragOffset.x;
    const newY = clientY - containerRect.top - dragOffset.y;
    
    // Constrain to container bounds
    const maxX = containerRect.width - dragRef.current.offsetWidth;
    const maxY = containerRect.height - dragRef.current.offsetHeight;
    
    setDragPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleDragEndDOM = (e?: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isDragging) {
      setIsDragging(false);
      setTestReports(prev => ({
        ...prev,
        drag: {
          tested: true,
          lastTestedAt: new Date().toLocaleString(),
          value: 'Element dragged',
        },
      }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' || type === 'range') {
      newValue = Number(value);
    } else {
      newValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    setTestReports(prev => ({
      ...prev,
      [name]: {
        tested: true,
        lastTestedAt: new Date().toLocaleString(),
        value: newValue,
      },
    }));
  };

  const handleScroll = (type: 'verticalScroll' | 'horizontalScroll', element: HTMLDivElement) => {
    const maxScroll = type === 'verticalScroll' 
      ? element.scrollHeight - element.clientHeight
      : element.scrollWidth - element.clientWidth;
    
    const currentScroll = type === 'verticalScroll'
      ? element.scrollTop
      : element.scrollLeft;

    // Consider scrolling tested if user has scrolled at least 30% of the way
    if (currentScroll / maxScroll > 0.3) {
      setTestReports(prev => ({
        ...prev,
        [type]: {
          tested: true,
          lastTestedAt: new Date().toLocaleString(),
          value: `Scrolled ${Math.round((currentScroll / maxScroll) * 100)}%`,
        },
      }));
    }
  };

  const handleDragStart = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = dragRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (rect && containerRect) {
      let clientX: number, clientY: number;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update submit button test report
    const updatedReports = {
      ...testReports,
      submit: {
        tested: true,
        lastTestedAt: new Date().toLocaleString(),
        value: 'Button clicked',
      },
    };
    setTestReports(updatedReports);

    // Update context and navigate to report page
    setReportData(updatedReports);
    router.push('/report');
  };

  const getTestStatus = (name: keyof TestReports) => {
    const report = testReports[name];
    if (!report.tested) {
      return <span className="text-red-500">Not Tested</span>;
    }
    return (
      <div className="text-sm flex items-center gap-2">
        <span className="text-green-500">Tested</span>
        <span className="text-gray-500 hidden sm:inline">
          ({report.lastTestedAt} - {report.value?.toString() || 'No value'})
        </span>
      </div>
    );
  };

  // Virtual Keyboard Handlers
  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName);
    setIsKeyboardVisible(true);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
    setIsKeyboardVisible(false);
  };

  const handleKeyPress = (key: string) => {
    if (!activeInput) return;

    // For number input, only allow numbers 0-9 and minus sign
    if (activeInput === 'number') {
      const isNumber = /^[0-9]$/.test(key);
      const isMinus = key === '-';
      
      if (!isNumber && !isMinus) {
        return; // Block all other characters
      }
      
      // Prevent multiple minus signs
      if (isMinus && formData.number.toString().includes('-')) {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [activeInput]: prev[activeInput as keyof FormData] + key,
    }));
  };

  const handleBackspace = () => {
    if (!activeInput) return;

    setFormData(prev => {
      const currentValue = String(prev[activeInput as keyof FormData]);
      return {
        ...prev,
        [activeInput]: currentValue.slice(0, -1),
      };
    });
  };

  const handleSpace = () => {
    if (!activeInput) return;

    // Don't allow space in number input
    if (activeInput === 'number') {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [activeInput]: prev[activeInput as keyof FormData] + ' ',
    }));
  };

  const handleEnter = () => {
    if (!activeInput) return;
    
    // Since only number input shows keyboard, just hide it when Enter is pressed
    setIsKeyboardVisible(false);
    setActiveInput(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-wrapper border-2 border-gray-300 rounded-lg p-6 w-1/2 sm:w-[70%] min-w-[300px] bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="text" className="block font-medium">
                Text Input
              </label>
              {getTestStatus('text')}
            </div>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus('text')}
              onBlur={handleInputBlur}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter text here"
            />
          </div>

          {/* Number Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="number" className="block font-medium">
                Number Input
              </label>
              {getTestStatus('number')}
            </div>
            <input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus('number')}
              onBlur={handleInputBlur}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="range" className="block font-medium">
                Range Slider
              </label>
              {getTestStatus('range')}
            </div>
            <input
              type="range"
              id="range"
              name="range"
              value={formData.range}
              onChange={handleInputChange}
              className="w-full"
              min="0"
              max="100"
            />
            <div className="text-sm text-gray-500">Value: {formData.range}</div>
          </div>

          {/* Checkbox */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={formData.checkbox}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span className="font-medium">Checkbox</span>
              </label>
              {getTestStatus('checkbox')}
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="font-medium">Radio Buttons</div>
              {getTestStatus('radio')}
            </div>
            <div className="space-y-2">
              {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="radio"
                    value={`option${index + 1}`}
                    checked={formData.radio === `option${index + 1}`}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Select/Dropdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="select" className="block font-medium">
                Select Menu
              </label>
              {getTestStatus('select')}
            </div>
            <select
              id="select"
              name="select"
              value={formData.select}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="textarea" className="block font-medium">
                Textarea
              </label>
              {getTestStatus('textarea')}
            </div>
            <textarea
              id="textarea"
              name="textarea"
              value={formData.textarea}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus('textarea')}
              onBlur={handleInputBlur}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Enter multiple lines of text"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="date" className="block font-medium">
                Date Picker
              </label>
              {getTestStatus('date')}
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="color" className="block font-medium">
                Color Picker
              </label>
              {getTestStatus('color')}
            </div>
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full h-10"
            />
          </div>

          {/* Drag Test */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label className="block font-medium">
                Drag Test
              </label>
              {getTestStatus('drag')}
            </div>
            <div 
              ref={containerRef}
              className="relative h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
              style={{ touchAction: 'none' }}
            >
              <div
                ref={dragRef}
                className={`absolute cursor-move bg-gradient-to-r from-blue-400 to-pink-400 text-white p-4 rounded-lg shadow-lg select-none transition-shadow ${
                  isDragging ? 'shadow-xl scale-105' : ''
                }`}
                style={{
                  transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                draggable={false}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Drag Me!</div>
                  <div className="text-sm opacity-90">Touch and drag to test</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-left mt-2">
              Please drag the element around
            </p>
          </div>

          {/* Vertical Scroll Test */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label className="block font-medium">
                Vertical Scroll Test
              </label>
              {getTestStatus('verticalScroll')}
            </div>
            <div
              ref={verticalScrollRef}
              className="h-40 overflow-y-auto border rounded-lg p-4"
              onScroll={(e) => handleScroll('verticalScroll', e.currentTarget)}
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <span key={i} className="text-gray-600 text-center w-8 h-8 flex items-center justify-center text-sm">
                      {`${'↓'} `}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-left mt-2">
              Please scroll down
            </p>
          </div>

          {/* Horizontal Scroll Test */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label className="block font-medium">
                Horizontal Scroll Test
              </label>
              {getTestStatus('horizontalScroll')}
            </div>
            <div
              ref={horizontalScrollRef}
              className="h-20 overflow-x-auto border rounded-lg p-4"
              onScroll={(e) => handleScroll('horizontalScroll', e.currentTarget)}
            >
              <div className="flex space-x-4 min-w-[200%]">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <p className="text-gray-600 whitespace-nowrap">
                      {`${'→'} `}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 text-left mt-2">
              Please scroll right
            </p>
          </div>

          {/* Submit Button */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-medium">Submit Button</span>
              {getTestStatus('submit')}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-pink-400 text-white py-2 px-4 rounded-lg hover:from-blue-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
            >
              Submit Form and View Report
            </button>
          </div>
        </form>
      </div>
      
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
        onEnter={handleEnter}
        isVisible={isKeyboardVisible}
        onToggle={() => setIsKeyboardVisible(!isKeyboardVisible)}
      />
    </div>
  );
} 