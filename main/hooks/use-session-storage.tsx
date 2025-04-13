'use client'

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = Cookies.get('speech-ease-auth');
      return item
    } catch (error) {
      console.error('Erro ao acessar o localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      Cookies.set('speech-ease-auth', value, { expires: 7 });
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;