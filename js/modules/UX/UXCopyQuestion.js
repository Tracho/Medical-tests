export default function UXCopyQuestion(question) {
  const btnCopyStorage = document.querySelector("#btnCopyStorage");

  if (!btnCopyStorage) return;

  // удаляем старый обработчик
  const newBtn = btnCopyStorage.cloneNode(true);
  btnCopyStorage.parentNode.replaceChild(newBtn, btnCopyStorage);

  newBtn.addEventListener("click", async () => {
    const textToCopy = `
Вопрос:
${question.title}

Правильный ответ:
${question.correctAnswer}
`.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Скопировано");
    } catch (err) {
      console.error("Ошибка копирования", err);
    }
  });
}