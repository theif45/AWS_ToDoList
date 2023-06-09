const urlParams = new URLSearchParams(window.location.search);
const dateString = urlParams.get("date");
console.log(dateString);

class TodoEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoEvent();
        }
        return this.#instance;
    }

    currentFilter = "all";


    addEventTodoAddButton() {
        const todoAddButton = document.querySelector(".todo-add-button");
        const todoAddInput = document.querySelector(".todo-add-input");
        const todoAddHidden = document.querySelector(".todo-add-hidden-blank div");

        todoAddButton.onclick = () => {
            if(todoAddInput.value == '') {
                TodoService.getInstance().blankTodo();
            }else {
                TodoService.getInstance().addTodo();
                todoAddHidden.classList.add("hidden-blank");
                todoAddInput.value = "";
                if(this.currentFilter == "ing"){
                    this.addEventTodoIngClick();
                }

                if(this.currentFilter == "complete"){
                    this.addEventTodoCompleteClick()
                }
            }
        }
    }

    addEventAddTodoKeyUp() {
        const todoAddInput = document.querySelector(".todo-add-input");
        todoAddInput.onkeyup = () => {
            if(window.event.keyCode == 13) {
                const todoAddButton = document.querySelector(".todo-add-button");
                todoAddButton.click();
            } 
        }
    }

    addEventTodoDeleteButton() {
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((deleteButton,index) => {
            deleteButton.onclick = () => {
                TodoService.getInstance().deleteTodo(index);
                if(this.currentFilter == "ing"){
                    this.addEventTodoIngClick();
                }

                if(this.currentFilter == "complete"){
                    this.addEventTodoCompleteClick()
                }
            }
        });
    }

    addEventTodoCheckClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            checkButton.onclick = () => {
                const todoMessages = document.querySelectorAll(".todo-message");
                if(checkButton.checked) {
                    todoMessages[index].style.textDecoration = "line-through";
                    TodoService.getInstance().todoList[index].todoChecked = true;
                    if (this.currentFilter == "ing") {
                        this.addEventTodoIngClick();
                    }
                } else {
                    todoMessages[index].style.textDecoration = "none";
                    TodoService.getInstance().todoList[index].todoChecked = false;
                    if (this.currentFilter == "complete") {
                        this.addEventTodoCompleteClick();
                    }
                }
                localStorage.setItem(TodoService.getInstance().dateString, JSON.stringify(TodoService.getInstance().todoList));
                ShowCount.getInstance().updateCheckedCount();
                this.addEventTodoCountClick();
            }
        });
    }

    addEventTodoAllClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            todoCheckMessages[index].style.display = "flex";
            if(checkButton.checked) {
                todoMessages[index].style.textDecoration = "line-through";
                TodoService.getInstance().todoList[index].todoChecked = true;
            } else {
                todoMessages[index].style.textDecoration = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            }
            localStorage.setItem(TodoService.getInstance().dateString, JSON.stringify(TodoService.getInstance().todoList));

        });
    }

    addEventTodoIngClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            if(checkButton.checked) {
                todoCheckMessages[index].style.display = "none";
                TodoService.getInstance().todoList[index].todoChecked = true;
            } else {
                todoCheckMessages[index].style.display = "flex";
                todoMessages[index].style.textDecoration = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            }
            localStorage.setItem(TodoService.getInstance().dateString, JSON.stringify(TodoService.getInstance().todoList));
        });
    }

    addEventTodoCompleteClick() {
        const checkButtons = document.querySelectorAll(".todo-check");
        checkButtons.forEach((checkButton,index) => {
            const todoMessages = document.querySelectorAll(".todo-message");
            const todoCheckMessages = document.querySelectorAll(".todo-check-message");
            if(!checkButton.checked) {
                todoCheckMessages[index].style.display = "none";
                TodoService.getInstance().todoList[index].todoChecked = false;
            } else {
                todoCheckMessages[index].style.display = "flex";
                todoMessages[index].style.textDecoration = "line-through";
                TodoService.getInstance().todoList[index].todoChecked = true;
            }
            localStorage.setItem(TodoService.getInstance().dateString, JSON.stringify(TodoService.getInstance().todoList));
        });
    }


    addEventTodoCountClick() {
        const todoCountAll = document.querySelector(".todo-count-all");
        todoCountAll.onclick = () => {
            this.currentFilter = "all";
            this.addEventTodoAllClick();
            TodoService.getInstance().clickedButtonColor();
        }

        const todoCountIng = document.querySelector(".todo-count-ing");
        todoCountIng.onclick = () => {
            this.currentFilter = "ing";
            this.addEventTodoIngClick();
            TodoService.getInstance().clickedButtonColor();
        }

        const todoCountComplete = document.querySelector(".todo-count-complete");
        todoCountComplete.onclick = () => {
            this.currentFilter = "complete";
            this.addEventTodoCompleteClick();
            TodoService.getInstance().clickedButtonColor();
        }
    }

    addEventClearCompleteButton() {
        const clearCompleteButton = document.querySelector(".clear-complete-button");
        clearCompleteButton.onclick = () => {
            TodoService.getInstance().checkedDeleteTodo();
            if(this.currentFilter == "ing"){
                this.addEventTodoIngClick();
            }

            if(this.currentFilter == "complete"){
                this.addEventTodoCompleteClick()
            }
        }
    }
}

