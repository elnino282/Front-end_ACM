import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

interface AI_FloatButtonProps {
  onClick: () => void;
}

export function AI_FloatButton({ onClick }: AI_FloatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed z-[9999] transition-all duration-300 ease-out group
                       bottom-6 right-6 md:bottom-6 md:right-6
                       w-14 h-14 md:w-16 md:h-16
                       focus:outline-none focus:ring-4 focus:ring-green-500/30"
            style={{
              borderRadius: '100%',
              background: 'linear-gradient(135deg, #16A34A 0%, #2563EB 100%)',
              boxShadow: isHovered
                ? '0 8px 24px rgba(22, 163, 74, 0.4), 0 4px 12px rgba(37, 99, 235, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.15)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
            aria-label="Ask AI Assistant"
            tabIndex={0}
          >
            {/* Breathing animation background */}
            <div
              className="absolute inset-0 rounded-full opacity-40 animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
              }}
            />

            {/* Sparkle effect on hover */}
            {isHovered && (
              <div className="absolute -top-1 -right-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
              </div>
            )}

            {/* AI Icon */}
            <div className="relative flex items-center justify-center w-full h-full">
              <Bot className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10 transition-transform duration-300 group-hover:rotate-12" />
            </div>

            {/* Ripple effect on hover */}
            {isHovered && (
              <>
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #16A34A 0%, #2563EB 100%)',
                    animationDuration: '1.5s',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-10"
                  style={{
                    background: 'linear-gradient(135deg, #16A34A 0%, #2563EB 100%)',
                    animationDuration: '2s',
                    animationDelay: '0.3s',
                  }}
                />
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-sm">
          <p>Ask AI Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}