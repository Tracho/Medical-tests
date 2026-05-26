function saveStorage(isCorrect, mainquestions, currentQuestion, nameStorage) {
  // 1. Находим точный индекс вопроса (от 0 до mainquestions.length - 1)
  const questionIndex = mainquestions.findIndex(q => q.title === currentQuestion.title);
 
  // Если вопрос не найден, прерываем выполнение.
  if (questionIndex === -1) return;

  // 2. Достаем старую статистику или создаем новую структуру
  let stats = JSON.parse(localStorage.getItem(nameStorage));

  if (!stats) {
    const allIndexes = Array.from({ length: mainquestions.length }, (_, i) => i);
    stats = {
      correct: [],      
      incorrect: [],    
      neverSeen: allIndexes, 
      saveList: [],
    };
  }

  // 3. Сначала удаляем вопрос из neverSeen, так как с ним совершили действие
  const neverSeenIndex = stats.neverSeen.indexOf(questionIndex);
  if (neverSeenIndex !== -1) {
    stats.neverSeen.splice(neverSeenIndex, 1);
  }

  // 4. Логика накопления дубликатов и взаимного уничтожения
  if (isCorrect) {
    // Ищем, был ли этот индекс в ошибках ранее
    const errorIndex = stats.incorrect.indexOf(questionIndex);

    if (errorIndex !== -1) {
      // ИСПРАВЛЕНО: Убираем только ОДНУ прошлую ошибку из массива (минусуем 1 повтор)
      stats.incorrect.splice(errorIndex, 1);
      
      // ИСПРАВЛЕНО: Если после удаления этой ошибки вопросов с таким индексом в incorrect БОЛЬШЕ НЕ ОСТАЛОСЬ,
      // и его нет в правильных, возвращаем его в neverSeen
      if (!stats.incorrect.includes(questionIndex) && !stats.correct.includes(questionIndex) && !stats.neverSeen.includes(questionIndex)) {
        stats.neverSeen.push(questionIndex);
      }
    } else {
      // Если ошибок не было, добавляем в правильные (без дубликатов для прогресса)
      if (!stats.correct.includes(questionIndex)) {
        stats.correct.push(questionIndex);
      }
    }
  } else {
    // Если ответил НЕПРАВИЛЬНО, ищем его в правильных
    const successIndex = stats.correct.indexOf(questionIndex);

    if (successIndex !== -1) {
      // Аннулируем чистый успех, если он был
      stats.correct.splice(successIndex, 1);
      
      // Возвращаем в neverSeen, так как теперь он не "чистый"
      if (!stats.neverSeen.includes(questionIndex)) {
        stats.neverSeen.push(questionIndex);
      }
    } else {
      // ИСПРАВЛЕНО: Убрана проверка .includes()! Теперь индекс ошибки свободно дублируется [2, 2, 2...]
      stats.incorrect.push(questionIndex);
    }
  }

  // Сортируем массив непрочитанных по порядку
  stats.neverSeen.sort((a, b) => a - b);

  // 5. Сохраняем обновленный объект в LocalStorage
  localStorage.setItem(nameStorage, JSON.stringify(stats));
}

export default saveStorage;
