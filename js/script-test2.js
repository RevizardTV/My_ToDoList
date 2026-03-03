//variables
let throttleTimeout=null;
//Node Linkers
console.log("TEST");
const inputBox=document.getElementById("setInput");
const listGroup=document.getElementById("setListGroup");
const LSCHECK=document.getElementById("consoleCheck");
const taskAdder=document.getElementById("taskAdder");
const deleteAll=document.getElementById('DeleteAll');
//Functions
const consoleCheck=()=>{
    console.log(localStorage.getItem("myToDoList"));
}

const addToList=(taskName,isCompleted=false)=>{
    const newTask=document.createElement('li');
    
    const checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.classList.add("complete-btn");
    if(isCompleted){
        checkbox.checked=isCompleted;
        newTask.classList.add("completed");
    }

    const textSpan=document.createElement('span');
    textSpan.innerText=taskName;

    const remover=document.createElement('button');
    remover.innerText='X';
    remover.classList.add('remove-btn');

    newTask.appendChild(checkbox);
    newTask.appendChild(textSpan);
    newTask.appendChild(remover);
    newTask.setAttribute('draggable',true);
    newTask.classList.add("taskItemSelectable");
    newTask.setAttribute("name","task-item-data");
    listGroup.appendChild(newTask);
    saveToLocalStorage();
}
//Heavy Functions
const getDragAfterElement=(container,y)=>{
    const movingElements=[...container.querySelectorAll(".taskItemSelectable:not(.dragging)")];
    return movingElements.reduce((closest,current)=>{
        const box=current.getBoundingClientRect();
        const offset=y-box.top-box.height/2;
        if(offset<0 && offset>closest.offset){
            return {offset:offset,element:current};
        }
        else{
            return closest;
        }},{offset:Number.NEGATIVE_INFINITY}).element;
}
//Saving Functions
const saveToLocalStorage=()=>{
    const tasks=[];
    const totalTasks=document.querySelectorAll('.taskItemSelectable');
    totalTasks.forEach((li)=>{
        tasks.push({taskName:li.querySelector('span').innerText,
            taskDone:li.querySelector('input[type="checkbox"]').checked
        })
    })
    localStorage.setItem('myToDoList',JSON.stringify(tasks));
    }
const loadToLocalStorage=()=>{
    const savedTasks=JSON.parse(localStorage.getItem('myToDoList'));
    savedTasks.forEach((task)=>{
        addToList(task.taskName,task.taskDone);
    })
}
//EventListeners
taskAdder.addEventListener('click',(task)=>{
    task.preventDefault();
    const tasked=inputBox.value;
    if(tasked){
        addToList(tasked);
        inputBox.value="";
    }
})

DeleteAll.addEventListener('click',()=>{
    const allTasks=document.getElementsByName("task-item-data");
    allTasks.forEach(li=>{
        li.remove();
    })
    if(allTasks!=[])listGroup.querySelector('li').remove();
    console.log(allTasks);
    saveToLocalStorage();
})

listGroup.addEventListener('click',(item)=>{
    if(item.target.classList.contains('complete-btn')){
        item.target.parentElement.classList.toggle('completed');
        saveToLocalStorage();
    }
    if(item.target.classList.contains('remove-btn')){
        item.target.parentElement.remove();
        saveToLocalStorage();
    }
})

listGroup.addEventListener('dragstart',(item)=>{
    if(item.target.classList.contains("taskItemSelectable")){
        item.target.classList.add('dragging');
    }
    
})

listGroup.addEventListener('dragover',(item)=>{
    item.preventDefault();
    if(throttleTimeout) return;
    throttleTimeout=setTimeout(()=>{
    const draggedElement=document.querySelector('.dragging');
    if(!draggedElement)return;
    const afterElement=getDragAfterElement(listGroup,item.clientY);
    if(afterElement===null){
        listGroup.appendChild(draggedElement);
        saveToLocalStorage();
    }
    else{
        listGroup.insertBefore(draggedElement,afterElement);
        saveToLocalStorage();
    }
    throttleTimeout=null;
},16);
})

listGroup.addEventListener('dragend',(item)=>{
    clearTimeout(throttleTimeout);
    throttleTimeout=null;
    if(item.target.classList.contains("taskItemSelectable")){
        item.target.classList.remove('dragging')
    }
})

LSCHECK.addEventListener('click',consoleCheck);
//Function calling
loadToLocalStorage();