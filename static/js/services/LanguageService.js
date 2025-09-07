import { translations } from './translations.js';

export class LanguageService {
    static getCurrentLanguage() {
        return document.documentElement.lang || 'en';
    }

    static translate(key) {
        return translations[this.getCurrentLanguage()][key];
    }
}