import UIresultСounter from "./UI/UIresultСounter.js";
import UITestQuestion from "./UI/UITestQuestion.js";
import UIstartSprintTest from "./UI/UIstartSprintTest.js";
import UXTestQuestion from "./UX/UXTestQuestion.js";
import UXstartSprintTest from "./UX/UXstartSprintTest.js";
import UIBtnSaveQuestion from "./UI/UIBtnSaveQuestion.js";
import UXBtnSaveQuestion from "./UX/UXBtnSaveQuestion.js";
import UIcheckBox from "./UI/UIcheckBox.js"; // 👈 Импортируем чекбоксы
import getStorage from "./components/getSorage.js";

function sprintTest(originalQuestions, nameStorage) {
  let divResults = document.querySelector("#results");
  const btnSprintTest = document.querySelector("#btnSprintTest");

  const mainQuestions = originalQuestions;
  let activeQuestions = []; // Массив вопросов для текущего режима игры

  let currentIndex = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let stats_incorrect = false;
  let stats_saveList = false;
  let startGame = false;

  // Настройка таймера (По умолчанию 20 минут = 1200 секунд)
  let totalTime = 1200;
  let memoryTotalTime = totalTime;
  let timerInterval = null;

  let answersHistory = [];

  // Слушаем кнопку запуска спринта из главного меню
  btnSprintTest.addEventListener("click", () => {
    isMistakesMode = false;
    isNeverSeenMode = false;
    isSavedMode = false;
    applySprintFilters();
  });

  // Переменные флагов для режимов
  let isMistakesMode = false;
  let isNeverSeenMode = false;
  let isSavedMode = false;

  // Умная фильтрация и перемешивание вопросов для Спринта
  function applySprintFilters() {
    // Получаем свежий сторадж через вашу функцию getStorage
    const stats = getStorage(mainQuestions.length, nameStorage);
    stats_incorrect = stats.incorrect.length > 0 ? true : false;
    stats_saveList = stats.saveList.length > 0 ? true : false;
    let filtered = [...mainQuestions];

    if (isMistakesMode) {
      filtered = mainQuestions.filter((_, idx) => stats.incorrect.includes(idx));
    } else if (isNeverSeenMode) {
      filtered = mainQuestions.filter((_, idx) => stats.neverSeen.includes(idx));
    } else if (isSavedMode) {
      // Режим "Сохраненные" (закладки)
      const saveList = stats.saveList || [];
      filtered = mainQuestions.filter((_, idx) => saveList.includes(idx));
    }

    // 🔥 РАНДОМИЗАЦИЯ: Перемешиваем только отфильтрованные вопросы
    activeQuestions = filtered.sort(() => Math.random() - 0.5);

    // Сброс параметров сессии
    startGame = false;
    totalTime = memoryTotalTime;
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    answersHistory = new Array(activeQuestions.length).fill(null);

    clearInterval(timerInterval);
    timerInterval = null;

    createHUD();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      totalTime--;

      const timerElement = document.querySelector("#timerDisplay");
      if (timerElement) {
        timerElement.textContent = formatTime(totalTime);
      }

      if (totalTime <= 0) {
        clearInterval(timerInterval);
        endGame(true);
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function endGame(isTimeOut = false) {
    if (timerInterval) clearInterval(timerInterval);
    divResults.innerHTML = `
      <div class="text-center p-4 w-100 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
        <div class="d-flex flex-column justify-content-center align-items-center gap-3">
          <h2 class="fw-bold mb-0">${isTimeOut ? '⏰ Время вышло!' : '🎉 Спринт завершен!'}</h2>
          <p class="mb-0">Правильных ответов: <strong class="text-success">${correctCount}</strong></p>
          <p class="mb-0">Неправильных ответов: <strong class="text-danger">${wrongCount}</strong></p>
          <button id="btnRestartSprint" class="btn btn-primary px-4 fw-semibold">Повторить этот спринт</button>
        </div>
      </div>
    `;
    const btnRestartSprint = divResults.querySelector("#btnRestartSprint");
    if (btnRestartSprint) {
      btnRestartSprint.addEventListener("click", () => {
        applySprintFilters(); // Перезапустит текущий отфильтрованный режим заново
      });
    }
  }

  function createHUD() {
    const currentQuestion = activeQuestions[currentIndex];

    // Если вопросы в выбранном режиме кончились
    if (!currentQuestion) {
      endGame(false);
      return;
    }

    divResults.innerHTML = '';

    // Рендерим разметку (Добавлен блок чекбоксов режимов игры)
    divResults.insertAdjacentHTML("beforeend", `
      <div class="d-flex flex-wrap align-items-start gap-3 w-100 bg-dark p-3 text-light">

        <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-3">
          ${UIresultСounter(correctCount, wrongCount)}

          <div class="d-flex dropdown gap-3"> 
            <button class="btn dropdown-toggle useBtn btn-outline-light" type="button" id="DropdownMenuButtonTime" data-bs-toggle="dropdown" aria-expanded="false">
              Изменить время
            </button> 
            <ul class="dropdown-menu dropdown-menu-dark border-secondary shadow" aria-labelledby="DropdownMenuButtonTime" id="timeList">
              <li class="longTest"><a class="dropdown-item stats-dropdown-item" href="#" data-time="1200">20 минут.</a></li>
              <li class="longTest"><a class="dropdown-item stats-dropdown-item" href="#" data-time="600">10 минут.</a></li>
              <li class="longTest"><a class="dropdown-item stats-dropdown-item" href="#" data-time="300">5 минут.</a></li>
            </ul>  
            <div id="timerDisplay" class="badge bg-secondary fs-5 p-2">${formatTime(totalTime)}</div>
          </div>
        </div>

        <!-- КНОПКИ РЕЖИМОВ СПРИНТА (Работает как переключатель) -->
        <div class="d-flex gap-3 w-100 my-2 flex-wrap">
          ${UIBtnSaveQuestion()}
          ${(stats_incorrect === false ? `<div class="d-none">${UIcheckBox('Работа над ошибками', "idSprintMistakes")}</div>` : UIcheckBox('Работа над ошибками', "idSprintMistakes"))} 
          ${UIcheckBox('Непройденные вопросы', "idSprintNeverSeen")} 
           ${(stats_saveList === false ? `<div class="d-none">${UIcheckBox('Сохраненные вопросы', "idSavedQuestions")}</div>` : UIcheckBox('Сохраненные вопросы', "idSavedQuestions"))} 
        </div>
        
        <div id="divQuestion" class="position-relative w-100 ${startGame === false ? 'blur' : ''}">
          ${UITestQuestion(currentQuestion)} 
          ${startGame === false ? UIstartSprintTest() : ""}
        </div> 
      </div>
    `);

    // Синхронизируем и оживляем переключатели режимов
    const chkMistakes = divResults.querySelector("#idSprintMistakes");
    const chkNeverSeen = divResults.querySelector("#idSprintNeverSeen");
    const chkSaved = divResults.querySelector("#idSavedQuestions");

    chkMistakes.checked = isMistakesMode;
    chkNeverSeen.checked = isNeverSeenMode;
    chkSaved.checked = isSavedMode;

    // Радио-логика: активным может быть только один чекбокс
    chkMistakes.addEventListener("change", () => {
      isMistakesMode = chkMistakes.checked;
      if (isMistakesMode) { isNeverSeenMode = false; isSavedMode = false; }
      applySprintFilters();
    });

    chkNeverSeen.addEventListener("change", () => {
      isNeverSeenMode = chkNeverSeen.checked;
      if (isNeverSeenMode) { isMistakesMode = false; isSavedMode = false; }
      applySprintFilters();
    });

    chkSaved.addEventListener("change", () => {
      isSavedMode = chkSaved.checked;
      if (isSavedMode) { isMistakesMode = false; isNeverSeenMode = false; }
      applySprintFilters();
    });

    // Ваша рабочая функция сохранения (передаем 4 параметра, как вы подтвердили)
    UXBtnSaveQuestion(currentQuestion, mainQuestions, nameStorage, getStorage(mainQuestions.length, nameStorage));

    // Изменение времени таймера
    let timeLinks = divResults.querySelectorAll("#timeList a");
    timeLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedSeconds = parseInt(link.dataset.time, 10);
        memoryTotalTime = selectedSeconds;
        applySprintFilters(); // Перезапустит логику с новым временем
      });
    });

    // Проверка чекбоксов в вопросе
    UXTestQuestion(divResults, currentQuestion, mainQuestions, nameStorage, (isCorrect) => {
      answersHistory[currentIndex] = isCorrect;

      if (isCorrect) {
        correctCount = answersHistory.filter(ans => ans === true).length;
      } else {
        wrongCount = answersHistory.filter(ans => ans === false).length;
      }

      currentIndex++;
      createHUD();
    });

    // Оживляем размытие/кнопку старта
    if (startGame === false) {
      UXstartSprintTest(() => {
        startGame = true;
        startTimer();
        createHUD();
      });
    }
  }
}

export default sprintTest;
