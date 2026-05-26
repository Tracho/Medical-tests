function getStorage(mainQuestions_length, nameStorage) {
  // 1. Пытаемся достать данные из localStorage
  const localData = JSON.parse(localStorage.getItem(nameStorage));

  // 2. Создаем структуру по умолчанию, которая гарантированно содержит ВСЕ ключи
  const defaultStructure = {
    correct: [],
    incorrect: [],
    neverSeen: Array.from({ length: mainQuestions_length }, (_, i) => i),
    saveList: []
  };

  // 3. Если в localStorage вообще ничего нет, возвращаем структуру по умолчанию
  if (!localData) {
    return defaultStructure;
  }

  // 4. УМНОЕ ОБЪЕДИНЕНИЕ: Берем структуру по умолчанию и поверх накладываем localData.
  // Если какого-то ключа (например, saveList) в localData не было, он возьмется из defaultStructure.
  // Все старые данные (correct, incorrect и т.д.) останутся нетронутыми.
  const mergedStorage = { ...defaultStructure, ...localData };

  return mergedStorage;
}

export default getStorage;
