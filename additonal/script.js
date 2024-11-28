const playButton = document.getElementById("playButton");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");
const audio = document.getElementById("audio");
const scrubber = document.getElementById("scrubber");

let isPlaying = false;
let isScrubbing = false;

// When the audio metadata is loaded, set the total time display
audio.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
});

// Update progress bar and current time display during playback
audio.addEventListener("timeupdate", () => {
    if (!isScrubbing) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        scrubber.style.left = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

// Toggle play and pause
function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        audio.play();
        playButton.innerHTML = "<i class='fas fa-pause'>⏸</i>";
    } else {
        audio.pause();
        playButton.innerHTML = "<i class='fas fa-play'>▶</i>";
    }
}

// Format time in mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Show only the 'Copy link' option and a close button when 3-dot menu is clicked
function showCopyLinkOption() {
    document.getElementById("musicCard").innerHTML = `
        <button class="close-button" onclick="restoreCard()">X</button>
        <div class="copy-link" onclick="copyLink()">Copy link</div>
    `;
}

// Restore the original music card layout when 'Close' button is clicked
function restoreCard() {
    document.getElementById("musicCard").innerHTML = `
        <img src="song-cover.jpg" alt="Song cover" class="song-cover">
        <div class="title">Cradles</div>
        <div class="artist">Sub Urban</div>
        <div class="controls">
            <div class="time" id="currentTime">0:00</div>
            <div class="progress-bar-container" onmousedown="startScrubbing(event)">
                <div class="progress-bar" id="progressBar"></div>
                <div class="scrubber" id="scrubber" style="display: none;"></div>
            </div>
            <div class="time" id="totalTime">0:00</div>
            <div class="more-options" onclick="showCopyLinkOption()">
                <i class="fas fa-ellipsis-h">⋮</i>
            </div>
            <button class="play-button" id="playButton" onclick="togglePlay()">
                <i class="fas fa-play">▶</i>
            </button>
        </div>
    `;
}

// Copy the song link to clipboard and show a confirmation message
function copyLink() {
    const songLink = "path-to-song-file.mp3"; // Replace with the actual song URL or link
    navigator.clipboard.writeText(songLink).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy link: ", err);
    });
}

// Handle scrubbing
function startScrubbing(event) {
    isScrubbing = true;
    updateScrubberPosition(event);
    document.addEventListener("mousemove", updateScrubberPosition);
    document.addEventListener("mouseup", stopScrubbing);
}

function stopScrubbing(event) {
    isScrubbing = false;
    document.removeEventListener("mousemove", updateScrubberPosition);
    document.removeEventListener("mouseup", stopScrubbing);
    const progressBarContainer = document.querySelector(".progress-bar-container");
    const newPosition = (event.clientX - progressBarContainer.getBoundingClientRect().left) / progressBarContainer.offsetWidth;
    audio.currentTime = newPosition * audio.duration;
}

function updateScrubberPosition(event) {
    const progressBarContainer = document.querySelector(".progress-bar-container");
    const newPosition = (event.clientX - progressBarContainer.getBoundingClientRect().left) / progressBarContainer.offsetWidth;
    progressBar.style.width = `${newPosition * 100}%`;
    scrubber.style.left = `${newPosition * 100}%`;
}
