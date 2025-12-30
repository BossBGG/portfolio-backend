import { supabase } from '../config/supabase';

export const infoController = {
    getAbout: async ({ set }: any) => {

        const { data, error} = await supabase.from('about_me').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') { set.status = 500; throw error; }
        return data || {};
    },

    upsertAbout: async ({ body, set }: any) => {
        const { data: existing } = await supabase.from('about_me').select('id').limit(1).single();

        let result;
        if (existing) {
            result = await supabase.from('about_me').update(body).eq('id', existing.id).select().single();
        } else {
            result = await supabase.from('about_me').insert(body).select().single();
        }

        if (result.error) { set.status = 400; throw result.error;}
        return { success: true, data: result.data }
    },

    getContact: async ({ set }: any) => {
        const { data, error } = await supabase.from('contacts').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') { set.status = 500; throw error; }
        return data || {};
    },

    upsertContact: async ({ body, set }: any) => {
        const { data: existing } = await supabase.from('contacts').select('id').limit(1).single();

        let result;
        if (existing) {
            result = await supabase.from('contacts').update(body).eq('id', existing.id).select().single();
        } else {
            result = await supabase.from('contacts').insert(body).select().single();
        }

        if (result.error) { set.status = 400; throw result.error;}
        return { success: true, data: result.data }
    },
};