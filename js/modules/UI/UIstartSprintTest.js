function UIstartSprintTest() {
  return (`
    <div id="divStartSprintTest" class="abcenter w-100 h-100 ">
    <div class="w-100 h-100  d-flex justify-content-center align-items-center flex-column gap-3">
      <h1>Начать спринт</h1>
      <button onclick="navigator.vibrate?.(30)" id="btnStartGameSpintTest" class="btn btn-primary px-4 fw-semibold">Старт</button>
    </div>
    </div>
    ` );
}

export default UIstartSprintTest;