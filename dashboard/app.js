let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){
const list = document.getElementById("taskList");
list.innerHTML = "";

tasks.forEach((task, index)=>{
const li = document.createElement("li");

const left = document.createElement("div");

const check = document.createElement("input");
check.type="checkbox";
check.checked=task.done;

check.onchange=()=>{
tasks[index].done = check.checked;
saveTasks();
renderTasks();
}

const text = document.createElement("span");
text.textContent=task.text;

if(task.done) text.classList.add("done");

left.appendChild(check);
left.appendChild(text);

const del = document.createElement("button");
del.textContent="X";
del.onclick=()=>{
tasks.splice(index,1);
saveTasks();
renderTasks();
}

li.appendChild(left);
li.appendChild(del);

list.appendChild(li);
});
}

function addTask(){
const input = document.getElementById("taskInput");
if(input.value==="") return;

tasks.push({text:input.value,done:false});
input.value="";
saveTasks();
renderTasks();
}

const hours = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

const scheduleBody = document.getElementById("scheduleBody");
let scheduleData = JSON.parse(localStorage.getItem("schedule")) || {};

hours.forEach(hour=>{
const row = document.createElement("tr");

const hourCell = document.createElement("td");
hourCell.textContent=hour;
row.appendChild(hourCell);

for(let i=0;i<7;i++){
const td = document.createElement("td");
const input = document.createElement("input");

const key = hour+"-"+i;

input.value = scheduleData[key] || "";

input.oninput=()=>{
scheduleData[key]=input.value;
localStorage.setItem("schedule", JSON.stringify(scheduleData));
}

td.appendChild(input);
row.appendChild(td);
}

scheduleBody.appendChild(row);
});

renderTasks();
