function UXTestQuestion(containerElement, currentQuestion, mainquestions, nameTest, onNextQuestion) {
  const btnConfirm = containerElement.querySelector("#btnConfirmAnswer");
  const btnNext = containerElement.querySelector("#btnNextQuestion");
  const confirmBlock = containerElement.querySelector("#confirmBlock");
  const answerBlock = containerElement.querySelector("#correctAnswerBlock");
  const nextBlock = containerElement.querySelector("#nextQuestionBlock");
  const checkboxes = containerElement.querySelectorAll(".btn-check");

  // Переменная для хранения итогового результата по этому вопросу
  let isCurrentQuestionCorrect = true;

  btnConfirm.addEventListener("click", () => {
    // 1. Проверяем, выбрал ли пользователь хоть что-то
    const hasAnySelection = Array.from(checkboxes).some(cb => cb.checked);

    if (!hasAnySelection) {
      alert("Пожалуйста, выберите хотя бы один вариант ответа.");
      return;
    }

    // 2. ИЗМЕНЕННАЯ МАТЕМАТИЧЕСКАЯ ПРОВЕРКА (По тексту ответов)
    // Ищем хотя бы одну ошибку, сравнивая состояние чекбокса с его реальным флагом в JSON
    const isUserWrong = Array.from(checkboxes).some((checkbox) => {
      // Ищем в исходном JSON объект ответа, у которого текст совпадает с value чекбокса
      const originalOption = currentQuestion.options.find(
        opt => opt.text.trim() === checkbox.value.trim()
      );

      // Если вдруг объект не найден (защита от сбоев), пропускаем
      if (!originalOption) return false;

      const isCorrectOption = originalOption.isCorrect;
      
      // Строгое сравнение: выбран ли чекбокс там, где должен, и наоборот
      return checkbox.checked !== isCorrectOption;
    });

    if (isUserWrong) {
      isCurrentQuestionCorrect = false;
    }

    // 3. Раскрашиваем карточки на основе реальных флагов isCorrect
    checkboxes.forEach((checkbox) => {
      const label = containerElement.querySelector(`label[for="${checkbox.id}"]`);
      
      // Снова находим эталонный объект ответа в JSON по тексту
      const originalOption = currentQuestion.options.find(
        opt => opt.text.trim() === checkbox.value.trim()
      );
      
      const isThisOptionCorrect = originalOption ? originalOption.isCorrect : false;

      if (checkbox.checked) {
        if (isThisOptionCorrect) {
          label.classList.remove("btn-outline-secondary", "bgprim");
          label.classList.add("btn-success", "text-white", "pe-none");
        } else {
          label.classList.remove("btn-outline-secondary", "bgprim");
          label.classList.add("btn-danger", "text-white", "pe-none");
        }
      } else {
        if (isThisOptionCorrect) {
          label.classList.remove("btn-outline-secondary", "bgprim");
          label.classList.add("border-success", "text-success", "fw-bold", "bg-transparent", "pe-none");
        } else {
          label.classList.remove("btn-outline-secondary", "bgprim");
          label.classList.add("border-danger", "text-danger", "fw-bold", "bg-transparent", "pe-none");
        }
      }
    });

    // 4. Переключаем видимость блоков управления и сохраняем статистику
    confirmBlock.classList.add("d-none");
    answerBlock.classList.remove("d-none");
    nextBlock.classList.remove("d-none");
    
    saveStorage(isCurrentQuestionCorrect, mainquestions, currentQuestion, nameTest);
  });

  btnNext.addEventListener("click", () => {
    if (typeof onNextQuestion === "function") {
      onNextQuestion(isCurrentQuestionCorrect);
    }
  });
}

export default UXTestQuestion;
