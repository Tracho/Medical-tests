function UIresultСounter(correct ,incorrect) {
  return (`
                <div class="d-flex flex-wrap gap-2  p-2 bg-dark rounded text-light">
              <span class="fs-6 fw-semibold">Результаты:</span>
              <div class="d-flex gap-3">
              <span class="badge bg-success d-inline-flex align-items-center px-2.5 py-1.5" id="badgeCorrect">
                Правильных: ${correct}
              </span>
              <span class="badge bg-danger d-inline-flex align-items-center px-2.5 py-1.5" id="badgeWrong">
                Неправильных: ${incorrect}
              </span>
              </div>
            </div>
    ` );
}

export default UIresultСounter;