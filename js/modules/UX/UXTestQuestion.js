function UXTestQuestion(containerElement, currentQuestion, onNextQuestion) {
  const btnConfirm = containerElement.querySelector("#btnConfirmAnswer");
  const btnNext = containerElement.querySelector("#btnNextQuestion");
  const confirmBlock = containerElement.querySelector("#confirmBlock");
  const answerBlock = containerElement.querySelector("#correctAnswerBlock");
  const nextBlock = containerElement.querySelector("#nextQuestionBlock");
  const checkboxes = containerElement.querySelectorAll(".btn-check");

  // Переменная для хранения итогового результата по этому вопросу
  let isCurrentQuestionCorrect = true;

  btnConfirm.addEventListener("click", () => {
    const userAnswers = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        userAnswers.push(checkbox.value.trim());
      }
    });

    if (userAnswers.length === 0) {
      alert("Пожалуйста, выберите хотя бы один вариант ответа.");
      return;
    }

    // Чистая эталонная строка из JSON (убираем пробелы по краям)
    const cleanCorrectString = currentQuestion.correctAnswer.trim();
    
    // Массив ответов, если в вопросе всё же заложено несколько вариантов через запятую
    const correctAnswersArray = currentQuestion.correctAnswer
      .split(",")
      .map(item => item.trim());

    let hasAllCorrect = false;

    // СНАЧАЛА ПРОВЕРЯЕМ СТРОКУ: Если выбран ровно 1 ответ и он строго равен correctAnswer
    if (userAnswers.length === 1 && userAnswers[0] === cleanCorrectString) {
      hasAllCorrect = true;
    } else {
      // ЕСЛИ НЕ СОВПАЛО ИЛИ ВЫБРАНО НЕСКОЛЬКО: Включаем логику проверки массива, как было раньше
      hasAllCorrect = userAnswers.length === correctAnswersArray.length &&
                     userAnswers.every(ans => correctAnswersArray.includes(ans));
    }

    if (!hasAllCorrect) {
      isCurrentQuestionCorrect = false;
    }

    // Подсветка карточек
    checkboxes.forEach(checkbox => {
      const label = containerElement.querySelector(`label[for="${checkbox.id}"]`);
      const optionValue = checkbox.value.trim();

      // Определяем, является ли данный конкретный вариант правильным (по строке или в массиве)
      const isThisOptionCorrect = optionValue === cleanCorrectString || correctAnswersArray.includes(optionValue);

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

    confirmBlock.classList.add("d-none");
    answerBlock.classList.remove("d-none");
    nextBlock.classList.remove("d-none");
  });

  btnNext.addEventListener("click", () => {
    if (typeof onNextQuestion === "function") {
      onNextQuestion(isCurrentQuestionCorrect);
    }
  });
}

export default UXTestQuestion;
