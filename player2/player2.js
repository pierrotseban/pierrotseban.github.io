const audio = document.getElementById('audio');

const playlist = [
  {
    src: 'Bach - Invention No. 04.mp3',
    title: 'Invention No. 04',
    artist: 'Bach',
    cover: 'piano.webp'
  },
  {
    src: 'Bach - Invention No. 10.mp3',
    title: 'Invention No. 10',
    artist: 'Bach',
    cover: 'piano.webp'
  },  
  {
    src: 'Bach - Invention No. 13.mp3',
    title: 'Invention No. 13',
    artist: 'Bach',
    cover: 'piano.webp'
  },
];


let currentIndex = 0;
let isPlaying = false;

// UI
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const playBtn = document.getElementById('play');
const progress = document.getElementById('progress');
const playlistEl = document.getElementById('playlist');

// =======================
// Charger piste
// =======================
function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.src;

  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  coverEl.src = track.cover;

  updateMediaSession(track);
  updatePlaylistUI();
}

// =======================
// Play / Pause
// =======================
function play() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = '⏸';
  updatePlaybackState();
}

function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶️';
  updatePlaybackState();
}

playBtn.onclick = () => {
  isPlaying ? pause() : play();
};

// =======================
// Next / Previous
// =======================
function nextTrack() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
  play();
}

function previousTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    play();
  }
}

document.getElementById('next').onclick = nextTrack;
document.getElementById('prev').onclick = previousTrack;

// =======================
// Progress bar
// =======================
audio.addEventListener('timeupdate', () => {
  progress.max = audio.duration || 0;
  progress.value = audio.currentTime;
});

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
});

// =======================
// Fin de piste
// =======================
audio.addEventListener('ended', nextTrack);

// =======================
// Media Session API
// =======================
function updateMediaSession(track) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [
        { src: track.cover, sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
  }
}

function updatePlaybackState() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }
}

// =======================
// Playlist rendering
// =======================

function renderPlaylist() {
  playlistEl.innerHTML = '';

  playlist.forEach((track, index) => {
    const div = document.createElement('div');
    div.classList.add('track');
    if (index === currentIndex) div.classList.add('active');

    div.textContent = `${track.title} - ${track.artist}`;

    div.onclick = () => {
      currentIndex = index;
      loadTrack(currentIndex);
      play();
      updatePlaylistUI();
    };

    playlistEl.appendChild(div);
  });
}

function updatePlaylistUI() {
  const tracks = document.querySelectorAll('.track');

  tracks.forEach((el, index) => {
    el.classList.toggle('active', index === currentIndex);
  });
}

// =======================
// Init
// =======================
renderPlaylist();
loadTrack(currentIndex);