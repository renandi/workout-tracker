import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";
import { api } from "../services/api";
import type { Workout } from "../types/workout";
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
    fields: Partial<Workout["exercises"][number]>,
  ) {
    const workout = workouts.find((w) => w.id === workoutId);
    if (!workout) return;
    const updatedExercises = workout.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, ...fields } : ex,
    );
    await updateWorkout(workoutId, {
      title: workout.title,
      type: workout.type,
      exercises: updatedExercises,
    });
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
    reload,
  };
}
