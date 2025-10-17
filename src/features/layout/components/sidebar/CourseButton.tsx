'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMembershipAccess } from '@features/membership/hooks/useMembershipAccess';
import { motion } from 'framer-motion';
import { GraduationCap, Lock } from 'lucide-react';
import Link from 'next/link';

type Props = {
  isCollapsed: boolean;
};

export const CourseButton = ({ isCollapsed }: Props) => {
  const { hasCoursesAccess, isLoading } = useMembershipAccess();

  const buttonContent = (
    <div
      className={`flex items-center gap-3 p-2 mx-2 rounded-lg transition-colors border ${
        hasCoursesAccess
          ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500 cursor-pointer'
          : 'border-gray-600/50 bg-gray-800/50 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={`p-1.5 rounded-md ${
            hasCoursesAccess
              ? 'bg-amber-500/20'
              : 'bg-gray-700'
          }`}
        >
          {hasCoursesAccess ? (
            <GraduationCap className="h-4 w-4 text-amber-500" />
          ) : (
            <Lock className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <motion.span
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
          }}
          transition={{ duration: 0.2 }}
          className={`text-sm font-medium whitespace-nowrap overflow-hidden ${
            hasCoursesAccess
              ? 'text-amber-500'
              : 'text-gray-400'
          }`}
        >
          Cursos
        </motion.span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-2 p-2">
        <div className="h-9 bg-gray-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {hasCoursesAccess ? (
              <Link
                href="https://nexusglobal.rf.gd/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonContent}
              </Link>
            ) : (
              <div>{buttonContent}</div>
            )}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-layout-sidebar border-sidebar-border shadow-lg"
          >
            <div className="space-y-1">
              <p className="font-medium text-layout-sidebar-foreground">
                {hasCoursesAccess ? 'Acceder a Cursos' : 'Cursos Bloqueados'}
              </p>
              {!hasCoursesAccess && (
                <p className="text-xs text-amber-400">
                  Requiere membresía Premium o VIP
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hasCoursesAccess) {
    return (
      <Link
        href="https://nexusglobal.rf.gd/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{buttonContent}</div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-layout-sidebar border-sidebar-border shadow-lg max-w-xs"
        >
          <div className="space-y-2">
            <p className="font-medium text-layout-sidebar-foreground">
              Acceso Restringido
            </p>
            <p className="text-xs text-amber-400">
              Necesitas una membresía Premium (PRE) o VIP para acceder a los
              cursos
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
