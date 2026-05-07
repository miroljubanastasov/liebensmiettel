import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
    user: null,
    session: null,
    profile: null,
    household: null,
    pendingInvites: [],
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

    /** Fetch pending invitations addressed to current user's email */
    loadPendingInvites: async () => {
        const email = get().user?.email
        if (!email) { set({ pendingInvites: [] }); return }
        const { data } = await supabase
            .from('household_invites')
            .select('*, households(name)')
            .eq('email', email)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
        set({ pendingInvites: data ?? [] })
    },

    init: async () => {
        if (get()._initialized) return
        set({ _initialized: true })

        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null
        set({ session, user, loading: false })
        if (user) {
            await get()._loadProfile(user.id)
            get().loadPendingInvites()
        }

        supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null
            set({ session, user })
            if (user) {
                get()._loadProfile(user.id).then(() => get().loadPendingInvites())
            } else {
                set({ profile: null, household: null, pendingInvites: [] })
            }
        })
    },

    /** Reload profile + household + pending invites (call after mutations) */
    refreshProfile: async () => {
        const uid = get().user?.id
        if (!uid) return
        await get()._loadProfile(uid)
        await get().loadPendingInvites()
    },

    /**
     * Accept an invite. Updates the invite status, switches the user's
     * household_id, and auto-declines any other pending invites for this user
     * (a user can belong to only one household at a time).
     */
    acceptInvite: async (invite) => {
        const uid = get().user?.id
        if (!uid || !invite?.id || !invite?.household_id) return { error: 'invalid' }

        const { error: e1 } = await supabase
            .from('household_invites')
            .update({ status: 'accepted' })
            .eq('id', invite.id)
        if (e1) return { error: e1 }

        const { error: e2 } = await supabase
            .from('profiles')
            .update({ household_id: invite.household_id })
            .eq('id', uid)
        if (e2) return { error: e2 }

        // Auto-decline any other pending invites for this user
        const otherIds = get().pendingInvites
            .filter((i) => i.id !== invite.id)
            .map((i) => i.id)
        if (otherIds.length > 0) {
            await supabase
                .from('household_invites')
                .update({ status: 'declined' })
                .in('id', otherIds)
        }

        await get().refreshProfile()
        return { error: null }
    },

    /** Decline an invite */
    declineInvite: async (invite) => {
        if (!invite?.id) return { error: 'invalid' }
        const { error } = await supabase
            .from('household_invites')
            .update({ status: 'declined' })
            .eq('id', invite.id)
        await get().loadPendingInvites()
        return { error }
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, profile: null, household: null, pendingInvites: [] })
    },
}))
