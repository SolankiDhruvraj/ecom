import { useRef, useCallback } from 'react';

function useThrottle(func, limit) {
    const lastRun = useRef(Date.now());

    return useCallback((...args) => {
        if (Date.now() - lastRun.current >= limit) {
            func(...args);
            lastRun.current = Date.now();
        }
    }, [func, limit]);
}

export default useThrottle;
