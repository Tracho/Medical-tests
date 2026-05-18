import saveStorage from "../components/saveStorage.js";

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

    // 2. Проверяем, совершил ли пользователь ошибки
    // Вопрос отвечен верно, ТОЛЬКО если ВСЕ нажатые чекбоксы были правильными,
    // и ВСЕ ненажатые чекбоксы были ложными.
    const isUserWrong = Array.from(checkboxes).some((checkbox, index) => {
      const isCorrectOption = currentQuestion.options[index].isCorrect;
      return checkbox.checked !== isCorrectOption;
    });
    console.log(currentQuestion)
    if (isUserWrong) {
      isCurrentQuestionCorrect = false;
    }

    // 3. Раскрашиваем карточки на основе реальных флагов isCorrect
    checkboxes.forEach((checkbox, index) => {
      const label = containerElement.querySelector(`label[for="${checkbox.id}"]`);
      const isThisOptionCorrect = currentQuestion.options[index].isCorrect;

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

    // 4. Переключаем видимость блоков управления
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
