function renderStats(mainquestions, nameStorage,testName) {
  const resultsContainer = document.getElementById('results');
  
  // 1. Загружаем данные из localStorage
  const stats = JSON.parse(localStorage.getItem(nameStorage)) || {
    correct: [],
    incorrect: [],
    neverSeen: Array.from({ length: mainquestions.length }, (_, i) => i)
  };

  const total = mainquestions.length;
  
  // Получаем уникальные массивы индексов
  const uniqueCorrect = [...new Set(stats.correct)];
  const uniqueIncorrect = [...new Set(stats.incorrect)];
  const uniqueNeverSeen = [...new Set(stats.neverSeen)];

  // Расчет процентов
  const correctPercent = Math.round((uniqueCorrect.length / total) * 100) || 0;
  const incorrectPercent = Math.round((uniqueIncorrect.length / total) * 100) || 0;
  const neverSeenPercent = Math.round((uniqueNeverSeen.length / total) * 100) || 0;

  // Вспомогательная функция для генерации кликабельных бейджей
  const generateBadgesHTML = (indexesArray, bgClass) => {
    if (indexesArray.length === 0) return '<p class="text-muted small mb-0 ps-2">Список пуст</p>';
    return indexesArray.map(index => {
      return `<span class="badge ${bgClass} me-2 mb-2 stats-question-badge" data-index="${index}">№${index + 1}</span>`;
    }).join('');
  };

  // 2. Рендерим основную карточку (Добавлена кнопка очистки во флекс-контейнер заголовка)
  resultsContainer.innerHTML = `
    <div class="card bg-dark text-light border border-secondary shadow p-4 w-100 my-3">
      <div class="card-body p-0">
        
        <!-- Заголовок статистики с кнопкой очистки -->
        <h4 class="fw-bold mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>📊 Статистика: ${testName}</span>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <button class="btn btn-outline-danger btn-sm d-inline-flex align-items-center fw-semibold px-2 py-1" id="btnClearStats" title="Сбросить всю статистику">
              <svg xmlns="http://w3.org" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Сбросить</span>
            </button>
            <span class="badge bg-secondary fs-6">${total} вопросов всего</span>
          </div>
        </h4>

        <!-- Многослойный Прогресс-бар -->
        <div class="mb-4">
          <label class="form-label small text-secondary fw-semibold mb-2">Прогресс изучения базы вопросов:</label>
          <div class="progress" style="height: 25px;">
            <div class="progress-bar bg-success fw-bold" role="progressbar" style="width: ${correctPercent}%;">
              ${correctPercent > 7 ? correctPercent + '%' : ''}
            </div>
            <div class="progress-bar bg-danger fw-bold" role="progressbar" style="width: ${incorrectPercent}%;">
              ${incorrectPercent > 7 ? incorrectPercent + '%' : ''}
            </div>
            <div class="progress-bar bg-secondary opacity-75 fw-bold text-dark" role="progressbar" style="width: ${neverSeenPercent}%;">
              ${neverSeenPercent > 7 ? neverSeenPercent + '%' : ''}
            </div>
          </div>
        </div>

        <!-- АККОРДЕОНЫ С ДЕТАЛИЗАЦИЕЙ -->
        <div class="accordion border border-secondary rounded overflow-hidden" id="statsAccordion">
          
          <div class="accordion-item bg-dark text-light border-0 border-b border-secondary">
            <h2 class="accordion-header">
              <button class="accordion-button bg-dark text-light collapsed shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIncorrect">
                🚨 Вопросы с ошибками (${uniqueIncorrect.length})
              </button>
            </h2>
            <div id="collapseIncorrect" class="accordion-collapse collapse" data-bs-parent="#statsAccordion">
              <div class="accordion-body bg-dark border-top border-secondary">
                <div class="d-flex flex-wrap">${generateBadgesHTML(uniqueIncorrect, 'bg-danger')}</div>
              </div>
            </div>
          </div>

          <div class="accordion-item bg-dark text-light border-0 border-b border-secondary">
            <h2 class="accordion-header">
              <button class="accordion-button bg-dark text-light collapsed shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCorrect">
                ✅ Изученные вопросы (${uniqueCorrect.length})
              </button>
            </h2>
            <div id="collapseCorrect" class="accordion-collapse collapse" data-bs-parent="#statsAccordion">
              <div class="accordion-body bg-dark border-top border-secondary">
                <div class="d-flex flex-wrap">${generateBadgesHTML(uniqueCorrect, 'bg-success')}</div>
              </div>
            </div>
          </div>

          <div class="accordion-item bg-dark text-light border-0">
            <h2 class="accordion-header">
              <button class="accordion-button bg-dark text-light collapsed shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNeverSeen">
                ❔ Не пройденные вопросы (${uniqueNeverSeen.length})
              </button>
            </h2>
            <div id="collapseNeverSeen" class="accordion-collapse collapse" data-bs-parent="#statsAccordion">
              <div class="accordion-body bg-dark border-top border-secondary">
                <div class="d-flex flex-wrap">${generateBadgesHTML(uniqueNeverSeen, 'bg-secondary')}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- ДИНАМИЧЕСКОЕ МОДАЛЬНОЕ ОКНО -->
    <div class="modal fade" id="statsQuestionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark text-light border border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title" id="modalQuestionTitle">Просмотр вопроса</h5>
            <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalQuestionBody"></div>
        </div>
      </div>
    </div>
  `;

  // 3. Обработчик клика по кнопке "Сбросить"
  const btnClearStats = resultsContainer.querySelector('#btnClearStats');
  btnClearStats.addEventListener('click', () => {
    const isConfirmed = confirm(`Вы уверены, что хотите полностью сбросить статистику для теста "${nameStorage}"? Изменения нельзя будет отменить.`);
    
    if (isConfirmed) {
      localStorage.removeItem(nameStorage); // Удаляем ключ из памяти браузера
      renderStats(mainquestions, nameStorage); // Перерисовываем интерфейс с чистыми значениями
    }
  });

  // 4. Логика открытия модального окна при клике на номер вопроса
  const badges = resultsContainer.querySelectorAll('.stats-question-badge');
  badges.forEach(badge => {
    badge.addEventListener('click', () => {
      const itemIndex = parseInt(badge.dataset.index, 10);
      const item = mainquestions[itemIndex];

      if (!item) return;

      const optionsHtml = item.options.map((option, index) => {
        const isCorrectStyle = option.isCorrect ? 'text-success fw-bold' : 'text-white opacity-75';
        return `<p class="mb-1 ${isCorrectStyle}"><b class="me-2">${index + 1}:</b>${option.text}</p>`;
      }).join('');

      const modalBody = document.getElementById('modalQuestionBody');
      modalBody.innerHTML = `
        <h5 class="text-light mb-3 lh-base">
          <span class="badge bg-primary me-2">Вопрос №${itemIndex + 1}</span> 
          ${item.title}
        </h5>
        <div class="options-list my-3 ps-2 border-start border-secondary d-flex flex-column gap-2">
          ${optionsHtml}
        </div> 
        <div class="alert alert-info border-0 bg-info bg-opacity-10 mt-3 mb-0">
          <div class="d-flex align-items-start">
            <svg xmlns="http://w3.org" class="text-info me-2 flex-shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong class="text-info d-block mb-1">Правильный ответ:</strong>
              <span class="text-white small fs-6">${item.correctAnswer}</span>
            </div>
          </div>
        </div>
      `;

      const myModal = new bootstrap.Modal(document.getElementById('statsQuestionModal'));
      myModal.show();
    });
  });
}

export default renderStats;
