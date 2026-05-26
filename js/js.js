// Предположим, это ваш массив с вопросами, импортированный из JSON
import TESTING from "./db/Testing.json" with { type: "json" };
import JSONTEST1 from "./db/Test1.json" with { type: "json" };
import JSONTEST2 from "./db/Test2.json" with { type: "json" };
import JSONENGTORUTEST1 from "./db/EngToRuTest1.json" with { type: "json" };
import JSONRUTOENGTEST1 from "./db/RuToEngTest1.json" with { type: "json" };
import JSONENGADVERBSTEST2_1 from "./db/EngAdverbsTest2.1.json" with { type: "json" };
import JSONENGADVERBSOFTIMEANDFREQUENCYOFACTION2_2 from "./db/EngAdverbsOfTimeAndFrequencyofAction.json" with { type: "json" };
import JSONENGADVERBSOFDEGREEANDCONJUNCTIONS2_3 from "./db/EngAdverbsOfDegreeAndConjunctions2_3.json" with { type: "json" };
import PlayTest from "./modules/PlayTest.js";
import sprintTest from "./modules/sprintTest.js";
import useBtn from "./modules/useBtn.js";
import performSearch from "./modules/performSearch.js";
import renderStats from "./modules/renderStats.js";

// 1. Массив ваших тестов: связываем человеческое название и импортированный JSON-объект напрямую
const myTests = [
  // { storage: "Testing", name: "Testing", data: TESTING },
  { storage: "Test #1", name: "Вопросы по общепрофессиональным дисциплинам (дополнительные): медико-диагностический профиль", data: JSONTEST1 },
  { storage: "Test #2", name: "Врач клинической лабораторной диагностики, иные работники клинических лабораторий (цитологическое, генетическое, химико-токсикологическое и прочие направления)", data: JSONTEST2 },
  { storage: "EngTest1", name: "Eng.Уровень №1. С Английского", data: JSONENGTORUTEST1 },
  { storage: "RuToEngTest1", name: "Eng.Уровень №1. На Английский", data: JSONRUTOENGTEST1 },
  { storage: "ENGADVERBSTEST2_1", name: "Eng.Уровень №2.1 Наречия образа действия (как? — быстро, медленно, хорошо, плохо, странно).", data: JSONENGADVERBSTEST2_1 },
  { storage: "ENGADVERBSOFTIMEANDFREQUENCYOFACTION2_2", name: "Eng.Уровень №2.2 Наречия времени и частоты (когда? как часто? — всегда, часто, редко, вчера, завтра).", data: JSONENGADVERBSOFTIMEANDFREQUENCYOFACTION2_2 },
  { storage: "ENGADVERBSOFDEGREEANDCONJUNCTIONS2_3", name: "Eng.Уровень №2.3  Наречия степени и союзы (очень, слишком, достаточно, потому что, поэтому, но).", data: JSONENGADVERBSOFDEGREEANDCONJUNCTIONS2_3 }
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


 