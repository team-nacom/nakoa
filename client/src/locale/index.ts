import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import messageEn from './en.json';
import messageKo from './ko.json';

const defaultLng = 'ko';

i18n.use(initReactI18next)
    .init({
        resources: {
            'en': {
                info: { name: 'English' },
                translation: messageEn
            },
            'ko': {
                info: { name: '한국어' },
                translation: messageKo
            },
        },
        lng: defaultLng, // TODO: make language setting persist
        fallbackLng: defaultLng,
    })

export default i18n;