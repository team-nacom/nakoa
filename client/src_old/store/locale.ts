import { localStorageKeys } from "../etc/consts";

const SET_LOCALE = 'SET_LOCALE' as const;

export const localeList = ['en', 'ko'] as const;
export const localeName = {
  'en': 'English',
  'ko': '한국어'
} as const;

type Locale = typeof localeList[number];

const isValidLocale = (locale: any) : locale is Locale => (
  typeof locale === 'string' && localeList.find((x) => x === locale) !== undefined
);

export const setLocale = (locale: Locale) => {
  return {
    type: SET_LOCALE,
    locale,
  };
};

export type LocaleAction = 
  | ReturnType<typeof setLocale>
;

interface LocaleState {
  locale: Locale;
};

const lsLocale = localStorage.getItem(localStorageKeys.locale);

const initialState : LocaleState = {
  locale: isValidLocale(lsLocale) ? lsLocale : 'ko'
};

export default function locale(state = initialState, action : LocaleAction) {
  switch (action.type) {
    case SET_LOCALE:
      localStorage.setItem(localStorageKeys.locale, action.locale);

      return {
        ...state,
        locale: action.locale,
      };
    default:
      return state;
  }
}
