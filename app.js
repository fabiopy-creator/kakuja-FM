const tracklist = [
    { id: 0, title: "Unravel", artist: "TK from Ling Tosite Sigure", album: "Anteiku", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 1, title: "Asphyxia", artist: "Cö shu Nie", album: "Aogiri", img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 2, title: "Katharsis", artist: "TK from Ling Tosite Sigure", album: "Aogiri", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 3, title: "Glassy Sky", artist: "Donna Burke", album: "Anteiku", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 4, title: "Half", artist: "Ziyoou-vachi", album: "Laboratorio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 5, title: "Saints", artist: "People In The Box", album: "Laboratorio", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
];

let currentTrackIndex = 0;
const audio = document.getElementById('audio-element');

const musicGrid = document.getElementById('music-grid');
const playerImg = document.getElementById('player-img');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const mainPlayBtn = document.getElementById('main-play-btn');
const searchInput = document.getElementById('search-input');
const progressLine = document.getElementById('progress-line');
const currTimeText = document.getElementById('curr-time');
const totalTimeText = document.getElementById('total-time');

function renderTracks(tracksToRender) {
    musicGrid.innerHTML = "";
    tracksToRender.forEach(track => {
        const card = document.createElement('div');
        card.classList.add('track-card');
        card.setAttribute('onclick', `selectTrack(${track.id})`);
        
        card.innerHTML = `
            <div class="img-container">
                <img src="${track.img}" alt="${track.title}">
                <div class="play-hover-btn">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
        `;
        musicGrid.appendChild(card);
    });
}

function selectTrack(id) {
    currentTrackIndex = id;
    const track = tracklist[currentTrackIndex];
    
    playerImg.src = track.img;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    
    audio.src = track.url;
    audio.play()
        .then(() => {
            mainPlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        })
        .catch(err => console.log("Erro de reprodução: ", err));
}

function togglePlay() {
    if (!audio.src) {
        selectTrack(0);
        return;
    }
    
    if (audio.paused) {
        audio.play();
        mainPlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
        audio.pause();
        mainPlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

function playFirstSong() {
    selectTrack(0);
}

function nextTrack() {
    let next = currentTrackIndex + 1;
    if (next >= tracklist.length) next = 0;
    selectTrack(next);
}

function prevTrack() {
    let prev = currentTrackIndex - 1;
    if (prev < 0) prev = tracklist.length - 1;
    selectTrack(prev);
}

function changeVolume(val) {
    audio.volume = val;
}

function seekAudio(event) {
    if (!audio.duration) return;
    const progressBar = document.getElementById('progress-bar-click');
    const coordX = event.offsetX;
    const totalWidth = progressBar.offsetWidth;
    const clickPercent = coordX / totalWidth;
    audio.currentTime = clickPercent * audio.duration;
}

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    
    const current = audio.currentTime;
    const duration = audio.duration;
    
    const pct = (current / duration) * 100;
    progressLine.style.width = pct + "%";
    
    currTimeText.textContent = formatTime(current);
    totalTimeText.textContent = formatTime(duration);
});

audio.addEventListener('ended', () => {
    nextTrack();
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = tracklist.filter(t => 
        t.title.toLowerCase().includes(term) || t.artist.toLowerCase().includes(term)
    );
    renderTracks(filtered);
});

function filterPlaylist(cat) {
    const filtered = tracklist.filter(t => t.album === cat);
    renderTracks(filtered);
}

audio.volume = 0.7;
renderTracks(tracklist);