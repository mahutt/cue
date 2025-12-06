import { isNumber } from 'jet-validators';

export function extractDepartmentAndNumber(courseCode: string): {
    department: string;
    number: number;
} | null {
    const match = courseCode.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return null;
    const department = match[1];
    const number = Number(match[2]);
    if (!isNumber(number)) return null;
    return { department, number };
}
