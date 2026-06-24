import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";
import { api } from "../services/api";
import type { Exercise, Workout } from "../types/workout";
import type { UserWorkout } from "../services/api";

export function useUserWorkouts() {
  const { session } = useAuth();
  const [localWorkouts, setLocalWorkouts] = useLocalStorage<Workout[]>(
    "workouts",
    [],
  );
  const [remoteWorkouts, setRemoteWorkouts] = useState<UserWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  const loggedIn = !!session;

  const reload = useCallback(async () => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getUserWorkouts();
      setRemoteWorkouts(data);
    } finally {
      setLoading(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    reload();
  }, [reload]);

  // formato unificado, independente da fonte (local ou remoto)
  const workouts: Workout[] = loggedIn
    ? remoteWorkouts.map((uw) => uw.workout)
    : localWorkouts;

  async function addWorkout(payload: {
    title: string;
    type: Workout["type"];
    exercises: Workout["exercises"];
  }) {
    if (loggedIn) {
      await api.createOwnWorkout(payload);
      await reload();
    } else {
      const newWorkout: Workout = { id: crypto.randomUUID(), ...payload };
      setLocalWorkouts((prev) => [...prev, newWorkout]);
    }
  }

  async function updateWorkout(
    workoutId: string,
    payload: {
      title: string;
      type: Workout["type"];
      exercises: Workout["exercises"];
    },
  ) {
    if (loggedIn) {
      await api.updateOwnWorkout(workoutId, payload);
      await reload();
    } else {
      setLocalWorkouts((prev) =>
        prev.map((w) => (w.id === workoutId ? { ...w, ...payload } : w)),
      );
    }
  }

  async function removeWorkout(workoutId: string) {
    if (loggedIn) {
      const userWorkout = remoteWorkouts.find(
        (uw) => uw.workout.id === workoutId,
      );
      if (userWorkout) {
        await api.removeUserWorkout(userWorkout.userWorkoutId);
        await reload();
      }
    } else {
      setLocalWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    }
  }

  async function addFromLibrary(workout: Workout) {
    if (loggedIn) {
      await api.addUserWorkout(workout.id);
      await reload();
    } else {
      setLocalWorkouts((prev) =>
        prev.some((w) => w.id === workout.id) ? prev : [...prev, workout],
      );
    }
  }

  async function updateExercise(
    workoutId: string,
    exerciseId: string,
    fields: Partial<Exercise>,
  ) {
    if (loggedIn) {
      const userWorkout = remoteWorkouts.find(
        (uw) => uw.workout.id === workoutId,
      );
      const exercise = userWorkout?.workout.exercises.find(
        (ex) => ex.id === exerciseId,
      );
      if (!exercise?.workoutExerciseId) return;

      // Update otimista: aplica a mudança no estado local imediatamente
      setRemoteWorkouts((prev) =>
        prev.map((uw) =>
          uw.workout.id === workoutId
            ? {
                ...uw,
                workout: {
                  ...uw.workout,
                  exercises: uw.workout.exercises.map((ex) =>
                    ex.id === exerciseId ? { ...ex, ...fields } : ex,
                  ),
                },
              }
            : uw,
        ),
      );

      // Persiste em segundo plano, sem re-buscar tudo
      try {
        await api.customizeExercise(exercise.workoutExerciseId, {
          ...exercise,
          ...fields,
        });
      } catch (err) {
        // se falhar, desfaz o update otimista recarregando do servidor
        await reload();
        throw err;
      }
    } else {
      setLocalWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId
            ? {
                ...w,
                exercises: w.exercises.map((ex) =>
                  ex.id === exerciseId ? { ...ex, ...fields } : ex,
                ),
              }
            : w,
        ),
      );
    }
  }

  async function reorderWorkouts(newOrder: Workout[]) {
    if (loggedIn) {
      const orderedIds = newOrder.map((w) => {
        const uw = remoteWorkouts.find((rw) => rw.workout.id === w.id);
        return uw!.userWorkoutId;
      });

      // aplica local imediatamente
      setRemoteWorkouts((prev) => {
        const map = new Map(prev.map((uw) => [uw.workout.id, uw]));
        return newOrder.map((w) => map.get(w.id)!);
      });

      await api.reorderUserWorkouts(orderedIds);
    } else {
      setLocalWorkouts(newOrder);
    }
  }

  return {
    workouts,
    loading,
    loggedIn,
    addWorkout,
    updateWorkout,
    removeWorkout,
    addFromLibrary,
    updateExercise,
    reorderWorkouts, // novo
    reload,
  };
}
