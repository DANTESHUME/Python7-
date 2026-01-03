import { useState, useEffect } from 'react';

export interface WordProgress {
  id: string;
  status: 'new' | 'learning' | 'mastered';
  nextReview: number; // Timestamp
  interval: number; // Days
  mistakes: number;
  lastReview: number; // Timestamp
}

export interface DayProgress {
  day: number;
  completed: boolean;
  score: number;
  completedAt?: number;
}

export interface UserProgress {
  currentDay: number;
  days: Record<number, DayProgress>;
  words: Record<string, WordProgress>;
  mistakes: string[]; // Word IDs
  notes: Record<string, string>; // Word ID -> Note
}

const STORAGE_KEY = 'english_vocab_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  currentDay: 1,
  days: {},
  words: {},
  mistakes: [],
  notes: {}
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  } catch (e) {
    console.error('Failed to load progress', e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  const updateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const markWord = (wordId: string, status: 'learning' | 'mastered') => {
    const newProgress = { ...progress };
    const word = newProgress.words[wordId] || {
      id: wordId,
      status: 'new',
      nextReview: 0,
      interval: 0,
      mistakes: 0,
      lastReview: 0
    };

    word.status = status;
    word.lastReview = Date.now();
    
    // Simple Spaced Repetition Logic
    if (status === 'mastered') {
      word.interval = word.interval === 0 ? 1 : word.interval * 2;
    } else {
      word.interval = 1;
    }
    word.nextReview = Date.now() + word.interval * 24 * 60 * 60 * 1000;

    newProgress.words[wordId] = word;
    updateProgress(newProgress);
  };

  const completeDay = (day: number, score: number) => {
    const newProgress = { ...progress };
    newProgress.days[day] = {
      day,
      completed: true,
      score,
      completedAt: Date.now()
    };
    if (day === newProgress.currentDay && day < 10) {
      newProgress.currentDay = day + 1;
    }
    updateProgress(newProgress);
  };

  const resetProgress = () => {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
      updateProgress(DEFAULT_PROGRESS);
    }
  };

  return {
    progress,
    updateProgress,
    markWord,
    completeDay,
    resetProgress
  };
};
