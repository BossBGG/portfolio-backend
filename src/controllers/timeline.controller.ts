import { supabase } from '../config/supabase';

export const timelineController = {
    getAll: async ({ set }: any) => {
        const { data, error } = await supabase
            .from('timelines')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) {
            set.status = 500;
            throw error;
        }
        return data;
    },

    create: async ({ body, set }: any) => {
        const { data, error } = await supabase.from('timelines').insert(body).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    update: async ({ params , body , set }: any) => {
        const { data, error } = await supabase.from('timelines').update(body).eq('id', params.id).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    delete: async ({ params, set }: any) => {
        const { error } = await supabase.from('timelines').delete().eq('id', params.id);
        if (error) {set.status = 500; throw error;}
        return {success: true, message: 'Deleted'};
    },
};