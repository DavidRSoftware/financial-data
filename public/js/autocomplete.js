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
  <div class="ml-3 inline-display text-danger" id="errorDisplay"></div>
  <input class="form-control" id="stockInput" type="text" placeholder="Start typing a stock name or ticker">
  </div>
  <div class="dropdown">
  <div class="dropdown-menu" id="results">
  </div>
</div>
`;

  const input = root.querySelector("input");
  const resultsWrapper = root.querySelector("#results");

  const onInput = event => {
    if (event.target.value !== "") {
      document.querySelector("#errorDisplay").innerHTML = "";
      fetchData(event.target.value)
        .then(response => {
          let items = response.data.bestMatches;
          if (response.data.bestMatches === undefined)
            throw new Error(
              "The API's limit of 5 API calls per minute has been reached"
            );
          else if (items.length === 0) {
            throw new Error(
              "The ticker or stock name that has been entered has not returned results"
            );
          }
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
        })
        .catch(err => {
          console.log(err);
          document.querySelector("#errorDisplay").innerHTML = err.message;
        });
    }
  };
  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", event => {
    if (!root.contains(event.target)) {
      $(resultsWrapper).hide();
    }
  });
};
