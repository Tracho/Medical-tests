function UICopyQuestion(id = "") {
  let thisId = (id === ""? "btnCopyStorage" : `btnCopyStorage-${id}`);
  return `
    <button onclick="navigator.vibrate?.(30)"
      class="btn btn-outline-success btn-sm d-inline-flex align-items-center fw-semibold px-2 py-1 btn-copy-question"
      id="${thisId}"
      title="Скопировать вопрос и ответ"
      data-question-id="${id}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="ionicon" viewBox="0 0 512 512">
        <rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
        <path d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
      </svg>
    </button>
  `;
}

export default UICopyQuestion;