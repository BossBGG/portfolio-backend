import { supabase } from '../config/supabase';

export const projectController = {
    // ดึงข้อมูลโปรเจกต์ทั้งหมด (Public)
    getAll: async ({ set }: any) => {
        const { data , error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', {ascending: false});

        if (error) {
            set.status = 500;
            throw error;
        }
        return data;
    },

    // ดึงรายตัว (Public)
    getById: async ({ params , set }: any) => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', params.id)
            .single();
        
        if (error) {
            set.status = 404;
            throw new Error('Project not found');
        }

        return data
    },

    // สร้างโปรเจกต์ใหม่ (Admin)
    create: async ({ body, set }: any) => {
        const { data, error } = await supabase
            .from('projects')
            .insert(body)
            .select()
            .single();

        if (error) {
            set.status = 400;
            throw error;
        }
        return { success: true, data };
    },

    // แก้ไข (Admin)
    update: async ({ params ,body, set }: any) => {
        const { data, error } = await supabase
            .from('projects')
            .update(body)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            set.status = 400;
            throw error;
        }
        return { success: true, data };
    },

    // ลบ (Admin)
    delete: async ({ params, set }: any) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', params.id);
        
        if (error) {
            set.status = 500;
            throw error;
        }
        return { success: true, message: 'Project deleted'};
    }
};