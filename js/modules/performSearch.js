import renderStats from "./renderStats.js";
import UICopyQuestion from "./UI/UICopyQuestion.js";
import UXCopyQuestionSearch from "./UX/UXCopyQuestionSearch.js";

function performSearch(questions,nameTest) {
  // Находим элементы на странице
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resultsContainer = document.getElementById('results');

  // Функция для выполнения поиска
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Очищаем контейнер с прошлыми результатами
    resultsContainer.innerHTML = '';

    // Если инпут пустой, ничего не ищем
    if (!query) {
      searchInput.placeholder = 'Введите текст для поиска';
      setTimeout(() => { searchInput.placeholder = "Введите текст..." }, 3000);
      renderStats(questions,nameTest);
      return;
    }

    // 1. Фильтруем массив вопросов по неточному совпадению с title
    const filteredQuestions = questions.filter(item => {
      return item.title.toLowerCase().includes(query);
    });

    // 2. Выводим результаты на экран
    if (filteredQuestions.length === 0) {
      resultsContainer.innerHTML = '<p class="text-muted">Ничего не найдено</p>';
      return;
    }

    filteredQuestions.forEach(item => {
      // Находим реальный номер вопроса в исходном массиве (индекс + 1)
      const realQuestionNumber = questions.indexOf(item);

      const questionElement = document.createElement('div');
      questionElement.className = 'question-item mb-4';

      // ИЗМЕНЕНО: теперь считываем option.text, так как каждый вариант — это объект
      const optionsHtml = item.options.map((option, index) => {
        // Опционально: можно подсветить правильные варианты в поиске с помощью option.isCorrect
        const isCorrectStyle = option.isCorrect ? 'text-success fw-bold' : 'fw-lighter opacity-75';
        return `<p class="mb-0 ${isCorrectStyle}"><b class="me-2">${index + 1}:</b>${option.text}</p>`;
      }).join('');

      // ИЗМЕНЕНО: Добавили номер вопроса в заголовок <h4>
      questionElement.innerHTML = `
      <h5 class="text-light">
        ${UICopyQuestion(realQuestionNumber)}
        <span class="badge bg-primary me-2">Вопрос №${realQuestionNumber}</span> 
        ${item.title}
      </h5>
      <div class="options-list my-3 ps-2 border-start border-secondary d-flex flex-column gap-2">
        ${optionsHtml}
      </div> 
         <div class="alert alert-info border-0 bg-info bg-opacity-10">
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
      <hr class="border-secondary">
    `;
      resultsContainer.appendChild(questionElement);
    });
    UXCopyQuestionSearch(questions, resultsContainer)
  }


  
  // Слушаем клик по кнопке
  searchButton.addEventListener('click', performSearch);

  // Поиск по нажатию клавиши Enter в инпуте
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}

export default performSearch;