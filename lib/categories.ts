export interface Category {
	id: number;
	name: string;
	description?: string;
}

export const fetchCategorys = async (): Promise<string[]> => {
    try {

        const response = await fetch('/api/categories');
        const dbCategorys = await response.json();
        return dbCategorys;

    } catch (error) {

        console.error('Error fetching categorys:', error);
        return [];
		
    }
};