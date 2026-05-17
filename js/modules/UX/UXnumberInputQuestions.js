// Добавили аргумент onIndexChange в конец параметров
function UXnumberInputQuestions(containerElement, currentValue, maxLength, onIndexChange) {
  const minus = containerElement.querySelector(".btn-minus-questions");
  const plus = containerElement.querySelector(".btn-plus-questions");
  const input = containerElement.querySelector(".input-number-questions");

  let count = currentValue;
  input.value = count;

  function updateValue(newValue) {
    count = Math.max(0, Math.min(maxLength, newValue));
    input.value = count;

    // Вызываем колбэк и передаем измененный индекс обратно в главный файл
    if (typeof onIndexChange === "function") {
      onIndexChange(count);
    }
  }

  minus.addEventListener('click', () => updateValue(count - 1));
  plus.addEventListener('click', () => updateValue(count + 1));
  
  input.addEventListener('blur', () => {
    let userValue = parseInt(input.value, 10);
    // Защита от пустого ввода или букв
    if (isNaN(userValue)) return; 
    updateValue(userValue);
  }); 
}

export default UXnumberInputQuestions;
