
// Предположим, это ваш массив с вопросами, импортированный из JSON
import questions from "./json.json" with { type: "json" };
import PlayTest from "./modules/PlayTest.js";
import useBtn from "./modules/useBtn.js";

useBtn();
PlayTest(questions);
// Находим элементы на странице
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

// Функция для выполнения поиска
function performSearch() {
  // 1. Считываем текст из инпута, убираем лишние пробелы и переводим в нижний регистр
  const query = searchInput.value.trim().toLowerCase();

  // Очищаем контейнер с прошлыми результатами
  resultsContainer.innerHTML = '';

  // Если инпут пустой, ничего не ищем
  if (!query) {
    searchInput.placeholder = 'Введите текст для поиска';
    setTimeout(() => { searchInput.placeholder = "Введите текст..." }, 3000);
    return;
  }

  // 2. Фильтруем массив вопросов по неточному совпадению с title
  const filteredQuestions = questions.filter(item => {
    return item.title.toLowerCase().includes(query);
  });

  // 3. Выводим результаты на экран
  if (filteredQuestions.length === 0) {
    resultsContainer.innerHTML = '<p>Ничего не найдено</p>';
    return;
  }

  filteredQuestions.forEach(item => {
    const questionElement = document.createElement('div');
    questionElement.className = 'question-item';
    const optionsHtml = item.options.map((option, index) => `<p class="mb-1"><b class="me-2">${index}:</b>${option}</p>`).join('');
    questionElement.innerHTML = `
            <h4>${item.title}</h4>
            ${optionsHtml}
            <p class="fs-4"><strong>Правильный ответ:</strong> ${item.correctAnswer}</p>
            <hr>
        `;
    resultsContainer.appendChild(questionElement);
  });
}

// Слушаем клик по кнопке
searchButton.addEventListener('click', performSearch);

// Дополнительно: поиск по нажатию клавиши Enter в инпуте
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    performSearch();
  }
});
