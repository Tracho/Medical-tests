export default function UXCopyQuestionSearch(questions, container = document) {
  container.querySelectorAll(".btn-copy-question").forEach(btn => {

    btn.addEventListener("click", async () => {
      const questionId = Number(btn.dataset.questionId);
      const question = questions[questionId];

      if (!question) return;

      const textToCopy = `
Вопрос:
${question.title}

Правильный ответ:
${question.correctAnswer}
      `.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);

        btn.classList.remove("btn-outline-success");
        btn.classList.add("btn-success");

        setTimeout(() => {
          btn.classList.remove("btn-success");
          btn.classList.add("btn-outline-success");
        }, 1000);

      } catch (error) {
        console.error(error);
      }
    });

  });
}