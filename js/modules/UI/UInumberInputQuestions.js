function UInumberInputQuestions(thisLength, maxLength) {
  let randomId = Math.floor(Math.random() * (10000 + 1));
  return (`
    <div class="questions-counter-container" style="max-width:300px"> <!-- Добавили класс-обертку -->
      <label onclick="navigator.vibrate?.(30)" class="form-label text-center d-flex flex-column gap-2">Номер вопроса.
      <div class="input-group">
        <button onclick="navigator.vibrate?.(30)" class="input-group-text btn btn-outline-light btn-minus-questions"> <!-- Класс вместо id -->
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 21px; height: 21px;" viewBox="0 0 512 512">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="32" d="M400 256H112" />
                </svg>
              </button> 
<input id="${randomId}" type="number" class="form-control input-number-questions" min="0" max="${maxLength}" value="${thisLength}"> <!-- Класс вместо id -->
        <button onclick="navigator.vibrate?.(30)" class="input-group-text btn btn-outline-light btn-plus-questions"> <!-- Класс вместо id -->
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 21px; height: 21px;"
                  viewBox="0 0 512 512">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="32" d="M256 112v288M400 256H112" />
                </svg>
              </button>
            </div>
          </div>
          </label>
    `);
}

export default UInumberInputQuestions;