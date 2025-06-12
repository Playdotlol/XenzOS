// Wallpaper
const wallpapers = [
  'https://source.unsplash.com/random/1920x1080?nature',
  'https://source.unsplash.com/random/1920x1080?city',
  'https://source.unsplash.com/random/1920x1080?space',
];
function setRandomWallpaper() {
  const url = wallpapers[Math.floor(Math.random() * wallpapers.length)];
  document.getElementById('wallpaper').style.backgroundImage = `url(${url})`;
}

// Login
const credentials = { username: "admin", password: "1234" };
function login(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if(u===credentials.username&&p===credentials.password){
    document.getElementById("login-screen").style.display="none";
    document.getElementById("desktop").style.display="block";
    setRandomWallpaper();
    createDock();
  } else{
    document.getElementById("login-error").classList.remove("hidden");
  }
}

// Multi-window helper
let count=0;
function createWindow(title, content){
  const win = document.createElement('div');
  win.className = 'window';
  win.style.top = (50 + count*10) + 'px';
  win.style.left = (50 + count*10) + 'px';
  win.style.width = '400px';
  win.style.height = '300px';
  win.style.zIndex = 100+count;
  count++;
  win.innerHTML = `
    <div class="cursor-move bg-gray-200 px-4 py-2 flex justify-between items-center">
      <span>${title}</span>
      <button onclick="win.remove()" class="text-red-500 text-xl">×</button>
    </div>
    <div class="p-2 h-[calc(100%-3rem)] overflow-auto" style="background:white">${content}</div>
  `;
  makeDrag(win);
  document.getElementById('windows').appendChild(win);
}

// Draggable
function makeDrag(el){
  const hdr = el.firstElementChild;
  hdr.onmousedown = e =>{
    const rect = el.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;
    function move(ev){
      el.style.left = ev.clientX-offX+'px';
      el.style.top = ev.clientY-offY+'px';
    }
    document.addEventListener('mousemove', move);
    hdr.onmouseup = () => document.removeEventListener('mousemove',move);
    hdr.ondragstart=()=>false;
  };
}

// Apps:
function appFiles(){
  let html='';
  const fs = {"/":["file1.txt","notes.md"],"/projects":["app.js"]};
  for(const d in fs){
    html += `<strong>${d}</strong><ul>${fs[d].map(f=>`<li>📄 ${f}</li>`).join('')}</ul>`;
  }
  createWindow('Files',html);
}
function appChat(){
  createWindow('Chat', '<div id="cb" class="h-40 overflow-auto border"></div><input id="ci" class="w-full mt-2 p-1" placeholder="Type"><button onclick="sendChat()" class="bg-blue-500 text-white p-1 w-full mt-1">Send</button>');
}
function sendChat(){
  const i=document.getElementById('ci'),b=document.getElementById('cb');
  if(i.value){ b.innerHTML+=`<div>🧑 ${i.value}</div>`; i.value=''; b.scrollTop=b.scrollHeight; }
}
function appTerm(){
  createWindow('Terminal','<div id="termOut" class="h-40 overflow-auto bg-black text-green-400 font-mono p-2"></div><input id="termIn" class="w-full p-1 bg-gray-800 text-white font-mono" placeholder="command"><button onclick="execCmd()" class="bg-gray-700 text-white w-full p-1 mt-1">Run</button>');
}
function execCmd(){
  const inpt=document.getElementById('termIn'),out=document.getElementById('termOut');
  out.innerHTML += `<div>$ ${inpt.value}</div>`;
  if(inpt.value==='help') out.innerHTML+='<div>Available: help, time</div>';
  if(inpt.value==='time') out.innerHTML+='<div>'+new Date()+'</div>';
  inpt.value=''; out.scrollTop=out.scrollHeight;
}
function appBrowser(){
  createWindow('Browser','<iframe src="https://www.example.com" width="100%" height="100%" frameborder="0"></iframe>');
}
function appSettings(){
  createWindow('Settings','<div class="p-4"><button onclick="setRandomWallpaper()" class="bg-blue-500 text-white px-3 py-2 rounded">Change Wallpaper</button></div>');
}

// Dock
const dockApps=[
  {icon:'📁',name:'Files',fn:appFiles},
  {icon:'💬',name:'Chat',fn:appChat},
  {icon:'💻',name:'Terminal',fn:appTerm},
  {icon:'🌐',name:'Browser',fn:appBrowser},
  {icon:'⚙️',name:'Settings',fn:appSettings},
];
function createDock(){
  const dock=document.getElementById('dock');
  dock.innerHTML='';
  dockApps.forEach(a=>{
    const btn=document.createElement('button');
    btn.title=a.name;
    btn.innerText=a.icon;
    btn.onclick=a.fn;
    dock.appendChild(btn);
  });
}
