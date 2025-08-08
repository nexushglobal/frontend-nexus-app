'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, onCheckedChange, disabled = false, className, id, ...props },
    ref,
  ) => {
    const [mount, setMount] = useState(false);
    // mount the switch component with a button element
    useEffect(() => {
      setMount(true);
    }, []);

    if (!mount) return null;

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          'group relative flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input border-2 border-border',
          className,
        )}
        {...props}
      >
        {/* Background with subtle animation */}
        <div className="absolute inset-0 rounded-full transition-all duration-300">
          {/* Active state background effects */}
          {checked && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute inline-block h-[1px] w-[1px] bg-primary-foreground/30 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: Math.random() * 1.5,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumb */}
        <motion.div
          className={cn(
            'relative flex h-4 w-4 items-center justify-center rounded-full shadow-lg transition-colors duration-300',
            checked
              ? 'bg-primary-foreground'
              : 'bg-background border border-border',
          )}
          animate={{
            x: checked ? 20 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          {/* Inner glow effect when active */}
          {checked && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary-foreground"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          )}

          {/* Active indicator dot */}
          {checked && (
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              checked ? 'bg-primary-foreground/10' : 'bg-foreground/5',
            )}
          />
        </div>

        {/* Focus ring for accessibility */}
        <div className="absolute inset-0 rounded-full ring-offset-2 ring-offset-background group-focus-visible:ring-2 group-focus-visible:ring-ring" />
      </button>
    );
  },
);

Switch.displayName = 'Switch';

export { Switch };
