import UInumberInputQuestions from "./UI/UInumberInputQuestions.js";
import UIresultСounter from "./UI/UIresultСounter.js";
import UITestQuestion from "./UI/UITestQuestion.js";
import UIPagination from "./UI/UIPagination.js";  
import UXnumberInputQuestions from "./UX/UXnumberInputQuestions.js";
import UXTestQuestion from "./UX/UXTestQuestion.js";
import UXPagination from "./UX/UXPagination.js";  

function PlayTest(questions) {
  let divResults = document.querySelector("#results");
  const btnPlayTest = document.querySelector("#btnPlayTest");

  let currentIndex = 0;
  let correctCount = 0;
  let wrongCount = 0;

  // Массив истории ответов: [null, null, null...] по длине JSON
  let answersHistory = new Array(questions.length).fill(null);

  btnPlayTest.addEventListener("click", () => { createHUD() });

  function createHUD() {
    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
      divResults.innerHTML = `
        <div class="alert alert-success text-center p-4 w-100 bg-dark text-light border border-secondary shadow-sm">
          <h4 class="fw-bold mb-3">🎉 Тест завершен!</h4>
          <p class="mb-1">Правильных ответов: <strong class="text-success">${correctCount}</strong></p>
          <p class="mb-0">Неправильных ответов: <strong class="text-danger">${wrongCount}</strong></p>
        </div>
      `;
      return;
    }

    divResults.innerHTML = '';

    // 1. Рендерим HTML (Включая пагинацию)
    divResults.insertAdjacentHTML("beforeend", `
      <div class="d-flex flex-wrap align-items-start gap-3 w-100 bg-dark p-3 text-light">
 
        ${UIresultСounter(correctCount, wrongCount)}  
        ${UITestQuestion(currentQuestion)}
        <div class="w-100 d-flex justify-content-center align-items-center">${UInumberInputQuestions(currentIndex, questions.length)}</div>
        ${UIPagination(questions.length, currentIndex, answersHistory)} <!-- 👈 Вставили пагинацию -->
      </div>
    `);

    // 2. Оживляем счетчик вопросов сверху
    const lastCounter = divResults.querySelector(".questions-counter-container");
    UXnumberInputQuestions(lastCounter, currentIndex, questions.length, (newIndex) => {
      currentIndex = newIndex;
      createHUD();
    });

    // 3. Оживляем клики по кнопкам пагинации карты вопросов
    UXPagination(divResults, (targetIndex) => {
      currentIndex = targetIndex; // Переключаемся на выбранный вопрос
      createHUD(); // Перерисовываем экран
    });

    // 4. Оживляем логику проверки самого теста
    UXTestQuestion(divResults, currentQuestion, (isCorrect) => {
      // Сохраняем результат в историю ответов перед переходом
      answersHistory[currentIndex] = isCorrect;

      if (isCorrect) {
        correctCount = answersHistory.filter(ans => ans === true).length;
      } else {
        wrongCount = answersHistory.filter(ans => ans === false).length;
      }

      currentIndex++;
      createHUD();
    });
  }
}

export default PlayTest;
