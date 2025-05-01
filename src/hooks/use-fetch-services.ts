// src/hooks/use-fetch-services.ts
'use client';

import { useState, useEffect } from 'react';
import { getServices, type Service } from '@/lib/services';
import { useI18n } from '@/locales/client';

export function useFetchServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useI18n(); // Get translation hook here for error messages

    useEffect(() => {
        const loadServices = async () => {
            setIsLoading(true); // Ensure loading state is true when fetching
            try {
                const fetchedServices = await getServices(); // Call the API function
                setServices(fetchedServices);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError(t('admin_service.fetch_error_desc')); // Use translated error message
            } finally {
                setIsLoading(false); // Set loading to false after fetching (or error)
            }
        };

        loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]); // Add t to dependency array

    return { services, isLoading, error };
}
