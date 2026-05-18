function UXstartSprintTest(onStart) {
  let divStartSprintTest = document.querySelector("#divStartSprintTest");
  let btnStartGameSpintTest = document.querySelector("#btnStartGameSpintTest");
  let divQuestion = document.querySelector("#divQuestion");
  if (btnStartGameSpintTest) {
    btnStartGameSpintTest.addEventListener("click", () => {
      divQuestion.classList.remove("blur"); // Удаляет размытие
      divStartSprintTest.style.display = "none"; // Прячет стартовое окно 
      if (typeof onStart === "function") {
        onStart(); // Вызываем инструкцию из главного файла
      }
    });
  }
}

 
export default UXstartSprintTest;
