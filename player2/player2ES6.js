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

class MusicPlayer{
  
  constructor(playlist) {
    this.playlist = playlist;
    this.currentIndex = 0;
    this.isPlaying = false;

    this.audio = document.getElementById('audio');

    // UI
    this.titleEl = document.getElementById('title');
    this.artistEl = document.getElementById('artist');
    this.coverEl = document.getElementById('cover');
    this.playBtn = document.getElementById('play');
    this.progress = document.getElementById('progress');
    this.playlistEl = document.getElementById('playlist');

    // =======================
    // Init
    // =======================
    this.initEvents();
    this.renderPlaylist();
    this.loadTrack(this.currentIndex);
  }

  initEvents() {
    this.playBtn.onclick = () => this.togglePlay();
    document.getElementById('next').onclick = () => this.nextTrack();
    document.getElementById('prev').onclick = () => this.previousTrack();
    
    // =======================
    // Progress bar
    // =======================
    
    this.audio.addEventListener('timeupdate', () => {
      this.progress.max = this.audio.duration || 0;
      this.progress.value = this.audio.currentTime;
    });

    this.progress.addEventListener('input', () => {
      this.audio.currentTime = this.progress.value;
    });

    // =======================
    // Fin de piste
    // =======================
    this.audio.addEventListener('ended', this.nextTrack);
  }

  // =======================
  // Charger piste
  // =======================
  loadTrack(index) {
    const track = this.playlist[index];
    this.audio.src = track.src;

    this.titleEl.textContent = track.title;
    this.artistEl.textContent = track.artist;
    this.coverEl.src = track.cover;

    this.updateMediaSession(track);
    this.updatePlaylistUI();
  }

  // =======================
  // Play / Pause
  // =======================
  play() {
    this.audio.play();
    this.isPlaying = true;
    this.playBtn.textContent = '⏸';
    this.updatePlaybackState();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playBtn.textContent = '▶️';
    this.updatePlaybackState();
  }
  
  togglePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  // =======================
  // Next / Previous
  // =======================
  nextTrack() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadTrack(this.currentIndex);
    this.play();
  }

  previousTrack() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(this.currentIndex);
      this.play();
    }
  }

  // =======================
  // Media Session API
  // =======================
  updateMediaSession(track) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        artwork: [
          { src: track.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', this.play);
      navigator.mediaSession.setActionHandler('pause', this.pause);
      navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
    }
  }

  updatePlaybackState() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
    }
  }

  // =======================
  // Playlist rendering
  // =======================

  renderPlaylist() {
    this.playlistEl.innerHTML = '';

    this.playlist.forEach((track, index) => {
      const div = document.createElement('div');
      div.classList.add('track');
      if (index === this.currentIndex) div.classList.add('active');

      div.textContent = `${track.title} - ${track.artist}`;

      div.onclick = () => {
        this.currentIndex = index;
        this.loadTrack(this.currentIndex);
        this.play();
        this.updatePlaylistUI();
      };

      this.playlistEl.appendChild(div);
    });
  }

  updatePlaylistUI() {
    const tracks = document.querySelectorAll('.track');

    tracks.forEach((el, index) => {
      el.classList.toggle('active', index === this.currentIndex);
    });
  }
}

const player = new MusicPlayer(playlist);