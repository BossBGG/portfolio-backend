import { supabase } from '../config/supabase';

export const techController = {
    getAll: async ({ set }: any) => {
        const { data, error } = await supabase
            .from('tech_stacks')
            .select('*')
            .order('created_at');

        if (error) {
            set.status = 500;
            throw error;
        }
        return data;
    },

    create: async ({ body, set }: any) => {
        const { data, error } = await supabase.from('tech_stacks').insert(body).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    update: async ({ params , body , set }: any) => {
        const { data, error } = await supabase.from('tech_stacks').update(body).eq('id', params.id).select().single();
        if (error) {set.status = 400; throw error;}
        return {success: true, data};
    },

    delete: async ({ params, set }: any) => {
        const { error } = await supabase.from('tech_stacks').delete().eq('id', params.id);
        if (error) {set.status = 500; throw error;}
        return {success: true, message: 'Deleted'};
    },
};