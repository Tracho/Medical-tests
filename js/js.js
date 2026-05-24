// Предположим, это ваш массив с вопросами, импортированный из JSON
import JSONTEST1 from "./Test1.json" with { type: "json" };
import JSONTEST2 from "./Test2.json" with { type: "json" };
import JSONENGTORUTEST1 from "./EngToRuTest1.json" with { type: "json" };
import JSONRUTOENGTEST1 from "./RuToEngTest1.json" with { type: "json" };
import PlayTest from "./modules/PlayTest.js";
import sprintTest from "./modules/sprintTest.js";
import useBtn from "./modules/useBtn.js";
import performSearch from "./modules/performSearch.js";
import renderStats from "./modules/renderStats.js";

// 1. Массив ваших тестов: связываем человеческое название и импортированный JSON-объект напрямую
const myTests = [
  { storage: "Test #1", name: "Вопросы по общепрофессиональным дисциплинам (дополнительные): медико-диагностический профиль", data: JSONTEST1 },
  { storage: "Test #2", name: "Врач клинической лабораторной диагностики, иные работники клинических лабораторий (цитологическое, генетическое, химико-токсикологическое и прочие направления)", data: JSONTEST2 },
  { storage: "EngTest1", name: "Eng.Уровень №1. С Английского", data: JSONENGTORUTEST1 },
  { storage: "RuToEngTest1", name: "Eng.Уровень №1. На Английский", data: JSONRUTOENGTEST1 }
];

// Переменные для хранения текущего состояния (изначально первый тест)
let nameTest = myTests[0].name; 
let nameStorage = myTests[0].storage; 

// Функция для инициализации/перезапуска всех модулей приложения
function updateAppModules(testData, testName, currentStorage) {
  // ИСПРАВЛЕНО: Обновляем глобальные переменные (переименовали аргумент в currentStorage, чтобы избежать конфликта имен)
  nameTest = testName;
  nameStorage = currentStorage;

  // Очищаем прошлые результаты в DOM (чтобы старый тест исчез с экрана)
  const divResults = document.querySelector("#results");
  if (divResults) divResults.innerHTML = '';

  // Перезапускаем все функции с новыми данными
  performSearch(testData, nameStorage);
  PlayTest(testData, nameStorage);
  sprintTest(testData, nameStorage);
  renderStats(testData,nameStorage, testName);
}

function initStatsDropdown() {
  const listContainer = document.querySelector("#statsTestsList");
  if (!listContainer) return;

  // Генерируем элементы списка динамически
listContainer.innerHTML = myTests.map((test, index) => `
    <li class="longTest">
      <!-- Добавлен атрибут title="${test.name}" для всплывающей подсказки браузера -->
      <a class="dropdown-item stats-dropdown-item" href="#" data-index="${index}" title="${test.name}">
        ${test.name}
      </a>
    </li>
  `).join('');


  // Вешаем обработчик события клика на каждый пункт списка
  const dropdownItems = listContainer.querySelectorAll(".stats-dropdown-item");
  dropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const testIndex = parseInt(item.dataset.index, 10);
      const selectedTest = myTests[testIndex];

      // Меняем текст на самой кнопке выпадающего списка
      const dropdownBtn = document.querySelector("#dropdownMenuButton");
      // if (dropdownBtn) dropdownBtn.textContent = selectedTest.storage;

      // 🔥 Передаем выбранный вариант во все функции приложения (включая storage ключ)
      updateAppModules(selectedTest.data, selectedTest.name, selectedTest.storage);
    });
  });
}

// 1. Инициализируем выпадающий список тестов
initStatsDropdown();

// 2. Инициализируем общую логику кнопок переключения вкладок/экранов (вызывается один раз)
useBtn();

// 3. Запускаем приложение в первый раз с Тестом №1 по умолчанию
updateAppModules(myTests[0].data, myTests[0].name, myTests[0].storage);

// ИСПРАВЛЕНО: Добавлена проверка на существование кнопки перед тем, как вешать обработчик событий
const btnOpenStats = document.querySelector("#btnOpenStats");
if (btnOpenStats) {
  btnOpenStats.addEventListener("click", () => {
    const currentTestData = myTests.find(t => t.storage === nameStorage)?.data || JSONTEST1; 
    renderStats(currentTestData, nameStorage);
  });
}





//-------------------------------
// validateJSONTEST1(JSONTEST1)
// function validateJSONTEST1(JSONTEST1) {
//   const result = {
//     valid: [],
//     invalid: []
//   };

//   const transformedJsonOutput = [];

//   JSONTEST1.forEach((question, index) => {
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
//   console.group("📊 Automated JSONTEST1 JSON Validation (Smart Matching)");
  
//   if (result.invalid.length > 0) {
//     console.error(`❌ Validation failed. Errors found: ${result.invalid.length}`);
//     console.table(result.invalid);
//   } else {
//     console.log("✅ All JSONTEST1 successfully passed validation!");
//   }
  
//   console.groupCollapsed("ℹ️ View valid JSONTEST1 object tree");
//   console.log(result.valid); 
//   console.groupEnd();

//   // ОТДЕЛЬНЫЙ ВЫВОД В ФОРМАТЕ JSON ДЛЯ КОПИРОВАНИЯ
//   console.groupCollapsed("📋 COPY NEW TRANSFORMED JSON HERE");
//   console.log(JSON.stringify(transformedJsonOutput, null, 2));
//   console.groupEnd();
  
//   console.groupEnd();

//   return result;
// } 
 
