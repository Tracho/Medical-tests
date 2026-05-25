function getStorage(mainQuestions_length, nameStorage) {
  // console.log(nameStorage,mainQuestions_length)
  return (JSON.parse(localStorage.getItem(nameStorage)) || {
    correct: [],
    incorrect: [],
    neverSeen: Array.from({ length: mainQuestions_length }, (_, i) => i),
    saveList: [],
  });
}

export default getStorage;