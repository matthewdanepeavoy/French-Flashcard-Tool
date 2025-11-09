export type WordType = 'verb' | 'noun' | 'pronoun' | 'article' | 'adjective' | 'adverb' | '';

export interface WordForm {
    word: string;
    id: number;
    exists: boolean;
    type: WordType;
    definition: string;
    feminine_form: string;
    masculine_form: string;
    contracted_form: string;
    hints: string;
    group: number;
    infinitive?: string;
    conjugations: string[];
}

export const contractionsMap = {
    "j'": 'je',
    "l'": 'le',
    "m'": 'me',
    "t'": 'te',
    "s'": 'se',
    "d'": 'de',
    "c'": 'ce',
    "n'": 'ne',
    "qu'": 'que',
    "jusqu'": 'jusque',
    "lorsqu'": 'lorsque',
    "puisqu'": 'puisque',
};

export const pronouns = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
