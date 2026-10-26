/** Fold transliteration accents and optional Arabic vowel marks for forgiving search. */
export function normalizeSearch(value:string) {return value.normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').toLocaleLowerCase('id-ID').trim()}
