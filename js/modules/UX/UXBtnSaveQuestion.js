function UXBtnSaveQuestion(currentQuestion, mainQuestions, nameStorage,stats) {
  const UIBtnSaveStorage = document.querySelector("#UIBtnSaveStorage");
  if (!UIBtnSaveStorage) return;

  UIBtnSaveStorage.addEventListener("click", () => {
    const questionIndex = mainQuestions.findIndex(q => q.title === currentQuestion.title);

    if (questionIndex === -1) {
      console.error("Вопрос не найден в основном массиве.");
      return;
    } 

    // 2. ЗАЩИТА: Если у пользователя старый сторадж без saveList, создаем его на лету
    if (!stats.saveList) {
      stats.saveList = [];
    }

    // 3. Проверяем дубликаты и сохраняем
    if (!stats.saveList.includes(questionIndex)) {
      stats.saveList.push(questionIndex); 

      // Сохраняем обратно по правильному nameStorage ключу
      localStorage.setItem(nameStorage, JSON.stringify(stats));
      console.log(`⭐ Вопрос №${questionIndex} успешно добавлен в закладки!`);
    } else {
      console.log(`ℹ️ Вопрос №${questionIndex} уже есть в закладках.`);
    }
    UIBtnSaveStorage.disabled = true;
  });
}

export default UXBtnSaveQuestion;
