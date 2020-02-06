//The code in this file is based off code from Stephen Grider's udemy course available at https://www.udemy.com/course/javascript-beginners-complete-tutorial/

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  fetchData
}) => {
  root.innerHTML = `
  <div class="form-group">
  <label for="stockInput"><b>Search</b></label>
  <div class="ml-3 d-none inline-display text-danger" id="noResultsError">The ticker or stock name that has been entered has not returned results</div>
  <input class="form-control" id="stockInput" type="text" placeholder="Start typing a stock name or ticker">
  </div>
  <div class="dropdown">
  <div class="dropdown-menu" id="results">
  </div>
</div>
`;

  const input = root.querySelector("input");
  const resultsWrapper = root.querySelector("#results");

  const onInput = async event => {
    if (event.target.value !== "") {
      document.querySelector("#noResultsError").classList.add("d-none");
      const items = await fetchData(event.target.value);
      if (items.length !== 0) {
        resultsWrapper.innerHTML = "";
        $(resultsWrapper).show();
        for (let item of items) {
          const option = document.createElement("a");

          option.classList.add("dropdown-item");
          option.innerHTML = renderOption(item);
          option.addEventListener("click", () => {
            $(resultsWrapper).hide();
            input.value = "";
            onOptionSelect(item);
          });

          resultsWrapper.appendChild(option);
        }
      } else {
        document.querySelector("#noResultsError").classList.remove("d-none");
      }
    }
  };
  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", event => {
    if (!root.contains(event.target)) {
      $(resultsWrapper).hide();
    }
  });
};
