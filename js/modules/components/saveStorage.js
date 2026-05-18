function saveStorage(isCorrect, mainquestions, currentQuestion, nameTest) {
  // 1. Находим точный индекс вопроса (от 0 до mainquestions.length - 1)
  const questionIndex = mainquestions.findIndex(q => q.title === currentQuestion.title);
  
  // Если вопрос не найден, метод findIndex вернет -1. Прерываем выполнение.
  if (questionIndex === -1) return;

  // 2. Достаем старую статистику или создаем новую структуру
  let stats = JSON.parse(localStorage.getItem(nameTest));

  if (!stats) {
    // При первом запуске заполняем массив индексами от 0 до длины массива (не включая её)
    const allIndexes = Array.from({ length: mainquestions.length }, (_, i) => i);
    stats = {
      correct: [],      // Список правильных индексов
      incorrect: [],    // Список ошибочных индексов
      neverSeen: allIndexes // Изначально здесь лежат все индексы [0, 1, 2...]
    };
  }

  // 3. Если вопрос попался — удаляем его индекс из списка тех, которые "ни разу не попадались"
  const neverSeenIndex = stats.neverSeen.indexOf(questionIndex);
  if (neverSeenIndex !== -1) {
    stats.neverSeen.splice(neverSeenIndex, 1);
  }

  // 4. Логика взаимного уничтожения правильных и неправильных ответов
  if (isCorrect) {
    // Ищем, был ли этот индекс в ошибках ранее
    const errorIndex = stats.incorrect.indexOf(questionIndex);

    if (errorIndex !== -1) {
      // Убираем одну прошлую ошибку
      stats.incorrect.splice(errorIndex, 1);
    } else {
      // Добавляем в правильные
      stats.correct.push(questionIndex);
    }
  } else {
    // Ищем, был ли этот индекс в правильных ответах ранее
    const successIndex = stats.correct.indexOf(questionIndex);

    if (successIndex !== -1) {
      // Аннулируем один прошлый успех
      stats.correct.splice(successIndex, 1);
    } else {
      // Записываем новую ошибку
      stats.incorrect.push(questionIndex);
    }
  }

  // 5. Сохраняем обновленный объект в LocalStorage
  localStorage.setItem(nameTest, JSON.stringify(stats));
}

export default saveStorage;
