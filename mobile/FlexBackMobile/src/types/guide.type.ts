export interface GuideItem {
    id: number;
    name: string;
    description: string;
    category: 'EXERCISE' | 'MEDICINE' | 'FOOD' | 'KNOWLEDGE';
}
