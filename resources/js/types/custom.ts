export type WordType = 'verb' | 'noun' | 'pronoun' | 'article' | 'adjective' | 'adverb' | '';

export interface WordForm {
    word: string;
    id: number;
    exists: boolean;
    type: WordType;
    definition: string;
    feminine_form: string;
    contracted_form: string;
    hints: string;
    group: number;
    infinitive?: string;
    conjugations: string[];
}
