// ============================================
// TU CÓDIGO ORIGINAL (GESTIÓN DE TAREAS)
// ============================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const left = document.createElement("div");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;

    check.onchange = () => {
      tasks[index].done = check.checked;
      saveTasks();
      renderTasks();
    }

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.done) text.classList.add("done");

    left.appendChild(check);
    left.appendChild(text);

    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }

    li.appendChild(left);
    li.appendChild(del);

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value === "") return;

  tasks.push({ text: input.value, done: false });
  input.value = "";
  saveTasks();
  renderTasks();
  
  // NUEVO: Notificar cuando se agrega una tarea
  if (Notification.permission === "granted") {
    mostrarNotificacion("✅ Tarea agregada", `"${input.value}" se guardó`);
  }
}

// ============================================
// HORARIO SEMANAL (TU CÓDIGO)
// ============================================

const hours = ["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const scheduleBody = document.getElementById("scheduleBody");
let scheduleData = JSON.parse(localStorage.getItem("schedule")) || {};

hours.forEach(hour => {
  const row = document.createElement("tr");

  const hourCell = document.createElement("td");
  hourCell.textContent = hour;
  row.appendChild(hourCell);

  for (let i = 0; i < 7; i++) {
    const td = document.createElement("td");
    const input = document.createElement("input");

    const key = hour + "-" + i;

    input.value = scheduleData[key] || "";

    input.oninput = () => {
      scheduleData[key] = input.value;
      localStorage.setItem("schedule", JSON.stringify(scheduleData));
    }

    td.appendChild(input);
    row.appendChild(td);
  }

  scheduleBody.appendChild(row);
});

// ============================================
// SISTEMA DE NOTIFICACIONES MEJORADO
// ============================================

// Función para solicitar permiso (la que llama el botón)
function solicitarPermisoNotificaciones() {
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones");
    return;
  }

  if (Notification.permission === "granted") {
    mostrarNotificacion("✅ Permiso ya concedido", "Recibirás recordatorios de tus tareas");
    document.getElementById('configNotificaciones').style.display = 'block';
  } 
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        mostrarNotificacion("🎉 ¡Notificaciones activadas!", "Ahora te avisaré de tus tareas pendientes");
        document.getElementById('configNotificaciones').style.display = 'block';
      }
    });
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje) {
  // Si la pestaña está activa, solo mostramos en consola
  if (document.visibilityState === 'visible') {
    console.log('🔔', titulo, '-', mensaje);
    return;
  }

  // Crear notificación del sistema
  const opciones = {
    body: mensaje,
    icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
    vibrate: [200, 100, 200],
    tag: 'recordatorio',
    renotify: true
  };

  new Notification(titulo, opciones);
}

// Función para verificar tareas pendientes (MEJORADA)
function hayTareasPendientes() {
  return tasks.some(task => !task.done);
}

// ============================================
// RECORDATORIO CADA 2 HORAS (TU CÓDIGO MEJORADO)
// ============================================

setInterval(() => {
  if (Notification.permission === "granted" && hayTareasPendientes()) {
    mostrarNotificacion("⏰ Tienes tareas pendientes", "No olvides revisar tu lista 📋");
  }
}, 7200000); // 2 horas

// ============================================
// VERIFICACIÓN AL CARGAR LA PÁGINA
// ============================================

window.addEventListener("load", function() {
  renderTasks();
  
  // Mostrar aviso visual si hay tareas pendientes (OPCIONAL)
  if (hayTareasPendientes()) {
    const aviso = document.createElement("div");
    aviso.id = 'avisoPendientes';
    aviso.innerText = "⚠ Tienes tareas pendientes sin marcar";
    aviso.style.position = "fixed";
    aviso.style.top = "0";
    aviso.style.left = "0";
    aviso.style.width = "100%";
    aviso.style.background = "#b91c1c";
    aviso.style.color = "white";
    aviso.style.padding = "15px";
    aviso.style.textAlign = "center";
    aviso.style.fontSize = "18px";
    aviso.style.zIndex = "9999";
    document.body.appendChild(aviso);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (aviso.parentNode) aviso.remove();
    }, 5000);
  }
  
  // Mostrar configuración si ya tiene permisos
  if (Notification.permission === "granted") {
    document.getElementById('configNotificaciones').style.display = 'block';
  }
});
