import { useState, useEffect } from "react";
import { Category } from "../types";
import { api } from "../services/api";

let cachedCategories: Category[] | null = null;
const listeners: Array<(cats: Category[]) => void> = [];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const listener = (newCats: Category[]) => {
      if (isMounted) setCategories(newCats);
    };
    listeners.push(listener);

    const load = async () => {
      try {
        const data = await api.categories.getAll();
        cachedCategories = data;
        if (isMounted) {
          setCategories(data);
          setError(null);
        }
        listeners.forEach((l) => l(data));
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load categories");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!cachedCategories) {
      load();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const data = await api.categories.getAll();
      cachedCategories = data;
      setCategories(data);
      listeners.forEach((l) => l(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { categories, isLoading, error, refetch };
}
