export type WordType = 'Verb' | 'Noun' | 'Adjective' | 'Adverb' | '';

export interface WordForm {
    word: string;
    exists: boolean;
    type: WordType;
    hints: string;
    group: number;
    infinitive?: string;
    conjugations: string[];
}
