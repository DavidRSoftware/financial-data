let count = 1;
//keeps track of the stocks that are added so that the same stock cannot be added twice
let listOfStockTickers = [];

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
      if (res.data["Global Quote"] === undefined)
        throw new Error(
          "The API's limit of 5 API calls per minute has been reached"
        );
      priceElement.innerText = res.data["Global Quote"]["05. price"];
    })
    .catch(err => {
      console.error(err);
      document.querySelector("#errorDisplay").innerHTML = err.message;
    });
};

createAutoComplete({
  renderOption(stock) {
    return `
            <div class="defaultCursor">${stock["2. name"]}</div>
          `;
  },
  fetchData(searchTerm) {
    return axios.get("https://www.alphavantage.co/query", {
      params: {
        apikey: "ZN5KRTN6P1U4FJH4",
        function: "SYMBOL_SEARCH",
        keywords: searchTerm
      }
    });
  },
  root: document.querySelector("#autocomplete"),
  onOptionSelect(stock) {
    onStockSelect(
      stock["1. symbol"],
      stock["2. name"],
      document.querySelector("#table")
    );
  }
});

const onStockSelect = (stockTicker, stockName, summaryElement) => {
  axios
    .get("https://www.alphavantage.co/query", {
      params: {
        apikey: "ZN5KRTN6P1U4FJH4",
        function: "GLOBAL_QUOTE",
        symbol: stockTicker
      }
    })
    .then(response => {
      if (response.data["Global Quote"] === undefined)
        throw new Error(
          "The API's limit of 5 API calls per minute has been reached"
        );
      else if (
        listOfStockTickers.includes(response.data["Global Quote"]["01. symbol"])
      )
        throw new Error(
          `${stockName} is already included in your list of stocks.`
        );
      listOfStockTickers.push(response.data["Global Quote"]["01. symbol"]);
      updateTable(response.data["Global Quote"], stockName, summaryElement);
    })
    .catch(err => {
      console.log(err);
      document.querySelector("#errorDisplay").innerHTML = err.message;
    });
};

const updateTable = (stockDetail, stockName, table) => {
  let newRow = document.createElement("tr");
  let newData = document.createElement("td");
  let newPriceData = document.createElement("td");
  let newUpdatedDate = document.createElement("td");
  let newUpdatedTime = document.createElement("td");
  let newUpdateButton = document.createElement("btn");
  let newRemoveButton = document.createElement("btn");
  //Stock ID
  newData.innerText = count;
  count++;
  newRow.append(newData);
  //Ticker
  newData = document.createElement("td");
  newData.innerText = stockDetail["01. symbol"];
  newRow.append(newData);
  //Stock Name
  newData = document.createElement("td");
  newData.innerText = stockName;
  newRow.append(newData);
  //Stock Price
  newPriceData.innerText = stockDetail["05. price"];
  newRow.append(newPriceData);
  //Created Date
  newData = document.createElement("td");
  newData.innerText = new Date().toLocaleDateString();
  newRow.append(newData);
  //Created Time
  newData = document.createElement("td");
  newData.innerText = new Date().toLocaleTimeString();
  newRow.append(newData);
  //Updated Date
  newRow.append(newUpdatedDate);
  //Updated Time
  newRow.append(newUpdatedTime);
  //Update Button
  newData = document.createElement("td");
  newUpdateButton.className = "btn btn-primary";
  newUpdateButton.innerText = "Update";
  newUpdateButton.addEventListener("click", () => {
    let stockTicker = stockDetail["01. symbol"];
    getStockPrice(stockTicker, newPriceData);
    newUpdatedDate.innerText = new Date().toLocaleDateString();
    newUpdatedTime.innerText = new Date().toLocaleTimeString();
  });
  newData.append(newUpdateButton);
  newRow.append(newData);
  //Remove Button
  newData = document.createElement("td");
  newRemoveButton.className = "btn btn-secondary";
  newRemoveButton.innerText = "Remove";
  newRemoveButton.addEventListener("click", () => {
    listOfStockTickers = listOfStockTickers.filter(
      e => e !== stockDetail["01. symbol"]
    );
    newRow.remove();
  });
  newData.append(newRemoveButton);
  newRow.append(newData);
  table.append(newRow);
};
