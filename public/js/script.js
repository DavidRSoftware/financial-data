const tickerInput = document.querySelector("#ticker");
const submitButton = document.querySelector("#submitButton");
const table = document.querySelector("#table");
let count = 1;
const list = []; //add feature so the same stock cannot be added twice
//add feature to print a different error message depending on whether the code is 503 then api limit message
//if because stock does not exist then status will be 200
//possibly better idea is to have the two api one after another and only when the search api call goes through will the stock price call be called
//look at what approach is used in the udemy video

//consider creating html with inner html as opposed to creating so many elements with javascript instead create one as shown in video
submitButton.addEventListener("click", e => {
  e.preventDefault();
  if (tickerInput.value.trim()) {
    const newRow = document.createElement("tr");
    //Stock ID
    let newData = document.createElement("td");
    let newNameData = document.createElement("td");
    let newStockData = document.createElement("td");
    let newUpdateButton = document.createElement("btn");
    let newRemoveButton = document.createElement("btn");
    newData.innerText = count;
    count++;
    newRow.append(newData);
    //Ticker
    newData = document.createElement("td");
    newData.innerText = tickerInput.value.toLowerCase();
    newRow.append(newData);
    //Stock Name
    newNameData.innerText = tickerInput.value.toLowerCase();
    newRow.append(newNameData);
    //Stock Price
    getStockPriceAndName(tickerInput.value, newStockData, newNameData, newRow);
    newRow.append(newStockData);
    //Created Date
    newData = document.createElement("td");
    newData.innerText = new Date().toLocaleDateString();
    newRow.append(newData);
    //Created Time
    newData = document.createElement("td");
    newData.innerText = new Date().toLocaleTimeString();
    newRow.append(newData);
    //Updated Date
    newData = document.createElement("td");
    newRow.append(newData);
    //Updated Time
    newData = document.createElement("td");
    newRow.append(newData);
    //Update Button
    newData = document.createElement("td");
    newUpdateButton.className = "btn btn-primary";
    newUpdateButton.innerText = "Update";
    newUpdateButton.addEventListener("click", () => {
      let tickerInputValue =
        newUpdateButton.parentElement.parentElement.children[1].innerText;
      getStockPrice(tickerInputValue, newStockData);
      newUpdateButton.parentElement.parentElement.children[6].innerText = new Date().toLocaleDateString();
      newUpdateButton.parentElement.parentElement.children[7].innerText = new Date().toLocaleTimeString();
    });
    newData.append(newUpdateButton);
    newRow.append(newData);
    //Remove Button
    newData = document.createElement("td");
    newRemoveButton.className = "btn btn-secondary";
    newRemoveButton.innerText = "Remove";
    newRemoveButton.addEventListener("click", () => {
      newRow.remove();
    });
    newData.append(newRemoveButton);
    newRow.append(newData);
    table.append(newRow);
  }
  tickerInput.value = "";
});

tickerInput.addEventListener("input", () => {
  tickerInput.classList.remove("is-invalid");
});

getStockPrice = (stock, priceElement) => {
  axios
    .get("https://www.alphavantage.co/query", {
      params: {
        apikey: "ZN5KRTN6P1U4FJH4",
        function: "GLOBAL_QUOTE",
        symbol: stock
      }
    })
    .then(res => {
      priceElement.innerText = res.data["Global Quote"]["05. price"];
      tickerInput.classList.remove("is-invalid");
    })
    .catch(err => {
      console.error(err);
      tickerInput.classList.add("is-invalid");
    });
};

getStockPriceAndName = (stock, priceElement, nameElement, newRow) => {
  axios
    .all([
      axios.get("https://www.alphavantage.co/query", {
        params: {
          apikey: "ZN5KRTN6P1U4FJH4",
          function: "GLOBAL_QUOTE",
          symbol: stock
        }
      }),
      axios.get("https://www.alphavantage.co/query", {
        params: {
          apikey: "ZN5KRTN6P1U4FJH4",
          function: "SYMBOL_SEARCH",
          keywords: stock
        }
      })
    ])
    .then(
      axios.spread((price, name) => {
        priceElement.innerText = price.data["Global Quote"]["05. price"];
        nameElement.innerText = name.data["bestMatches"][0]["2. name"];
      })
    )
    .catch(err => {
      console.error(err);
      tickerInput.classList.add("is-invalid");
      newRow.remove();
    });
};
