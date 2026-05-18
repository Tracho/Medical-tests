function useBtn() {
  let BTNS = document.querySelectorAll(".useBtn");
  BTNS.forEach((btn) => {
    btn.addEventListener('click', () => {
      BTNS.forEach((e) => { e.classList.replace("btn-light", "btn-outline-light"); e.disabled = false; });
      const hasFirstClass = btn.classList.contains('btn-outline-light');
      btn.classList.toggle('btn-light', hasFirstClass);
      btn.classList.toggle('btn-outline-light', !hasFirstClass);
      // btn.disabled = true;
    });
  });
}

export default useBtn;