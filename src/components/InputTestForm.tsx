'use client';

import { useState, useRef, ChangeEvent } from 'react';
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
  elementDragDrop: TestReport;
}

interface DraggableItem {
  id: string;
  position: number;
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
  elementDragDrop: boolean;
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
    elementDragDrop: false,
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
    elementDragDrop: { tested: false, lastTestedAt: null, value: null },
  });

  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([
    { id: '1', position: 1 },
    { id: '2', position: 2 },
    { id: '3', position: 3 },
    { id: '4', position: 4 },
  ]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

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

  const handleElementDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggableItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleElementDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleElementDrop = (e: React.DragEvent<HTMLDivElement>, targetPosition: number) => {
    e.preventDefault();
    const draggedItem: DraggableItem = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (draggedItem.position !== targetPosition) {
      setDraggableItems(prev => {
        return prev.map(item => {
          if (item.id === draggedItem.id) {
            return { ...item, position: targetPosition };
          }
          if (item.position === targetPosition) {
            return { ...item, position: draggedItem.position };
          }
          return item;
        });
      });

      setTestReports(prev => ({
        ...prev,
        elementDragDrop: {
          tested: true,
          lastTestedAt: new Date().toLocaleString(),
          value: `Swapped: Item ${draggedItem.id} (${draggedItem.position} → ${targetPosition})`,
        },
      }));
      setFormData(prev => ({ ...prev, elementDragDrop: true }));
    }
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
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <span key={i} className="text-gray-600 text-center w-8 h-8 flex items-center justify-center text-sm">
                      {" "}
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
              className="overflow-x-auto border rounded-lg p-4"
              onScroll={(e) => handleScroll('horizontalScroll', e.currentTarget)}
            >
              <div className="flex space-x-4 min-w-[200%]">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <p className="text-gray-600 whitespace-nowrap">
                      {" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 text-left mt-2">
              Please scroll right
            </p>
          </div>

          {/* Element Drag and Drop Test */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label className="block font-medium">
                Drag and Drop Test
              </label>
              {getTestStatus('elementDragDrop')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((position) => (
                <div
                  key={position}
                  onDragOver={handleElementDragOver}
                  onDrop={(e) => handleElementDrop(e, position)}
                  className="h-24 border-2 border-dashed rounded-lg p-4 relative bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="absolute top-2 right-2 text-sm font-medium text-gray-400">
                    {position}
                  </div>
                  {draggableItems.map((item) => {
                    if (item.position === position) {
                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleElementDragStart(e, item)}
                          className={`
                            h-full flex items-center justify-center 
                            cursor-move rounded-lg transition-transform
                            hover:scale-[0.98] active:scale-[0.95]
                            ${item.id === '1' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                              item.id === '2' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 
                              item.id === '3' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 
                              'bg-gradient-to-br from-violet-500 to-violet-600'}
                          `}
                        >
                          <div className="text-center">
                            <div className="font-medium text-white text-lg">
                              Item {item.id}
                            </div>
                            <div className="text-sm text-white/80">
                              Current Position: {item.position}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {testReports.elementDragDrop.tested 
                ? '✓ Drop successful! Try swapping other items' 
                : 'Drag and drop items to swap their positions'}
            </p>
            <div className="text-xs text-gray-400 mt-1">
              Each item can be dragged to a different position to swap places
            </div>
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