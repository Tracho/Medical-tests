import UInumberInputQuestions from "./UI/UInumberInputQuestions.js";
import UIresultСounter from "./UI/UIresultСounter.js";
import UITestQuestion from "./UI/UITestQuestion.js";
import UIPagination from "./UI/UIPagination.js";
import UIstartSprintTest from "./UI/UIstartSprintTest.js";
import UXnumberInputQuestions from "./UX/UXnumberInputQuestions.js";
import UXTestQuestion from "./UX/UXTestQuestion.js";
import UXPagination from "./UX/UXPagination.js";
import UXstartSprintTest from "./UX/UXstartSprintTest.js"; // Используем импортированный UX

function sprintTest(originalQuestions, nameTest) {
  let divResults = document.querySelector("#results");
  const btnSprintTest = document.querySelector("#btnSprintTest");

  // 1. РАНДОМИЗАЦИЯ ВОПРОСОВ (Алгоритм Фишера-Йетса)
  const mainquestions = originalQuestions;
  let questions = [...originalQuestions].sort(() => Math.random() - 0.5);

  let currentIndex = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let startGame = false;

  // 2. НАСТРОЙКА ТАЙМЕРА (Время в секундах: 2 минуты = 120 секунд)
  let totalTime = 1200;
  let memoryTotalTime = totalTime;
  let timerInterval = null;

  let answersHistory = new Array(questions.length).fill(null);

  btnSprintTest.addEventListener("click", () => {
    resetSettings();
    createHUD();
  });

  function resetSettings() {
    startGame = false;
    totalTime = memoryTotalTime;
    questions = [...originalQuestions].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    answersHistory = new Array(questions.length).fill(null);
    clearInterval(timerInterval);
  }

  // Функция для запуска обратного отсчета
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      totalTime--;

      // Обновляем текст таймера на экране, если элемент существует
      const timerElement = document.querySelector("#timerDisplay");
      if (timerElement) {
        timerElement.textContent = formatTime(totalTime);
      }

      // Если время вышло — принудительно завершаем тест
      if (totalTime <= 0) {
        clearInterval(timerInterval);
        endGame(true); // Передаем true, что время вышло
      }
    }, 1000);
  }

  // Вспомогательная функция форматирования секунд в ММ:СС
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Вынесли завершение теста в отдельную функцию, чтобы вызывать и по таймеру
  function endGame(isTimeOut = false) {
    if (timerInterval) clearInterval(timerInterval);
    divResults.innerHTML = `
      <div class="text-center p-4 w-100 bg-dark text-light d-flex flex-column justify-content-center align-items-center">
        <div class="d-flex flex-column justify-content-center align-items-center gap-3">
          <h2 class="fw-bold mb-0">${isTimeOut ? '⏰ Время вышло!' : '🎉 Тест завершен!'}</h2>
          <p class="mb-0">Правильных ответов: <strong class="text-success">${correctCount}</strong></p>
          <p class="mb-0">Неправильных ответов: <strong class="text-danger">${wrongCount}</strong></p>
          <button id="btnRestartSprint" class="btn btn-primary px-4 fw-semibold">Повторить спринт</button>
        </div>
      </div>
    `;
    const btnRestartSprint = divResults.querySelector("#btnRestartSprint");
    if (btnRestartSprint) {
      btnRestartSprint.addEventListener("click", () => {
        resetSettings();
        createHUD();
      });
    }
  }

  function createHUD() {
    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
      endGame(false);
      return;
    }

    divResults.innerHTML = '';

    // Выводим HTML. Добавлен блок для таймера с id="timerDisplay"
    divResults.insertAdjacentHTML("beforeend", `
      <div class="d-flex flex-wrap align-items-start gap-3 w-100 bg-dark p-3 text-light">

        <div class="w-100 d-flex justify-content-between align-items-center flex-wrap gap-3">
          ${UIresultСounter(correctCount, wrongCount)}

          <div class="d-flex dropdown gap-3"> 
          <button class="btn dropdown-toggle useBtn btn-outline-light" type="button" id="DropdownMenuButtonTime" data-bs-toggle="dropdown" aria-expanded="false">
            Изменить время
          </button> 
          <ul class="dropdown-menu dropdown-menu-dark border-secondary shadow" aria-labelledby="DropdownMenuButtonTime" id="timeList">
              <li class="longTest"> 
                <a class="dropdown-item stats-dropdown-item" href="#" data-index="1200" title="20 минут.">
                  20 минут.
                </a>
              </li>
            
              <li class="longTest"> 
                <a class="dropdown-item stats-dropdown-item" href="#" data-index="600" title="10 минут.">
                  10 минут.
                </a>
              </li>
              <li class="longTest"> 
                <a class="dropdown-item stats-dropdown-item" href="#" data-index="300" title="5 минут.">
                  5 минут.
                </a>
              </li>
            </ul>  
            <div id="timerDisplay" class="badge bg-secondary fs-5 p-2">${formatTime(totalTime)}</div>
          </div>

        
        </div>
        
        <!-- Блюр уберется навсегда, так как переменная startGame станет true -->
        <div id="divQuestion" class="position-relative relative w-100 ${startGame === false ? 'blur' : ''}">
          ${UITestQuestion(currentQuestion)}
          ${startGame === false ? UIstartSprintTest() : ""}
        </div> 
      </div>
    `);

    let timeList = document.querySelectorAll("#timeList a");
    timeList.forEach((e) => {
      e.addEventListener("click", () => {
        totalTime = e.dataset.index;
        memoryTotalTime = e.dataset.index;
        resetSettings();
        createHUD();
      });
    })
    // divResults.insertAdjacentHTML("beforeend", `
    //   <div class="d-flex flex-wrap align-items-start gap-3 w-100 bg-dark p-3 text-light">

    //     ${UIresultСounter(correctCount, wrongCount)}  
    //     <div id="divQuestion" class="position-relative relative w-100 ${startGame == false ? 'blur' : ''}">
    //     ${UITestQuestion(currentQuestion)}
    //     ${UIstartSprintTest()}
    //     </div>
    //     <div class="w-100 d-flex justify-content-center align-items-center">${UInumberInputQuestions(currentIndex, questions.length)}</div>
    //     ${UIPagination(questions.length, currentIndex, answersHistory)} 
    //   </div>
    // `);

    // Оживляем счетчик вопросов сверху
    // const lastCounter = divResults.querySelector(".questions-counter-container");
    // UXnumberInputQuestions(lastCounter, currentIndex, questions.length, (newIndex) => {
    //   currentIndex = newIndex;
    //   createHUD();
    // });

    // Оживляем клики по кнопкам пагинации
    // UXPagination(divResults, (targetIndex) => {
    //   currentIndex = targetIndex;
    //   createHUD();
    // });

    // Оживляем логику проверки самого теста
    UXTestQuestion(divResults, currentQuestion, mainquestions, nameTest, (isCorrect) => {
      answersHistory[currentIndex] = isCorrect;

      if (isCorrect) {
        correctCount = answersHistory.filter(ans => ans === true).length;
      } else {
        wrongCount = answersHistory.filter(ans => ans === false).length;
      }

      currentIndex++;
      createHUD();
    });

    // 3. ОЖИВЛЯЕМ КНОПКУ СТАРТА И ЗАПУСКАЕМ ТАЙМЕР
    // Передаем колбэк в импортированную функцию UXstartSprintTest
    UXstartSprintTest(() => {
      startGame = true;    // Теперь флаг меняется внутри замыкания sprintTest
      startTimer();        // Запускаем счетчик времени
      createHUD();         // Перерисовываем HUD уже без блюра
    });


  }

}

export default sprintTest;
