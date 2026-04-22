import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
    user: null,
    session: null,
    profile: null,
    household: null,
    loading: true,
    _initialized: false,

    /** Fetch profile + household for current user */
    _loadProfile: async (uid) => {
        if (!uid) { set({ profile: null, household: null }); return }
        const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', uid).single()
        set({ profile: profile ?? null })

        if (profile?.household_id) {
            const { data: household } = await supabase
                .from('households').select('*').eq('id', profile.household_id).single()
            set({ household: household ?? null })
        } else {
            set({ household: null })
        }
    },

    init: async () => {
        if (get()._initialized) return
        set({ _initialized: true })

        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null
        set({ session, user, loading: false })
        if (user) get()._loadProfile(user.id)

        supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null
            set({ session, user })
            get()._loadProfile(user?.id)
        })
    },

    /** Reload profile + household (call after mutations) */
    refreshProfile: () => {
        const uid = get().user?.id
        if (uid) get()._loadProfile(uid)
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, profile: null, household: null })
    },
}))
