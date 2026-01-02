// src/controllers/timeline.controller.ts
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
        try {
            // Validate required fields only
            if (!body.title || !body.start_date) {
                set.status = 400;
                return {
                    error: 'Validation failed',
                    message: 'Title and start_date are required',
                    missing: [
                        !body.title && 'title',
                        !body.start_date && 'start_date'
                    ].filter(Boolean)
                };
            }

            // Prepare data - only include fields that are provided
            const timelineData: any = {
                title: body.title,
                start_date: body.start_date,
                list_detail: body.list_detail || [],
                tools: body.tools || []
            };

            // Add optional fields only if provided
            if (body.subtitle !== undefined && body.subtitle !== null && body.subtitle !== '') {
                timelineData.subtitle = body.subtitle;
            }
            
            if (body.end_date !== undefined && body.end_date !== null && body.end_date !== '') {
                timelineData.end_date = body.end_date;
            }
            
            if (body.github_url !== undefined && body.github_url !== null && body.github_url !== '') {
                timelineData.github_url = body.github_url;
            }

            const { data, error } = await supabase
                .from('timelines')
                .insert(timelineData)
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
            console.error('Create timeline error:', error);
            set.status = 500;
            return { 
                error: 'Internal server error',
                message: String(error)
            };
        }
    },

    update: async ({ params, body, set }: any) => {
        try {
            // Prepare update data (exclude undefined fields)
            const updateData: any = {};
            
            if (body.title !== undefined) updateData.title = body.title;
            if (body.start_date !== undefined) updateData.start_date = body.start_date;
            if (body.list_detail !== undefined) updateData.list_detail = body.list_detail;
            if (body.tools !== undefined) updateData.tools = body.tools;
            
            // Optional fields - only update if provided and not empty
            if (body.subtitle !== undefined && body.subtitle !== '') {
                updateData.subtitle = body.subtitle;
            }
            if (body.end_date !== undefined && body.end_date !== '') {
                updateData.end_date = body.end_date;
            }
            if (body.github_url !== undefined && body.github_url !== '') {
                updateData.github_url = body.github_url;
            }

            const { data, error } = await supabase
                .from('timelines')
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
            console.error('Update timeline error:', error);
            set.status = 500;
            return { 
                error: 'Internal server error',
                message: String(error)
            };
        }
    },

    delete: async ({ params, set }: any) => {
        const { error } = await supabase.from('timelines').delete().eq('id', params.id);
        if (error) { set.status = 500; throw error; }
        return { success: true, message: 'Deleted' };
    },
};