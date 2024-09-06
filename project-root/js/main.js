let currentShowIndex = 0;
let currentEpisodeIndex = 0;
let shows = [];

// Fetch the shows from program.json
fetch("program.json")
  .then(response => response.json())
  .then(data => {
    shows = Object.values(data.shows);
    play(currentShowIndex, currentEpisodeIndex);
  });

function play(showIndex, episodeIndex) {
  const show = shows[showIndex];
  if (!show) {
    console.error('Show not found');
    return;
  }

  const episode = Object.values(show.episodes)[episodeIndex];
  if (!episode) {
    console.error('Episode not found');
    return;
  }

  setAlbumArt(episode.album_art);
  setAudioSource(episode.location_on_disk);
  updateEpisodeInfo(show.name, episode.name);
}

function playAudio() {
  const audio = document.getElementById('player');
  const playButton = document.getElementById('play-button');

  if (audio.paused) {
    audio.play();
    playButton.textContent = 'Pause';
  } else {
    audio.pause();
    playButton.textContent = 'Play';
  }
}

function nextEpisode() {
  const currentShow = shows[currentShowIndex];
  const episodeCount = Object.keys(currentShow.episodes).length;

  currentEpisodeIndex++;
  if (currentEpisodeIndex >= episodeCount) {
    currentEpisodeIndex = 0;
    currentShowIndex = (currentShowIndex + 1) % shows.length;
  }

  play(currentShowIndex, currentEpisodeIndex);
  playAudio();
}

function setAudioSource(sourceUrl) {
  const audio = document.getElementById('player');
  audio.addEventListener('loadedmetadata', function() {
    updateDuration();
  });
  const source = audio.querySelector('source');

  source.src = sourceUrl;
  audio.load(); // Important: reload the audio element after changing the source
}

function setAlbumArt(sourceUrl) {
  const img = document.getElementById('album-art');
  img.src = sourceUrl;
}

function updateEpisodeInfo(showName, episodeName) {
  const infoElement = document.getElementById('episode-info');
  infoElement.textContent = `${showName} - ${episodeName}`;
}

function updateProgressBar() {
  const audio = document.getElementById('player');
  const progress = document.getElementById('progress');
  const currentTime = document.getElementById('current-time');

  const progressPercentage = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercentage}%`;

  currentTime.textContent = formatTime(audio.currentTime);
}

function initializeProgressBar() {
  const audio = document.getElementById('player');
  const duration = document.getElementById('duration');

  duration.textContent = formatTime(audio.duration);
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateDuration() {
  const audio = document.getElementById('player');
  const duration = document.getElementById('duration');
  duration.textContent = formatTime(audio.duration);
}

function seekAudio(event) {
  const audio = document.getElementById('player');
  const progressBar = document.getElementById('progress-bar');
  const rect = progressBar.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;

  audio.currentTime = clickPosition * audio.duration;
}

document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('player');
  const playButton = document.getElementById('play-button');
  const nextButton = document.getElementById('next-button');
  const progressBar = document.getElementById('progress-bar');

  playButton.addEventListener('click', playAudio);
  nextButton.addEventListener('click', nextEpisode);
  progressBar.addEventListener('click', seekAudio);

  audio.addEventListener('timeupdate', updateProgressBar);
  audio.addEventListener('loadedmetadata', initializeProgressBar);
  audio.addEventListener('ended', nextEpisode);
});

