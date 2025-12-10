import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimatedSelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface AnimatedSelectProps {
  options: AnimatedSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor?: 'orange' | 'purple';
  className?: string;
}

export const AnimatedSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  accentColor = 'orange',
  className,
}: AnimatedSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: AnimatedSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const accentClasses = {
    orange: {
      ring: 'focus-within:ring-scalador-orange/30 focus-within:border-scalador-orange',
      hover: 'hover:bg-scalador-orange hover:text-white',
      border: 'border-scalador-orange/30',
      selected: 'bg-scalador-orange/10',
    },
    purple: {
      ring: 'focus-within:ring-purple-500/30 focus-within:border-purple-400',
      hover: 'hover:bg-purple-500 hover:text-white',
      border: 'border-purple-400/30',
      selected: 'bg-purple-500/10',
    },
  };

  const accent = accentClasses[accentColor];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full p-3 sm:p-4 glass rounded-xl font-medium text-sm sm:text-base',
          'flex items-center justify-between gap-2',
          'transition-all duration-300 ring-4 ring-transparent',
          accent.ring,
          'text-foreground'
        )}
      >
        <span className="truncate text-left">
          {selectedOption?.icon && <span className="mr-2">{selectedOption.icon}</span>}
          {displayLabel}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 opacity-60 flex-shrink-0" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 w-full mt-2 rounded-xl overflow-hidden shadow-2xl',
              'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
              'border-2',
              accent.border
            )}
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full px-4 py-3 text-left transition-colors duration-200',
                    'flex items-center justify-between group',
                    'text-gray-700 dark:text-gray-200',
                    accent.hover,
                    value === option.value && accent.selected,
                    index !== options.length - 1 && 'border-b border-gray-100 dark:border-gray-800'
                  )}
                >
                  <span className="font-medium text-sm sm:text-base truncate">
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 flex-shrink-0" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedSelect;
