import { Category } from '../types/types';


const baseUrl = 'http://localhost:3000/category';

/**
 * Holt alle Kategorien aus dem Backend.
 */
export async function getAllCategories(): Promise<Category[] | undefined> {
    const response = await fetch(baseUrl, {
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        console.error('Error while fetching categories', response.status);
        return undefined;
    }
    // Die API liefert { message: string; data: Category[] }
    const payload = (await response.json()) as { message: string; data: Category[] };
    return payload.data;
}
