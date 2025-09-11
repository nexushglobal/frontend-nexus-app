'use client';

import { create } from 'zustand';
import type { Project } from '../types/lots.types';

type ViewMode = 'projects' | 'lots';

interface LotsNavigationState {
  currentView: ViewMode;
  selectedProject: Project | null;

  // Actions
  setView: (view: ViewMode) => void;
  selectProject: (project: Project) => void;
  backToProjects: () => void;
}

export const useLotsNavigationStore = create<LotsNavigationState>((set) => ({
  currentView: 'projects',
  selectedProject: null,

  setView: (view) => set({ currentView: view }),

  selectProject: (project) => {
    set({
      selectedProject: project,
      currentView: 'lots',
    });
  },

  backToProjects: () =>
    set({
      currentView: 'projects',
      selectedProject: null,
    }),
}));
