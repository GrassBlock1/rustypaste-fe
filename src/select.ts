import SlimSelect from "slim-select";
// @ts-ignore
import 'slim-select/styles';
import languageMap from 'language-map';

type LanguageMeta = {
    extensions?: string[];
    filenames?: string[];
};

function getLanguageValue(language: LanguageMeta): string {
    if (language.extensions && language.extensions.length > 0) {
        return language.extensions[0];
    }

    if (language.filenames && language.filenames.length > 0) {
        return language.filenames[0];
    }

    return "txt";
}

function initDropdown() {
    const allLanguages = languageMap as Record<string, LanguageMeta>;
    const select = document.getElementById('filetype');

    if (!(select instanceof HTMLSelectElement)) {
        return;
    }

    Object.entries(allLanguages).forEach(([languageName, language]) => {
        const option = document.createElement('option');
        option.value = getLanguageValue(language);
        option.textContent = languageName;
        select.appendChild(option);
    });

    new SlimSelect({
        select: '#filetype'
    });
}

initDropdown();
