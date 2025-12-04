// AICODE-NOTE: Компонент множественного выбора каналов
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../Badge';

interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const MultiSelect = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Выберите...',
  error,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-dark-textSecondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 min-h-touch
            bg-dark-surface border rounded-telegram
            text-left text-dark-text
            focus-ring
            transition-telegram
            flex items-center justify-between
            ${error ? 'border-red-500' : 'border-dark-border focus:border-primary-400 focus:ring-primary-400/20'}
          `}
        >
          <span className={selected.length === 0 ? 'text-dark-textMuted' : ''}>
            {selected.length === 0
              ? placeholder
              : selected.length === 1
              ? selectedOptions[0].label
              : `Выбрано: ${selected.length}`}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-dark-surface border border-dark-border rounded-telegram shadow-lg max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={`
                    w-full px-4 py-3 min-h-touch text-left
                    transition-telegram
                    flex items-center justify-between
                    ${isSelected ? 'bg-primary-700/20' : 'hover:bg-dark-surfaceHover'}
                  `}
                >
                  <span className="text-dark-text">{option.label}</span>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className="inline-flex items-center border-none bg-transparent p-0 cursor-pointer"
            >
              <Badge
                variant="primary"
                className="cursor-pointer"
              >
                {option.label}
                <span className="ml-1">×</span>
              </Badge>
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