class TodoService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoService(dateString);
        }
        return this.#instance;
    }
    todoList = null;
    

    constructor(dateString) {
        this.dateString = dateString;

        if(localStorage.getItem(this.dateString) == null) {
            this.todoList = new Array();
        } else {
            this.todoList = JSON.parse(localStorage.getItem(this.dateString));
        }
        this.viewDate(dateString);
        this.loadTodoList();
    }

    blankTodo() {
        const todoAddHidden = document.querySelector(".todo-add-hidden-blank div");
        if(todoAddHidden.classList.contains("hidden-blank")) {
            todoAddHidden.classList.remove("hidden-blank");
        }
    }
    
    addTodo() {
        const startTime = document.querySelector(".start-time");
        const lastTime = document.querySelector(".last-time");
        const todoAddInput = document.querySelector(".todo-add-input");
        const todoObj = {
            todoContent: todoAddInput.value,
            todoChecked: false,
            startTime: startTime.value,
            lastTime: lastTime.value,
        };
        this.todoList.push(todoObj);
        localStorage.setItem(this.dateString, JSON.stringify(this.todoList));
        this.loadTodoList();
    }

    deleteTodo(deleteIndex) {
        this.todoList.splice(deleteIndex,1);
        localStorage.setItem(this.dateString, JSON.stringify(this.todoList));
        this.loadTodoList()
    }

    loadTodoList() {
        const todoCheckList = document.querySelector(".todo-check-list");
        todoCheckList.innerHTML = ``;
        this.todoList.forEach(todoObj => {
            const checkedStatus = todoObj.todoChecked ? "checked" : "";
            const decorationStatus = todoObj.todoChecked? "line-through" : "none";
            todoCheckList.innerHTML += `
                <li class="todo-check-message">
                    <input type="checkbox" class="todo-check" ${checkedStatus}>
                    <div class="todo-message" style="text-decoration: ${decorationStatus};">
                        ${todoObj.todoContent}
                        <div class="time-view">
                            <div class="start-time-view">시작시간: ${todoObj.startTime}</div>
                            <div class="last-time-view">마감시간: ${todoObj.lastTime}</div>
                        </div>
                    </div>
                    <button class="delete-button">❌</button>
                </li>
            `;
            
        });
        TodoEvent.getInstance().addEventTodoDeleteButton();
        TodoEvent.getInstance().addEventTodoCheckClick();
        ShowCount.getInstance().updateCheckedCount();
        ShowCount.getInstance().totalCount(this.todoList.length);
        TodoEvent.getInstance().addEventTodoCountClick();
    }

    clickedButtonColor() {
        const todoCountAll = document.querySelector(".todo-count-all");
        const todoCountIng = document.querySelector(".todo-count-ing");
        const todoCountComplete = document.querySelector(".todo-count-complete");
        if(TodoEvent.getInstance().currentFilter === "all") {
            todoCountAll.classList.add('clicked');
            todoCountIng.classList.remove('clicked');
            todoCountComplete.classList.remove('clicked');
        }
        if(TodoEvent.getInstance().currentFilter === "ing") {
            todoCountIng.classList.add('clicked');
            todoCountAll.classList.remove('clicked');
            todoCountComplete.classList.remove('clicked');
        }
        if(TodoEvent.getInstance().currentFilter === "complete") {
            todoCountComplete.classList.add('clicked');
            todoCountIng.classList.remove('clicked');
            todoCountAll.classList.remove('clicked');
        }

    }

    viewDate(dateString) {
        const mainHeader = document.querySelector(".main-header");
        mainHeader.innerHTML = `
            <div class="date">${dateString}</div>
            ${mainHeader.innerHTML}
        `;
    } 

    checkedDeleteTodo() {
        const newTodoList = this.todoList.filter((todoObj) => {
            return todoObj.todoChecked === false;
        });
        this.todoList = newTodoList;
        localStorage.setItem(this.dateString, JSON.stringify(this.todoList));
        this.loadTodoList();
    }
}

class ShowCount {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new ShowCount();
        }
        return this.#instance;
    }

    totalCount(length) {
        const all = document.querySelector(".all");
        all.innerHTML = `
            <button class="todo-count-all">전체:${length}</button>
        `
    }

    updateCheckedCount() {
        const checkButtons = document.querySelectorAll(".todo-check");
        const complete = document.querySelector(".complete");
        const ing = document.querySelector(".ing");
        let checkedCount = 0;
        let uncheckedCount = 0;
        if(checkButtons.length == 0) {
            ing.innerHTML = `
                <button class="todo-count-ing">진행중:${uncheckedCount}</button>
            `;
            complete.innerHTML = `
                <button class="todo-count-complete">완료:${checkedCount}</button>
            `;
        }
        checkButtons.forEach((checkButton) => {
            if (checkButton.checked) {
                checkedCount++;
                complete.innerHTML = `
                    <button class="todo-count-complete">완료:${checkedCount}</button>
                `;
                if(uncheckedCount == 0) {
                    ing.innerHTML = `
                    <button class="todo-count-ing">진행중:${uncheckedCount}</button>
                `;
                }
            } else {
                uncheckedCount++;
                ing.innerHTML = `
                <button class="todo-count-ing">진행중:${uncheckedCount}</button>
                `;
                if(checkedCount == 0) {
                    complete.innerHTML = `
                    <button class="todo-count-complete">완료:${checkedCount}</button>
                `;
                }
            }
        });
    }
}