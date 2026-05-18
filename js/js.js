
// Предположим, это ваш массив с вопросами, импортированный из JSON
import questions from "./newJson.json" with { type: "json" };
import PlayTest from "./modules/PlayTest.js";
import sprintTest from "./modules/sprintTest.js";
import useBtn from "./modules/useBtn.js";

useBtn();
PlayTest(questions);
sprintTest(questions);
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


//-------------------------------
// validateQuestions(questions)
// function validateQuestions(questions) {
//   const result = {
//     valid: [],
//     invalid: []
//   };

//   const transformedJsonOutput = [];

//   questions.forEach((question, index) => {
//     const cleanCorrectString = question.correctAnswer.trim();

//     // 1. Формируем новую структуру ответов
//     const analyzedOptions = question.options.map(option => {
//       const cleanOption = option.trim();
      
//       // Проверяем, есть ли вариант в строке ответов (целиком или как подстрока)
//       const isCorrect = cleanOption === cleanCorrectString || cleanCorrectString.includes(cleanOption);
      
//       return {
//         text: option,
//         isCorrect: isCorrect 
//       };
//     });

//     // 2. Проверяем валидность: нашли ли мы хотя бы один правильный ответ
//     const hasCorrect = analyzedOptions.some(opt => opt.isCorrect);

//     if (hasCorrect) {
//       result.valid.push({
//         index: index,
//         title: question.title,
//         status: "OK",
//         options: analyzedOptions 
//       });

//       // 3. Формируем финальный объект (ОБЯЗАТЕЛЬНО сохраняем correctAnswer)
//       transformedJsonOutput.push({
//         title: question.title,
//         timestamp: question.timestamp,
//         correctAnswer: question.correctAnswer, // 👈 Сохранено в структуре
//         options: analyzedOptions
//       });
//     } else {
//       result.invalid.push({
//         index: index,
//         title: question.title.substring(0, 50) + "...",
//         reason: "No correct options matched. Please check for typos."
//       });
//     }
//   });

//   // Вывод в консоль разработчика
//   console.group("📊 Automated Questions JSON Validation (Smart Matching)");
  
//   if (result.invalid.length > 0) {
//     console.error(`❌ Validation failed. Errors found: ${result.invalid.length}`);
//     console.table(result.invalid);
//   } else {
//     console.log("✅ All questions successfully passed validation!");
//   }
  
//   console.groupCollapsed("ℹ️ View valid questions object tree");
//   console.log(result.valid); 
//   console.groupEnd();

//   // ОТДЕЛЬНЫЙ ВЫВОД В ФОРМАТЕ JSON ДЛЯ КОПИРОВАНИЯ
//   console.groupCollapsed("📋 COPY NEW TRANSFORMED JSON HERE");
//   console.log(JSON.stringify(transformedJsonOutput, null, 2));
//   console.groupEnd();
  
//   console.groupEnd();

//   return result;
// } 
 
