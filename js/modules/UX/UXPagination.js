function UXPagination(containerElement, onIndexChange) {
  const items = containerElement.querySelectorAll(".pagination-item");

  items.forEach(item => {
    item.addEventListener("click", () => {
      const targetIndex = parseInt(item.dataset.index, 10);
      
      if (typeof onIndexChange === "function") {
        onIndexChange(targetIndex);
      }
    });
  });
}

export default UXPagination;
