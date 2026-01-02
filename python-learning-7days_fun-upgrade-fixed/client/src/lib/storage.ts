import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExerciseState {
  completed: boolean;
  attempts: number;
}

export interface DayProgress {
  completed: boolean;
  exercises: Record<string, ExerciseState>;
  homework: string;
  review: string[];
}

export interface UserProgress {
  days: Record<number, DayProgress>;
  notes: Record<number, string>;
  mistakes: Record<string, string>;
  lastActiveDay: number;

  // gamification
  xp: number;
  streak: number; // consecutive completed days (in order)
  lastCompletedDay: number | null;
  badges: string[]; // badge ids
}

interface ProgressStore extends UserProgress {
  completeDay: (day: number) => void;
  updateExercise: (day: number, exerciseId: string, completed: boolean) => void;
  saveHomework: (day: number, content: string) => void;
  saveReview: (day: number, index: number, content: string) => void;
  saveNote: (day: number, content: string) => void;
  recordMistake: (exerciseId: string, wrongAnswer: string) => void;
  resetProgress: () => void;
  setLastActiveDay: (day: number) => void;
}

const addBadge = (badges: string[], id: string) => (badges.includes(id) ? badges : [...badges, id]);

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      days: {},
      notes: {},
      mistakes: {},
      lastActiveDay: 1,

      xp: 0,
      streak: 0,
      lastCompletedDay: null,
      badges: [],

      completeDay: (day) =>
        set((state) => {
          const already = state.days[day]?.completed;
          const nextLastActive = Math.min(day + 1, 7);

          // streak logic (only counts when you complete days in order)
          const isInOrder = state.lastCompletedDay === day - 1;
          const nextStreak = already ? state.streak : (isInOrder ? state.streak + 1 : 1);
          let nextBadges = state.badges;

          if (!already) {
            nextBadges = addBadge(nextBadges, `day${day}`);
            if (nextStreak >= 3) nextBadges = addBadge(nextBadges, 'streak3');
            if (nextStreak >= 7) nextBadges = addBadge(nextBadges, 'streak7');
          }

          return {
            days: {
              ...state.days,
              [day]: { ...state.days[day], completed: true },
            },
            lastActiveDay: nextLastActive,
            xp: already ? state.xp : state.xp + 50,
            streak: nextStreak,
            lastCompletedDay: already ? state.lastCompletedDay : day,
            badges: nextBadges,
          };
        }),

      updateExercise: (day, exerciseId, completed) =>
        set((state) => {
          const currentDay: DayProgress =
            state.days[day] || { exercises: {}, homework: '', review: [], completed: false };
          const currentExercise = currentDay.exercises[exerciseId] || { completed: false, attempts: 0 };

          const nextCompleted = completed;
          const wasCompleted = currentExercise.completed;

          const nextExercise: ExerciseState = {
            completed: nextCompleted,
            attempts: currentExercise.attempts + 1,
          };

          return {
            days: {
              ...state.days,
              [day]: {
                ...currentDay,
                exercises: {
                  ...currentDay.exercises,
                  [exerciseId]: nextExercise,
                },
              },
            },
            xp: !wasCompleted && nextCompleted ? state.xp + 10 : state.xp,
          };
        }),

      saveHomework: (day, content) =>
        set((state) => ({
          days: {
            ...state.days,
            [day]: { ...(state.days[day] || { exercises: {}, completed: false, review: [] }), homework: content },
          },
        })),

      saveReview: (day, index, content) =>
        set((state) => {
          const currentDay: DayProgress =
            state.days[day] || { exercises: {}, homework: '', review: [], completed: false };
          const newReview = [...(currentDay.review || [])];
          newReview[index] = content;
          return {
            days: {
              ...state.days,
              [day]: { ...currentDay, review: newReview },
            },
          };
        }),

      saveNote: (day, content) =>
        set((state) => ({
          notes: { ...state.notes, [day]: content },
        })),

      recordMistake: (exerciseId, wrongAnswer) =>
        set((state) => ({
          mistakes: { ...state.mistakes, [exerciseId]: wrongAnswer },
        })),

      resetProgress: () =>
        set({
          days: {},
          notes: {},
          mistakes: {},
          lastActiveDay: 1,
          xp: 0,
          streak: 0,
          lastCompletedDay: null,
          badges: [],
        }),

      setLastActiveDay: (day) => set({ lastActiveDay: day }),
    }),
    { name: 'python-7days-progress' }
  )
);
