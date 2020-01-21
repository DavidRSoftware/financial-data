const tickerInput = document.querySelector("#ticker");
const submitButton = document.querySelector("#submitButton");
const table = document.querySelector("#table");
let count = 1;
submitButton.addEventListener("click", e => {
  e.preventDefault();
  if (tickerInput.value.trim()) {
    const newRow = document.createElement("tr");
    //Stock ID
    let newData = document.createElement("td");
    let newNameData = document.createElement("td");
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
    newData = document.createElement("td");
    getStockPrice(tickerInput.value, newData, newNameData, newRow);
    newRow.append(newData);
    //Created Date Time
    newData = document.createElement("td");
    newData.innerText = new Date().toLocaleDateString();
    newRow.append(newData);
    //Created Time
    newData = document.createElement("td");
    newData.innerText = new Date().toLocaleTimeString();
    newRow.append(newData);
    //Remove Button
    newData = document.createElement("td");
    newButton = document.createElement("btn");
    newButton.className = "btn btn-secondary";
    newButton.innerText = "Remove";
    newButton.addEventListener("click", () => {
      newRow.remove();
    });
    newData.append(newButton);
    newRow.append(newData);
    table.append(newRow);
  }
  tickerInput.value = "";
});

tickerInput.addEventListener("input", ()=>{
    tickerInput.classList.remove("is-invalid");
});

getStockPrice = (stock, priceElement, nameElement, newRow) => {
  axios
    .all([
      axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=ZN5KRTN6P1U4FJH4`
      ),
      axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stock}&apikey=ZN5KRTN6P1U4FJH4`
      )
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
