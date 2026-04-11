var player = {
  // (PART A) PROPERTIES
  // (A1) HTML ELEMENTS
  hImg : null, // song image
  hName : null, // song name
  hTimeR : null, // song time slider
  hTimeN : null, // song current time
  hTimeT : null, // song time
  hLast : null, // last song
  hTog : null, // toggle play/pause
  hNext : null, // next song
  hVolI : null, // volume icon/toggle
  hVolR : null, // volume slider

  // (A2) AUDIO & PLAYLIST
  pAud : null, // audio player
  pList : null, // playlist
  pSeek : false, // user seeking time slider
  pNow : 0, // currently playing

  // (PART B) HELPER - FORMAT "NICE TIME"
  nicetime : secs => {
    let m = Math.floor(secs/60),
        s = secs - (m * 60);
    if (s<10) { s = "0" + s; }
    return `${m}:${s}`;
  },

  // (PART C) INITIALIZE
  init : () => {
    // (C1) GET HTML ELEMENTS
    player.hImg = document.getElementById("playImg");
    player.hName = document.getElementById("playName");
    player.hTimeR = document.getElementById("playTimeR");
    player.hTimeN = document.getElementById("playTimeN");
    player.hTimeT = document.getElementById("playTimeT");
    player.hLast = document.getElementById("playLast");
    player.hNext = document.getElementById("playNext");
    player.hTog = document.getElementById("playTog");
    player.hVolI = document.getElementById("playVolI");
    player.hVolR = document.getElementById("playVolR");

    // (C2) AUDIO OBJECT & PLAYLIST
    player.pAud = new Audio();
    player.pList = document.querySelectorAll("#playList div");

    // (C3) AUTO SWITCH PLAY/PAUSE ICON
    let pp = () => player.hTog.className = player.pAud.paused ? "icon-pause2" : "icon-play3" ;
    player.pAud.onplay = pp;
    player.pAud.onpause = pp;

    // (C4) AUTO PLAY NEXT SONG
    player.pAud.onended = () => player.load(true);

    // (C5) AUTO UPDATE CURRENT TIME
    player.pAud.ontimeupdate = () => {
      if (!player.pSeek) { player.hTimeR.value = Math.floor(player.pAud.currentTime); }
      player.hTimeN.innerHTML = player.nicetime(Math.floor(player.pAud.currentTime));
    };

    // (C6) TIME SLIDER
    player.hTimeR.oninput = () => player.pSeek = true;
    player.hTimeR.onchange = () => {
      player.pAud.currentTime = player.hTimeR.value;
      player.pSeek = false;
      if (player.pAud.paused) { player.pAud.play(); }
    }

    // (C7) CLICK TO PLAY SONG
    for (let [i, song] of Object.entries(player.pList)) {
      song.onclick = () => player.load(i);
    }

    // (C8) INIT - PRELOAD FIRST SONG
    player.load(0, true);
  },

  // (PART D) LOAD SELECTED SONG
  load : (song, preload) => {
    // (D1) STOP PLAYING CURRENT SONG
    if (!player.pAud.paused) { player.pAud.pause(); }

    // (D2) LOCK INTERFACE
    player.hImg.src = "songs/loading.webp";
    player.hName.innerHTML = "Loading";
    player.hTimeR.disabled = true;
    player.pSeek = false;
    player.hLast.onclick = "";
    player.hNext.onclick = "";
    player.hTog.onclick = "";
    player.hVolI.onclick = "";
    player.hVolR.disabled = true;

    // (D3) NEXT SONG TO PLAY
    if (song === true) { player.pNow++; }
    else if (song === false) { player.pNow--; }
    else { player.pNow = song; }
    if (player.pNow >= player.pList.length) { player.pNow = 0; }
    if (player.pNow < 0) { player.pNow = player.pList.length - 1; }

    // (D4) SET SELECTED SONG
    for (let song of player.pList) { song.classList.remove("current"); }
    let selected = player.pList[player.pNow];
    selected.classList.add("current");

    // (D5) LOAD SELECTED SONG
    player.pAud.src = "songs/" + selected.dataset.src;
    player.pAud.oncanplaythrough = () => {
      // (D5-1) SET SONG IMAGE & NAME
      player.hImg.src = "songs/" + selected.dataset.img;
      player.hName.innerHTML = selected.innerHTML;

      // (D5-2) SET SONG TIME
      player.hTimeN.innerHTML = "0:00";
      player.hTimeT.innerHTML = player.nicetime(Math.floor(player.pAud.duration));
      player.hTimeR.value = 0;
      player.hTimeR.max = Math.floor(player.pAud.duration);

      // (D5-3) ENABLE CONTROLS
      player.hTimeR.disabled = false;
      player.hVolR.disabled = false;
      player.hLast.onclick = () => player.load(false);
      player.hNext.onclick = () => player.load(true);
      player.hTog.onclick = () => {
        if (player.pAud.paused) { player.pAud.play(); }
        else { player.pAud.pause(); }
      };
      player.hVolI.onclick = () => {
        player.pAud.volume = player.pAud.volume==0 ? 1 : 0 ;
        player.hVolR.value = player.pAud.volume;
        player.hVolI.className = player.pAud.volume==0 ? "icon-volume-mute2" : "icon-volume-high" ;
      };
      player.hVolR.onchange = () => {
        player.pAud.volume = player.hVolR.value;
        player.hVolI.className = player.pAud.volume==0 ? "icon-volume-mute2" : "icon-volume-high" ;
      };

      // (D5-4) START PLAYING SONG
      if (!preload) { player.pAud.play(); }
    };
  }
};

// (PART E) START
window.addEventListener("load", player.init);