
function UIcheckBox(title="title",idInput) {
  return (
    `
        <div> 
          <input type="checkbox" class="btn-check-style" id="${idInput}" value="${title}" autocomplete="off"> 
          <label class="btn btn-outline-secondary w-100 text-start d-flex align-items-center justify-content-between option-label bgprim" for="${idInput}">
            <div class="d-flex align-items-center gap-3"> 
              <div class="custom-checkbox-box flex-shrink-0"></div>
              <span>${title}</span>
            </div>
          </label>
        </div>
`
  );
}

export default UIcheckBox; 