import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { localStorageKeys } from "#/config/consts";

export const localeList = ['en', 'ko'] as const;
export const localeName = {
  'en': 'English',
  'ko': '한국어'
} as const;

type Locale = typeof localeList[number];

const isValidLocale = (locale: string) : locale is Locale => (
  localeList.find((x) => x === locale) !== undefined
);

interface LocaleState{
  locale: Locale,
  setLocale: (locale: string) => void
}

export const useLocale = create<LocaleState>()(
  persist(
    immer(
      (set, get) => ({
        locale: 'ko', //initial locale set to ko.
        setLocale: (locale) => {
          set(( state )=>{
            state.locale = isValidLocale(locale) ? locale : 'ko';
          })
        }
      })
    ),
    {
      name: localStorageKeys.locale,
      getStorage: () => localStorage
    }
  )
)