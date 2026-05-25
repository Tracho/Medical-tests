import UInumberInputQuestions from "./UI/UInumberInputQuestions.js";
import UIresultСounter from "./UI/UIresultСounter.js";
import UITestQuestion from "./UI/UITestQuestion.js";
import UIPagination from "./UI/UIPagination.js";
import UXnumberInputQuestions from "./UX/UXnumberInputQuestions.js";
import UXTestQuestion from "./UX/UXTestQuestion.js";
import UXPagination from "./UX/UXPagination.js";
import UIcheckBox from "./UI/UIcheckBox.js";
import UIBtnSaveQuestion from "./UI/UIBtnSaveQuestion.js";
import UXBtnSaveQuestion from "./UX/UXBtnSaveQuestion.js";
import getStorage from "./components/getSorage.js";

function PlayTest(questions, nameStorage) {
  let divResults = document.querySelector("#results");
  const btnPlayTest = document.querySelector("#btnPlayTest");

  // 1. ИСПРАВЛЕНО: Сначала объявляем базовый неизменяемый массив вопросов
  const mainQuestions = questions;

  // Исходный массив истории ответов (синхронизирован с базовым массивом)
  let baseAnswersHistory = new Array(mainQuestions.length).fill(null);

  // Переменные состояния текущего прохождения
  let activeQuestions = [...mainQuestions]; // Вопросы, которые отображаются прямо сейчас
  let currentAnswersHistory = [...baseAnswersHistory]; // История ответов для текущего режима
  let currentIndex = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let stats_incorrect = false;
  // Флаги активных режимов фильтрации
  let isMistakesMode = false;
  let isNeverSeenMode = false;
  let isSavedMode = false;

  // Вешаем обработчик на главную кнопку запуска теста один раз
  btnPlayTest.addEventListener("click", () => {
    // При старте теста всегда сбрасываем фильтры в исходное состояние
    isMistakesMode = false;
    isNeverSeenMode = false;
    isSavedMode = false;
    applyFilters();
  });

  // Функция фильтрации вопросов на основе состояния чекбоксов
  function applyFilters() {
    // Каждый раз заново считываем актуальную статистику из localStorage
    const stats = getStorage(mainQuestions.length, nameStorage);

    stats_incorrect = stats.incorrect.length > 0 ? true : false;

    if (isMistakesMode) {
      // Оставляем только те вопросы, индексы которых есть в stats.incorrect
      activeQuestions = mainQuestions.filter((_, idx) => stats.incorrect.includes(idx));
      currentAnswersHistory = baseAnswersHistory.filter((_, idx) => stats.incorrect.includes(idx));
    } else if (isNeverSeenMode) {
      // Оставляем только те вопросы, индексы которых есть в stats.neverSeen
      activeQuestions = mainQuestions.filter((_, idx) => stats.neverSeen.includes(idx));
      currentAnswersHistory = baseAnswersHistory.filter((_, idx) => stats.neverSeen.includes(idx));
    } else if (isSavedMode) {
      // Оставляем только те вопросы, индексы которых есть в stats.neverSeen
      activeQuestions = mainQuestions.filter((_, idx) => stats.saveList.includes(idx));
      currentAnswersHistory = baseAnswersHistory.filter((_, idx) => stats.saveList.includes(idx));
    } else {
      // Обычный режим — все вопросы
      activeQuestions = [...mainQuestions];
      currentAnswersHistory = [...baseAnswersHistory];
    }

    // Сбрасываем индекс на первый вопрос нового списка
    currentIndex = 0;

    // Обновляем счетчики на основе отфильтрованной истории
    correctCount = currentAnswersHistory.filter(ans => ans === true).length;
    wrongCount = currentAnswersHistory.filter(ans => ans === false).length;

    createHUD();
  }

  function createHUD() {
    // Берем вопрос из отфильтрованного (активного) списка
    const currentQuestion = activeQuestions[currentIndex];

    if (!currentQuestion) {
      divResults.innerHTML = `
        <div class="alert alert-success text-center p-4 w-100 bg-dark text-light border border-secondary shadow-sm">
          <h4 class="fw-bold mb-3">🎉 Список вопросов завершен!</h4>
          <p class="mb-1">Правильных ответов в текущей сессии: <strong class="text-success">${correctCount}</strong></p>
          <p class="mb-0">Неправильных ответов в текущей сессии: <strong class="text-danger">${wrongCount}</strong></p>
        </div>
      `;
      return;
    }

    divResults.innerHTML = '';

    // Рендерим HTML интерфейса (передаем длину activeQuestions)
    divResults.insertAdjacentHTML("beforeend", `
      <div class="d-flex flex-wrap align-items-start gap-3 w-100 bg-dark p-3 text-light">
        ${UIresultСounter(correctCount, wrongCount)}   
        <div class="d-flex flex-wrap gap-3 w-100 my-2">
        ${UIBtnSaveQuestion()}
          ${(stats_incorrect === false ? `<div class="d-none">${UIcheckBox('Работа над ошибками', "idWorkOnMistakes")}</div>` : UIcheckBox('Работа над ошибками', "idWorkOnMistakes"))}
          ${UIcheckBox('Непройденные вопросы', "idNeverSeenQuestions")}
          ${UIcheckBox('Сохраненные вопросы', "idSavedQuestions")}
        </div>
        ${UITestQuestion(currentQuestion)}
        
        <div class="w-100 d-flex justify-content-center align-items-center">
          ${UInumberInputQuestions(currentIndex, activeQuestions.length)}
        </div>
        ${UIPagination(activeQuestions.length, currentIndex, currentAnswersHistory)} 
      </div>
    `);

    UXBtnSaveQuestion(currentQuestion, mainQuestions, nameStorage, getStorage(mainQuestions.length, nameStorage));

    // Синхронизируем визуальное состояние чекбоксов (чтобы галочки не слетали при перерисовке)
    const chkMistakes = divResults.querySelector("#idWorkOnMistakes");
    const chkNeverSeen = divResults.querySelector("#idNeverSeenQuestions");
    const chkSaved = divResults.querySelector("#idSavedQuestions");

    chkMistakes.checked = isMistakesMode;
    chkNeverSeen.checked = isNeverSeenMode;
    chkSaved.checked = isSavedMode;

    // Взаимоисключающая логика кликов по чекбоксам (нельзя включить оба одновременно)
    chkMistakes.addEventListener("change", () => {
      isMistakesMode = chkMistakes.checked;
      if (isMistakesMode) {
        isNeverSeenMode = false; // Отключаем 2
        isSavedMode = false; // Отключаем 3
      }
      applyFilters();
    });

    chkNeverSeen.addEventListener("change", () => {
      isNeverSeenMode = chkNeverSeen.checked;
      if (isNeverSeenMode) {
        isMistakesMode = false; // Отключаем 1
        isSavedMode = false; // Отключаем 3
      }
      applyFilters();
    });

    chkSaved.addEventListener("change", () => {
      isSavedMode = chkSaved.checked;
      if (isSavedMode) {
        isMistakesMode = false; // Отключаем 1
        isNeverSeenMode = false; // Отключаем 2
      }
      applyFilters();
    });

    // Оживляем счетчик вопросов сверху
    const lastCounter = divResults.querySelector(".questions-counter-container");
    UXnumberInputQuestions(lastCounter, currentIndex, activeQuestions.length, (newIndex) => {
      currentIndex = newIndex;
      createHUD();
    });

    // Оживляем клики по кнопкам пагинации карты вопросов
    UXPagination(divResults, (targetIndex) => {
      currentIndex = targetIndex;
      createHUD();
    });

    // Оживляем логику проверки самого теста
    UXTestQuestion(divResults, currentQuestion, mainQuestions, nameStorage, (isCorrect) => {
      // Записываем результат в текущую сессию
      currentAnswersHistory[currentIndex] = isCorrect;

      // Находим реальный глобальный индекс вопроса, чтобы обновить базовую историю
      const globalIndex = mainQuestions.findIndex(q => q.title === currentQuestion.title);
      if (globalIndex !== -1) {
        baseAnswersHistory[globalIndex] = isCorrect;
      }

      // Пересчитываем локальные счетчики
      correctCount = currentAnswersHistory.filter(ans => ans === true).length;
      wrongCount = currentAnswersHistory.filter(ans => ans === false).length;

      currentIndex++;
      createHUD();
    });
  }
}

export default PlayTest;
