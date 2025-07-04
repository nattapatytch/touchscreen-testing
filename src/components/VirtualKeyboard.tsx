'use client';

import { useState } from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  onEnter,
  isVisible,
  onToggle
}: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false);

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const shiftKeys = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const currentKeys = isShift ? shiftKeys : keys;

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  const handleShiftClick = () => {
    setIsShift(!isShift);
  };

  const handleKeyboardMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t-2 border-gray-300 p-4 z-50" onMouseDown={handleKeyboardMouseDown}>
      <div className="max-w-4xl mx-auto">
        {/* Toggle Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onToggle}
            data-testid="keyboard-toggle"
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Hide Keyboard
          </button>
        </div>

        {/* Keyboard Layout */}
        <div className="space-y-2" data-testid="keyboard-layout">
          {currentKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  data-testid={`key-${key}`}
                  onClick={() => handleKeyClick(key)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors min-w-[40px] h-10 flex items-center justify-center"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom Row with Special Keys */}
          <div className="flex justify-center gap-1">
            <button
              onClick={handleShiftClick}
              data-testid="key-shift"
              className={`border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors min-w-[60px] h-10 flex items-center justify-center ${
                isShift ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {isShift ? 'SHIFT' : 'shift'}
            </button>
            
            <button
              onClick={onSpace}
              data-testid="key-space"
              className="bg-white border border-gray-300 rounded-lg px-8 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors h-10 flex items-center justify-center"
            >
              Space
            </button>

            <button
              onClick={onBackspace}
              data-testid="key-backspace"
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors min-w-[60px] h-10 flex items-center justify-center"
            >
              ←
            </button>

            <button
              onClick={onEnter}
              data-testid="key-enter"
              className="bg-blue-500 text-white border border-blue-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors min-w-[60px] h-10 flex items-center justify-center"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 