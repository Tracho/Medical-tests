function UITestQuestion(currentQuestion) {
  // Генерируем уникальный префикс, чтобы ID чекбоксов не дублировались при переключении вопросов
  const questionIdPrefix = `q_${Date.now()}`;

  // Перебираем варианты ответов текущего вопроса (каждый элемент теперь объект { text, isCorrect })
  let randomOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5); 
  const optionsHTML = randomOptions.map((option, index) => {
    const optionId = `${questionIdPrefix}_option_${index}`;
    
    return `
      <div class="mb-2">
        <!-- Настоящий чекбокс, скрытый стилями Bootstrap -->
        <input type="checkbox" class="btn-check" id="${optionId}" value="${option.text}" autocomplete="off">
        
        <!-- Большая кликабельная карточка варианта ответа -->
        <label class="btn btn-outline-secondary w-100 text-start p-3 d-flex align-items-center justify-content-between option-label bgprim" for="${optionId}">
          <div class="d-flex align-items-center gap-3">
            <!-- Квадрат чекбокса (рисуется через CSS) -->
            <div class="custom-checkbox-box flex-shrink-0"></div>
            <span>${option.text}</span>
          </div>
        </label>
      </div>
    `;
  }).join('');

  return `
    <div class="bg-dark my-3 test-question-container w-100">
      <div class="card-body p-0">
        
        <!-- Заголовок (Текст текущего вопроса) -->
        <h5 class="card-title fw-bold text-light mb-4 lh-base">
          ${currentQuestion.title}
        </h5>
        
        <!-- Список вариантов ответов -->
        <div class="options-group mb-4">
          ${optionsHTML}
        </div>

        <!-- Кнопка фиксации выбора (для множественного выбора) -->
        <div class="d-flex justify-content-end" id="confirmBlock">
          <button class="btn btn-primary px-4 fw-semibold Wadaptive" id="btnConfirmAnswer">
            Подтвердить выбор
          </button>
        </div>
 
        <!-- Подсказка с правильным ответом (скрыта по умолчанию) -->
        <div class="alert alert-info border-0 bg-info bg-opacity-10 d-none" id="correctAnswerBlock">
          <div class="d-flex align-items-start">
            <svg xmlns="http://w3.org" class="text-info me-2 flex-shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong class="text-info d-block mb-1">Правильный ответ:</strong>
              <span class="text-white small">${currentQuestion.correctAnswer}</span>
            </div>
          </div>
        </div>

        <!-- Кнопка перехода к следующему шагу (скрыта по умолчанию) -->
        <div class="d-flex justify-content-end d-none" id="nextQuestionBlock">
          <button class="btn btn-primary px-4 d-inline-flex align-items-center fw-semibold Wadaptive justify-content-center" id="btnNextQuestion">
            <span>Дальше</span>
            <svg xmlns="http://w3.org" class="ms-2" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  `;
}

export default UITestQuestion;
