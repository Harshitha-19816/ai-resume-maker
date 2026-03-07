"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAutosave<T>(
    data: T,
    onSave: (data: T) => Promise<void>,
    delay: number = 2000
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);
    const isSaving = useRef(false);

    const save = useCallback(
        async (dataToSave: T) => {
            if (isSaving.current) return;
            isSaving.current = true;
            try {
                await onSave(dataToSave);
            } catch (error) {
                console.error("Autosave failed:", error);
            } finally {
                isSaving.current = false;
            }
        },
        [onSave]
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            save(data);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, save]);
}
