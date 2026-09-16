import { auth } from "$lib/store/auth.svelte"
import { createQuery } from "@tanstack/svelte-query"

export const useCurrentUser = () => {
    return createQuery(() => ({
        queryKey: ['currentUser'],
        queryFn: () => (console.log("query")),
        enabled: auth.isAuthenticated,
        staleTime: 1000 * 60 * 360
    }))
}
