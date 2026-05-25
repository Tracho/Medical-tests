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
      neverSeen: allIndexes, // Изначально здесь лежат все индексы [0, 1, 2...]
      saveList: [],
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
      
      // ИСПРАВЛЕНО: возвращаем вопрос в neverSeen, если его там еще нет
      if (!stats.neverSeen.includes(questionIndex)) {
        stats.neverSeen.push(questionIndex);
      }
    } else {
      // Если в ошибках не было — просто добавляем в правильные
      if (!stats.correct.includes(questionIndex)) {
        stats.correct.push(questionIndex);
      }
    }
  } else {
    // Ищем, был ли этот индекс в правильных ответах ранее
    const successIndex = stats.correct.indexOf(questionIndex);

    if (successIndex !== -1) {
      // Аннулируем один прошлый успех
      stats.correct.splice(successIndex, 1);
      
      // ИСПРАВЛЕНО: возвращаем вопрос в neverSeen, если его там еще нет
      if (!stats.neverSeen.includes(questionIndex)) {
        stats.neverSeen.push(questionIndex);
      }
    } else {
      // Если в правильных не было — записываем новую ошибку
      if (!stats.incorrect.includes(questionIndex)) {
        stats.incorrect.push(questionIndex);
      }
    }
  }

  // Опционально: сортируем массив neverSeen по возрастанию, чтобы индексы шли по порядку [0, 1, 2...]
  stats.neverSeen.sort((a, b) => a - b);

  // 5. Сохраняем обновленный объект в LocalStorage
  localStorage.setItem(nameTest, JSON.stringify(stats));
}

export default saveStorage;
