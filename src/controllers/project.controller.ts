// src/controllers/project.controller.ts
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
        try {
            // Validate required fields only
            if (!body.title || !body.image_url) {
                set.status = 400;
                return {
                    error: 'Validation failed',
                    message: 'Title and image_url are required',
                    missing: [
                        !body.title && 'title',
                        !body.image_url && 'image_url'
                    ].filter(Boolean)
                };
            }

            // Prepare data - only include fields that are provided
            const projectData: any = {
                title: body.title,
                image_url: body.image_url,
                list_detail: body.list_detail || [],
                tools: body.tools || []
            };

            // Add optional fields only if provided
            if (body.subtitle !== undefined && body.subtitle !== null && body.subtitle !== '') {
                projectData.subtitle = body.subtitle;
            }
            
            if (body.image_label !== undefined && body.image_label !== null && body.image_label !== '') {
                projectData.image_label = body.image_label;
            }
            
            if (body.github_url !== undefined && body.github_url !== null && body.github_url !== '') {
                projectData.github_url = body.github_url;
            }

            const { data, error } = await supabase
                .from('projects')
                .insert(projectData)
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                set.status = 400;
                return { 
                    error: 'Database error',
                    message: error.message,
                    details: error.details 
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Create project error:', error);
            set.status = 500;
            return { 
                error: 'Internal server error',
                message: String(error)
            };
        }
    },

    // แก้ไข (Admin)
    update: async ({ params, body, set }: any) => {
        try {
            // Prepare update data (exclude undefined fields)
            const updateData: any = {};
            if (body.title !== undefined) updateData.title = body.title;
            if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
            if (body.list_detail !== undefined) updateData.list_detail = body.list_detail;
            if (body.tools !== undefined) updateData.tools = body.tools;
            if (body.image_url !== undefined) updateData.image_url = body.image_url;
            if (body.image_label !== undefined) updateData.image_label = body.image_label;
            if (body.github_url !== undefined) updateData.github_url = body.github_url;

            const { data, error } = await supabase
                .from('projects')
                .update(updateData)
                .eq('id', params.id)
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                set.status = 400;
                return { 
                    error: 'Database error',
                    message: error.message 
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Update project error:', error);
            set.status = 500;
            return { 
                error: 'Internal server error',
                message: String(error)
            };
        }
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