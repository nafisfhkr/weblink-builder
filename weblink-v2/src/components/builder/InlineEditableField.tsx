"use client";

import { useState, useRef, useEffect } from "react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (val: string) => void;
  placeholder?: string;
  isUrl?: boolean;
}

export default function InlineEditableField({ value, onSave, placeholder, isUrl }: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue.trim() !== value) {
      // Basic URL auto-prepend if isUrl is true
      let finalValue = currentValue.trim();
      if (isUrl && finalValue && !/^https?:\/\//i.test(finalValue)) {
        finalValue = `https://${finalValue}`;
      }
      setCurrentValue(finalValue);
      onSave(finalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="bg-gray-800 text-white w-full border border-gray-600 rounded px-2 py-1 outline-none focus:border-blue-500 font-sans"
        placeholder={placeholder}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`cursor-pointer hover:bg-gray-800 px-2 py-1 rounded w-full truncate border border-transparent hover:border-gray-700 transition-colors font-sans ${!currentValue ? 'text-gray-500 italic' : ''}`}
    >
      {currentValue || placeholder}
    </div>
  );
}
