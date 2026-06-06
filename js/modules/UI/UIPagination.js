function UIPagination(totalQuestions, currentIndex, answersHistory) {
  let buttonsHTML = '';

  for (let i = 0; i < totalQuestions; i++) {
    const questionNumber = i ;
    let bgClass = 'bg-transparent text-light'; // По умолчанию прозрачный
    let activeClass = (i === currentIndex) ? 'active' : '';

    // Проверяем статус ответа в истории
    if (answersHistory[i] === true) {
      bgClass = 'bg-success text-white border-0';
    } else if (answersHistory[i] === false) {
      bgClass = 'bg-danger text-white border-0';
    }

    buttonsHTML += `
      <div class="pagination-item ${bgClass} ${activeClass}" data-index="${i}">
        ${questionNumber}
      </div>
    `;
  }

  return `
    <div class="accordion my-3 w-100 border border-secondary rounded" id="paginationAccordion">
      <div class="accordion-item bg-dark text-light border-0">
        <h2 class="accordion-header">
          <button onclick="navigator.vibrate?.(30)" class="accordion-button bg-dark text-light collapsed shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePagination">
            Карта вопросов (Нажмите, чтобы открыть/закрыть)
          </button>
        </h2>
        <div id="collapsePagination" class="accordion-collapse collapse" data-bs-parent="#paginationAccordion">
          <div class="accordion-body bg-dark border-top border-secondary">
            <div class="pagination-grid">
              ${buttonsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default UIPagination;
