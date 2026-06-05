import getStorage from './components/getSorage.js'
import UICopyQuestion from './UI/UICopyQuestion.js'
import UXCopyQuestion from './UX/UXCopyQuestion.js'
// import saveStorage from "./components/saveStorage.js";

function renderStats (mainquestions, nameStorage, testName) {
  const resultsContainer = document.getElementById('results')

  // 1. Загружаем данные из localStorage
  const stats = JSON.parse(localStorage.getItem(nameStorage)) || {
    correct: [],
    incorrect: [],
    neverSeen: Array.from({ length: mainquestions.length }, (_, i) => i),
    saveList: []
  }

  const total = mainquestions.length

  // Получаем уникальные массивы индексов
  const uniqueCorrect = [...new Set(stats.correct)]
  const uniqueIncorrect = [...new Set(stats.incorrect)]
  const uniqueSaveList = [...new Set(stats.saveList)]
  const uniqueNeverSeen = [...new Set(stats.neverSeen)]

  // Расчет процентов
  const correctPercent = Math.round((uniqueCorrect.length / total) * 100) || 0
  const incorrectPercent =
    Math.round((uniqueIncorrect.length / total) * 100) || 0
  const neverSeenPercent =
    Math.round((uniqueNeverSeen.length / total) * 100) || 0

  // Вспомогательная функция для генерации кликабельных бейджей
  const generateBadgesHTML = (indexesArray, bgClass, dataTypeKeyStorage) => {
    if (indexesArray.length === 0)
      return '<p class="text-width small mb-0 ps-2">Список пуст</p>'
    return indexesArray
      .map(index => {
        return `<span class="badge ${bgClass} me-2 mb-2 stats-question-badge" data-keystorage="${dataTypeKeyStorage}" data-index="${index}">№${
          index + 1
        }</span>`
      })
      .join('')
  }

  // 2. Рендерим основную карточку (Добавлена кнопка очистки во флекс-контейнер заголовка)
  resultsContainer.innerHTML = `
    <div class="card bg-dark text-light border border-secondary shadow p-4 w-100 my-3">
      <div class="card-body p-0">
        
        <!-- Заголовок статистики с кнопкой очистки -->
        <h4 class="fw-bold mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>📊 Статистика: ${testName}</span>
          <div class="d-flex flex-wrap align-items-center gap-2">

            <button class="btn btn-outline-warning btn-sm d-inline-flex align-items-center fw-semibold px-2 py-1" id="btnRepairStats" title="Починить базу данных">
              <svg xmlns="http://w3.org" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="me-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Починить базу</span>
            </button>


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
                <div class="d-flex flex-wrap">${generateBadgesHTML(
                  uniqueIncorrect,
                  'bg-danger',
                  'incorrect'
                )}</div>
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
                <div class="d-flex flex-wrap">${generateBadgesHTML(
                  uniqueCorrect,
                  'bg-success',
                  'correct'
                )}</div>
              </div>
            </div>
          </div>

          <div class="accordion-item bg-dark text-light border-0">
            <h2 class="accordion-header">
              <button class="accordion-button bg-dark text-light collapsed shadow-none fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSaveList">
                💾 Сохраненные вопросы (${uniqueSaveList.length})
              </button>
            </h2>
            <div id="collapseSaveList" class="accordion-collapse collapse" data-bs-parent="#statsAccordion">
              <div class="accordion-body bg-dark border-top border-secondary">
                <div class="d-flex flex-wrap">${generateBadgesHTML(
                  uniqueSaveList,
                  'bg-secondary',
                  'saveList'
                )}</div>
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
                <div class="d-flex flex-wrap">${generateBadgesHTML(
                  uniqueNeverSeen,
                  'bg-secondary',
                  'neverSeen'
                )}</div>
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
          <div class="modal-header border-secondary d-flex justify-content-between align-items-center">  
            <h5 class="modal-title text-center" id="modalQuestionTitle">Просмотр вопроса</h5>

            <div class="d-flex justify-content-between gap-3">
                    ${UICopyQuestion()}
              <button class="btn btn-outline-danger btn-sm d-inline-flex align-items-center fw-semibold px-2 py-1" id="btnDelateStorage" title="Удалить сохранение">
                <svg xmlns="http://w3.org" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg> 
              </button>
      
              <button type="button" class="btn-close btn-close-white shadow-none m-0" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <div class="modal-body" id="modalQuestionBody"></div>
        </div>
      </div>
    </div>
  `

  // 3. Обработчик клика по кнопке "Сбросить"
  const btnClearStats = resultsContainer.querySelector('#btnClearStats')
  btnClearStats.addEventListener('click', () => {
    const isConfirmed = confirm(
      `Вы уверены, что хотите полностью сбросить статистику для теста "${nameStorage}"? Изменения нельзя будет отменить.`
    )

    if (isConfirmed) {
      localStorage.removeItem(nameStorage) // Удаляем ключ из памяти браузера
      renderStats(mainquestions, nameStorage) // Перерисовываем интерфейс с чистыми значениями
    }
  })

  // 4. Логика открытия модального окна при клике на номер вопроса
  const accordionBody = resultsContainer.querySelector('#statsAccordion')

  if (accordionBody) {
    accordionBody.addEventListener('click', event => {
      // Ищем клик именно по бейджу вопроса
      const badge = event.target.closest('.stats-question-badge')
      if (!badge) return

      const keystorage = badge.dataset.keystorage // "correct", "incorrect" или "neverSeen"
      const currentTargetIndex = parseInt(badge.dataset.index, 10) // Реальный ID вопроса в JSON (0, 1, 2...)

      // ОЧИСТКА СОБЫТИЙ КНОПКИ УДАЛЕНИЯ (Клонируем кнопку, чтобы убрать старые addEventListener)
      let oldBtn = document.querySelector('#btnDelateStorage')
      if (!oldBtn) return

      let btnDelateStorage = oldBtn.cloneNode(true)
      oldBtn.parentNode.replaceChild(btnDelateStorage, oldBtn)

      // Настройка видимости кнопки удаления
      if (keystorage === 'neverSeen') {
        btnDelateStorage.disabled = true
        btnDelateStorage.classList.remove('d-inline-flex')
        btnDelateStorage.classList.add('d-none')
      } else {
        btnDelateStorage.disabled = false
        btnDelateStorage.classList.remove('d-none')
        btnDelateStorage.classList.add('d-inline-flex')
      }

      // ЛОГИКА УДАЛЕНИЯ ПРИ КЛИКЕ (Сработает строго 1 раз)
      btnDelateStorage.addEventListener('click', () => {
        // 1. Получаем самый свежий объект из localStorage через вашу функцию getStorage
        let statsStorage = getStorage(total, nameStorage)

        // 2. Ищем, на каком месте находится этот вопрос в конкретном массиве localStorage
        const indexInStorageArray =
          statsStorage[keystorage].indexOf(currentTargetIndex)

        if (indexInStorageArray !== -1) {
          // 3. Вырезаем элемент из массива
          statsStorage[keystorage].splice(indexInStorageArray, 1)

          // 4. Если мы удалили вопрос из ошибок/правильных, его нужно вернуть в "не пройденные"
          if (
            keystorage !== 'neverSeen' &&
            !statsStorage.neverSeen.includes(currentTargetIndex)
          ) {
            statsStorage.neverSeen.push(currentTargetIndex)
            statsStorage.neverSeen.sort((a, b) => a - b) // Сортируем для порядка
          }

          // 5. Сохраняем обновленный объект в память
          localStorage.setItem(nameStorage, JSON.stringify(statsStorage))
          console.log(
            `🗑️ Вопрос №${
              currentTargetIndex + 1
            } успешно удален из категории "${keystorage}"`
          )

          // 6. Закрываем модалку и полностью перерисовываем статистику, чтобы обновить циферки на экране
          const currentModal = bootstrap.Modal.getInstance(
            document.getElementById('statsQuestionModal')
          )
          if (currentModal) currentModal.hide()

          renderStats(mainquestions, nameStorage)
        }
      })

      // --- НАВИГАЦИЯ ВНУТРИ МОДАЛКИ (ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ) ---
      const parentCollapse = badge.closest('.accordion-collapse')
      if (!parentCollapse) return

      const groupBadges = Array.from(
        parentCollapse.querySelectorAll('.stats-question-badge')
      )
      const activeGroupIndexes = groupBadges.map(b =>
        parseInt(b.dataset.index, 10)
      )
      let currentPositionInGroup =
        activeGroupIndexes.indexOf(currentTargetIndex)

      const modalElement = document.getElementById('statsQuestionModal')
      const myModal = new bootstrap.Modal(modalElement)
      const modalBody = document.getElementById('modalQuestionBody')

      function updateModalContent () {
        const itemIndex = activeGroupIndexes[currentPositionInGroup]
        const item = mainquestions[itemIndex]

        if (!item) return

        const optionsHtml = item.options
          .map((option, index) => {
            const isCorrectStyle = option.isCorrect
              ? 'text-success fw-bold'
              : 'text-white opacity-75'
            return `<p class="mb-1 ${isCorrectStyle}"><b class="me-2">${
              index + 1
            }:</b>${option.text}</p>`
          })
          .join('')

        modalBody.innerHTML = `
          <h5 class="text-light mb-3 lh-base">
            <span class="badge bg-primary me-2">Вопрос №${itemIndex + 1}</span> 
            ${item.title}
          </h5>
          <div class="options-list my-3 ps-2 border-start border-secondary d-flex flex-column gap-2">
            ${optionsHtml}
          </div> 
          <div class="alert alert-info border-0 bg-info bg-opacity-10 mt-3 mb-4">
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

          <div class="d-flex justify-content-between align-items-center border-top border-secondary pt-3 mt-3">
            <button class="btn btn-outline-light btn-sm px-3 fw-semibold" id="btnModalPrev" ${
              currentPositionInGroup === 0 ? 'disabled' : ''
            }>
              ← Назад
            </button>
            <span class="text-white small">Вопрос ${
              currentPositionInGroup + 1
            } из ${activeGroupIndexes.length}</span>
            <button class="btn btn-outline-light btn-sm px-3 fw-semibold" id="btnModalNext" ${
              currentPositionInGroup === activeGroupIndexes.length - 1
                ? 'disabled'
                : ''
            }>
              Вперед →
            </button>
          </div>
        `

        document
          .getElementById('btnModalPrev')
          .addEventListener('click', () => {
            if (currentPositionInGroup > 0) {
              currentPositionInGroup--
              updateModalContent()
            }
          })

        document
          .getElementById('btnModalNext')
          .addEventListener('click', () => {
            if (currentPositionInGroup < activeGroupIndexes.length - 1) {
              currentPositionInGroup++
              updateModalContent()
            }
          })

        UXCopyQuestion({
          title: item.title,
          correctAnswer: item.correctAnswer
        })
      }

      updateModalContent()
      myModal.show()
    })
  }

  // ВРЕМЕННАЯ ФУНКЦИЯ: Восстановление потерянных индексов в neverSeen
  const btnRepairStats = resultsContainer.querySelector('#btnRepairStats')
  if (btnRepairStats) {
    btnRepairStats.addEventListener('click', () => {
      // Загружаем текущие данные из localStorage
      let statsStorage = getStorage(total, nameStorage)

      // Защита от отсутствия структуры
      if (!statsStorage.correct) statsStorage.correct = []
      if (!statsStorage.incorrect) statsStorage.incorrect = []
      if (!statsStorage.neverSeen) statsStorage.neverSeen = []

      let repairedCount = 0

      // Проверяем абсолютно все индексы вопросов от 0 до конца JSON
      for (let i = 0; i < total; i++) {
        const inCorrect = statsStorage.correct.includes(i)
        const inIncorrect = statsStorage.incorrect.includes(i)
        const inNeverSeen = statsStorage.neverSeen.includes(i)

        // Если индекса нет ни в одной из рабочих категорий
        if (!inCorrect && !inIncorrect) {
          // И его забыли добавить в neverSeen
          if (!inNeverSeen) {
            statsStorage.neverSeen.push(i)
            repairedCount++
          }
        }
      }

      if (repairedCount > 0) {
        // Сортируем массив непрочитанных по порядку [0, 1, 2...]
        statsStorage.neverSeen.sort((a, b) => a - b)

        // Сохраняем починенный объект в localStorage
        localStorage.setItem(nameStorage, JSON.stringify(statsStorage))

        alert(
          `🔧 База данных успешно восстановлена! Найдено и возвращено в "Не пройденные" вопросов: ${repairedCount}.`
        )

        // Перерисовываем экран статистики с новыми правильными данными
        renderStats(mainquestions, nameStorage)
      } else {
        alert(
          '✅ Ваша база данных в полном порядке! Потерянных вопросов не обнаружено.'
        )
      }
    })
  }
}

export default renderStats
