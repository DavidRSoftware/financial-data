

window.addEventListener("load", () => {
    $("#welcomeModal").modal();
});
class TableForm {
    constructor(editButton, removeButton){
        this.editButton = editButton;
        this.removeButton = removeButton;
        this.editButton.addEventListener('click', this.edit);
        this.removeButton.addEventListener('click', this.remove);
    }

    edit = () =>{
        console.log("edit clicked");
        
    }

    remove = () =>{
        console.log("remove clicked");
        
    }
}

const tickerInput = document.querySelector("#ticker");
const nameInput = document.querySelector("#name");
const submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", (e)=>{
    e.preventDefault();
});

const editButton = document.querySelector("#edit");
const removeButton = document.querySelector("#remove");
const form = new TableForm(editButton, removeButton);