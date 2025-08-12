export type WordType = 'Verb' | 'Noun' | 'Adjective' | 'Adverb' | '';

export interface WordForm {
    word: string;
    exists: boolean;
    type: WordType;
    hints: string;
    infinitive?: string;
    conjugations: string[];
}
