import { MainStore } from '@/modules/type.ts';
import { createContext } from 'preact';

export const Store = createContext<MainStore>({});
