import { supabase } from '../config/supabase';

export const eventController = {
    getAll: async ({ set }: any) => {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            set.status = 500;
            throw error;
        }
        return data;
    },

    create: async ({ body, set }: any) => {
        const { data, error } = await supabase.from('events').insert(body).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    update: async ({ params , body , set }: any) => {
        const { data, error } = await supabase.from('events').update(body).eq('id', params.id).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    delete: async ({ params, set }: any) => {
        const { error } = await supabase.from('events').delete().eq('id', params.id);
        if (error) {set.status = 500; throw error;}
        return {success: true, message: 'Deleted'};
    },
};