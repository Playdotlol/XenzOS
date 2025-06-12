// Simple Login
const credentials = { username: "admin", password: "1234" };
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === credentials.username && p === credentials.password) {
    document.getElementById("login-screen").style.display = "none";
  } else {
    document.getElementById("login-error").classList.remove("hidden");
  }
}

// Multi-window support
let windowCount = 0;
function createWindow(title, contentHTML) {
  const win = document.createElement("div");
  win.className = "absolute top-20 left-20 w-96 h-64 bg-white text-black rounded-xl shadow-lg-custom";
  win.style.zIndex = 10 + windowCount++;
  win.innerHTML = `
    <div class="cursor-move bg-gray-200 px-4 py-2 rounded-t-xl flex justify-between items-center">
      <span>${title}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-red-500 font-bold">×</button>
    </div>
    <div class="p-2 overflow-auto h-[calc(100%-3rem)]">${contentHTML}</div>
  `;
  makeDraggable(win);
  document.getElementById("windows").appendChild(win);
}

function makeDraggable(el) {
  const header = el.querySelector(".cursor-move");
  header.onmousedown = function(e) {
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX + 'px';
      el.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);
    header.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      header.onmouseup = null;
    };
  };
  header.ondragstart = () => false;
}

// File system emulation
const fileSystem = {
  "/": ["file1.txt", "project", "notes.md"],
  "/project": ["index.html", "app.js"]
};
function showFileExplorer() {
  let html = "";
  for (const dir in fileSystem) {
    html += "<strong>" + dir + "</strong><ul>";
    fileSystem[dir].forEach(file => {
      html += "<li>📄 " + file + "</li>";
    });
    html += "</ul>";
  }
  createWindow("File Explorer", html);
}

// Chat system (local simulation)
function showChatApp() {
  createWindow("Chat", '<div id="chat-box" class="h-40 overflow-y-auto"></div><input id="chat-input" class="w-full p-1 mt-2 border" placeholder="Type..."><button onclick="sendChat()" class="bg-blue-500 p-1 w-full mt-1 text-white">Send</button>');
}
function sendChat() {
  const input = document.getElementById("chat-input");
  const box = document.getElementById("chat-box");
  if (input && input.value) {
    const msg = document.createElement("div");
    msg.textContent = "🧑 " + input.value;
    box.appendChild(msg);
    input.value = "";
    box.scrollTop = box.scrollHeight;
  }
}

// Voice Assistant (browser speech recognition)
function showVoiceAssistant() {
  createWindow("Voice Assistant", '<button onclick="startVoice()" class="bg-green-500 p-2 rounded text-white">🎙️ Start Listening</button><p id="voice-output" class="mt-2"></p>');
}
function startVoice() {
  const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  recognition.onresult = function(e) {
    const transcript = e.results[0][0].transcript;
    document.getElementById("voice-output").textContent = "You said: " + transcript;
  };
}

// Tic-Tac-Toe Game
function showTicTacToe() {
  createWindow("Tic-Tac-Toe", `
    <div id="game-board" class="grid grid-cols-3 gap-1 w-24 h-24 mx-auto">
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
      <div class="box h-full w-full bg-gray-200 cursor-pointer text-center text-2xl" onclick="playMove(this)"></div>
    </div>
    <button class="w-full bg-red-500 mt-2 text-white py-1 rounded" onclick="resetGame()">Reset Game</button>
  `);
}
let currentPlayer = 'X';
function playMove(cell) {
  if (!cell.textContent) {
    cell.textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}
function resetGame() {
  const cells = document.querySelectorAll("#game-board .box");
  cells.forEach(cell => cell.textContent = "");
}

// Calendar App (Mock)
function showCalendar() {
  createWindow("Calendar", `
    <div class="text-center">
      <h2 class="text-lg font-bold mb-4">Calendar</h2>
      <div class="text-sm">January 2025</div>
      <div class="grid grid-cols-7 gap-1 mt-4">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        <div class="p-2">1</div><div class="p-2">2</div><div class="p-2">3</div><div class="p-2">4</div><div class="p-2">5</div><div class="p-2">6</div><div class="p-2">7</div>
        <!-- Continue to fill in the calendar -->
      </div>
    </div>
  `);
}

// Taskbar buttons
window.onload = () => {
  const apps = [
    { name: "Files", action: showFileExplorer },
    { name: "Chat", action: showChatApp },
    { name: "Voice", action: showVoiceAssistant },
    { name: "Tic-Tac-Toe", action: showTicTacToe },
    { name: "Calendar", action: showCalendar }
  ];
  const taskbar = document.getElementById("taskbar");
  apps.forEach(app => {
    const btn = document.createElement("button");
    btn.textContent = app.name;
    btn.className = "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded";
    btn.onclick = app.action;
    taskbar.appendChild(btn);
  });
};
