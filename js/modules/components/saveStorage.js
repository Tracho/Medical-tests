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

  // 3. Если вопрос попался в первый раз — навсегда удаляем его из "не пройденных"
  const neverSeenIndex = stats.neverSeen.indexOf(questionIndex);
  if (neverSeenIndex !== -1) {
    stats.neverSeen.splice(neverSeenIndex, 1);
  }

  // 4. Логика накопления дубликатов ошибок и перемещения в правильные
  if (isCorrect) {
    // Ищем, был ли этот индекс в ошибках ранее
    const errorIndex = stats.incorrect.indexOf(questionIndex);

    if (errorIndex !== -1) {
      // Убираем только ОДНУ прошлую ошибку из массива (минусуем 1 повтор)
      stats.incorrect.splice(errorIndex, 1);
      
      // ИСПРАВЛЕНО: Если после этого ответа ошибок с таким индексом БОЛЬШЕ НЕ ОСТАЛОСЬ,
      // мы переносим вопрос в категорию "правильные" (в neverSeen он больше не возвращается!)
      if (!stats.incorrect.includes(questionIndex)) {
        if (!stats.correct.includes(questionIndex)) {
          stats.correct.push(questionIndex);
        }
      }
    } else {
      // Если ошибок и так не было, просто подтверждаем нахождение в правильных
      if (!stats.correct.includes(questionIndex)) {
        stats.correct.push(questionIndex);
      }
    }
  } else {
    // Если ответил НЕПРАВИЛЬНО, ищем его в правильных
    const successIndex = stats.correct.indexOf(questionIndex);

    if (successIndex !== -1) {
      // ИСПРАВЛЕНО: Аннулируем чистый успех, убирая его из правильных
      stats.correct.splice(successIndex, 1);
      
      // ИСПРАВЛЕНО: Так как вопрос мы уже видели, он сразу падает в ошибки (incorrect), а не в neverSeen
      stats.incorrect.push(questionIndex);
    } else {
      // Если в правильных его не было — просто добавляем еще один дубликат ошибки
      stats.incorrect.push(questionIndex);
    }
  }

  // Сортируем массив непрочитанных по порядку (для оставшихся новых вопросов)
  stats.neverSeen.sort((a, b) => a - b);

  // 5. Сохраняем обновленный объект в LocalStorage
  localStorage.setItem(nameStorage, JSON.stringify(stats));
}

export default saveStorage;
