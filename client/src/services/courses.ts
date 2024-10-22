import api from './api';
import { Course } from '@/types';

export const getCourse = async (courseId: number): Promise<Course> => {
    try {
        const { data } = await api.get<{ course: Course }>(`/courses/${courseId}`);
        return data.course;
    } catch (error) {
        throw error;
    }
};
