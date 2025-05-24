// --- DOM Elements ---
const videoPlayer = document.getElementById('main-video-player');
const hotspotContainer = document.getElementById('hotspot-container');
const messageArea = document.getElementById('message-area');
const playPauseButton = document.getElementById('play-pause-button');
const restartButton = document.getElementById('restart-button');
const overlayPlayButton = document.getElementById('overlay-play-button');
const bgAudio = document.getElementById('bg-audio');
const clickAudio = document.getElementById('click-sound');
const confirmAudio = document.getElementById('confirm-sound');
const charSelectScreen = document.getElementById('character-select-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');

// --- Game State & Configuration ---
let activeHotspots = [];
let activeCharacter = 'ronaldo'; // Default character
let gameState = {
    playerScore: 0,
    opponentScore: 0,
    kicksTaken: 0,
    maxKicks: 5,
    selectedCharacterName: 'ronaldo' // Store 'ronaldo' or 'messi'
};

const CHARACTER_SELECT_VIDEOS = ['pk_charselect_ronaldo_01', 'pk_charselect_messi_01'];

// --- Video Preloading & Transition Management ---
let preloadedVideos = new Map(); // Cache for preloaded video elements
let nextVideoElement = null; // Pre-created video element for the next video
let isTransitioning = false; // Flag to prevent multiple transitions
let lastFrameCanvas = null; // Canvas to capture last frame
let lastFrameContext = null; // Canvas context

// Initialize canvas for capturing last frames
function initializeLastFrameCapture() {
    lastFrameCanvas = document.createElement('canvas');
    lastFrameCanvas.style.position = 'absolute';
    lastFrameCanvas.style.top = '0';
    lastFrameCanvas.style.left = '0';
    lastFrameCanvas.style.width = '100%';
    lastFrameCanvas.style.height = '100%';
    lastFrameCanvas.style.pointerEvents = 'none';
    lastFrameCanvas.style.zIndex = '1';
    lastFrameContext = lastFrameCanvas.getContext('2d');
    document.getElementById('game-container').appendChild(lastFrameCanvas);
}

// Capture current video frame to canvas
function captureCurrentFrame() {
    if (videoPlayer.readyState >= 2 && lastFrameCanvas && lastFrameContext) {
        lastFrameCanvas.width = videoPlayer.videoWidth;
        lastFrameCanvas.height = videoPlayer.videoHeight;
        lastFrameContext.drawImage(videoPlayer, 0, 0);
        lastFrameCanvas.style.display = 'block';
    }
}

// Hide the last frame canvas
function hideLastFrame() {
    if (lastFrameCanvas) {
        lastFrameCanvas.style.display = 'none';
    }
}

// Preload a video by creating a video element and loading it
function preloadVideo(videoKey) {
    if (!videoData[videoKey] || preloadedVideos.has(videoKey)) return;
    
    const data = videoData[videoKey];
    if (data.isLogicHop) return;
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = data.src;
    video.load();
    
    video.addEventListener('loadeddata', () => {
        console.log(`Preloaded: ${videoKey}`);
        preloadedVideos.set(videoKey, video);
    });
    
    video.addEventListener('error', () => {
        console.error(`Failed to preload: ${videoKey}`);
        preloadedVideos.delete(videoKey);
    });
}

// Predict and preload next videos based on current video
function predictAndPreloadNextVideos(currentKey) {
    const data = videoData[currentKey];
    if (!data) return;
    
    // Preload the onEnd video
    if (data.onEnd && videoData[data.onEnd]) {
        preloadVideo(data.onEnd);
    }
    
    // Preload all hotspot target videos
    if (data.hotspots) {
        data.hotspots.forEach(hotspot => {
            if (hotspot.targetVideo && videoData[hotspot.targetVideo]) {
                preloadVideo(hotspot.targetVideo);
            }
        });
    }
    
    // For character selection, preload the tunnel walk videos
    if (currentKey.includes('charselect')) {
        preloadVideo('pk_cin_tunnel_walk_ronaldo_01');
        preloadVideo('pk_cin_tunnel_walk_messi_01');
    }
    
    // For penalty setup, preload common outcome videos
    if (currentKey.includes('penalty_setup')) {
        const character = gameState.selectedCharacterName;
        // Preload a few common outcomes
        preloadVideo(`pk_shot_left_vs_keeper_dive_right_goal_${character}_01`);
        preloadVideo(`pk_shot_middle_vs_keeper_stay_middle_save_${character}_01`);
        preloadVideo(`pk_shot_right_vs_keeper_dive_left_goal_${character}_01`);
    }
}

// --- Video Data ---
const videoData = {
    // I. Initial Pre-Match Cinematic
    'pk_cin_stadium_flythrough_01': {
        src: 'videos/pk_cin_stadium_flythrough_01.mp4',
        poster: 'https://placehold.co/960x540/333/FFF?text=Stadium+Flythrough',
        hotspots: [],
        onEnd: 'pk_charselect_ronaldo_01' // Leads to Ronaldo select screen by default
    },

    // II. Character Select System (On Pitch)
    'pk_charselect_ronaldo_01': {
        src: 'videos/pk_char_ronaldo_idle_01.mp4', // Ronaldo's idle video on pitch
        poster: 'https://placehold.co/960x540/444/FFF?text=Select:+Ronaldo',
        hotspots: [
            { id: 'arrow_to_messi', text: '➡️ Messi', shape: 'rectangle', x: 75, y: 45, width: 20, height: 10, startTime: 0.5, endTime: 60, targetVideo: 'pk_charselect_messi_01'},
            { id: 'confirm_ronaldo', text: 'Confirm Ronaldo', shape: 'rectangle', x: 30, y: 80, width: 40, height: 10, startTime: 0.5, endTime: 60, targetVideo: 'LOGIC_CONFIRM_CHARACTER', character: 'ronaldo'}
        ]
    },
    'pk_charselect_messi_01': {
        src: 'videos/pk_char_messi_idle_01.mp4', // Messi's idle video on pitch
        poster: 'https://placehold.co/960x540/444/FFF?text=Select:+Messi',
        hotspots: [
            { id: 'arrow_to_ronaldo', text: '⬅️ Ronaldo', shape: 'rectangle', x: 5, y: 45, width: 20, height: 10, startTime: 0.5, endTime: 60, targetVideo: 'pk_charselect_ronaldo_01'},
            { id: 'confirm_messi', text: 'Confirm Messi', shape: 'rectangle', x: 30, y: 80, width: 40, height: 10, startTime: 0.5, endTime: 60, targetVideo: 'LOGIC_CONFIRM_CHARACTER', character: 'messi'}
        ]
    },

    // III. Post-Selection Cinematics (Player Specific Tunnel Walkout)
    'pk_cin_tunnel_walk_ronaldo_01': {
        src: 'videos/pk_cin_tunnel_walk_ronaldo_01.mp4',
        poster: 'https://placehold.co/960x540/555/FFF?text=Ronaldo+Tunnel+Walk',
        hotspots: [],
        onEnd: 'pk_cin_name_screen_ronaldo_01'
    },
    'pk_cin_tunnel_walk_messi_01': {
        src: 'videos/pk_cin_tunnel_walk_messi_01.mp4',
        poster: 'https://placehold.co/960x540/555/FFF?text=Messi+Tunnel+Walk',
        hotspots: [],
        onEnd: 'pk_cin_name_screen_messi_01'
    },

    // IV. Post-Selection Cinematics (Player Specific Name Screen)
    'pk_cin_name_screen_ronaldo_01': {
        src: 'videos/pk_cin_name_screen_ronaldo_01.mp4',
        poster: 'https://placehold.co/960x540/666/FFF?text=Ronaldo+Intro',
        hotspots: [],
        onEnd: 'pk_game_penalty_setup_ronaldo_01'
    },
    'pk_cin_name_screen_messi_01': {
        src: 'videos/pk_cin_name_screen_messi_01.mp4',
        poster: 'https://placehold.co/960x540/666/FFF?text=Messi+Intro',
        hotspots: [],
        onEnd: 'pk_game_penalty_setup_messi_01'
    },

    // V. Gameplay Animations – Penalty Kick Setup (Player Specific)
    'pk_game_penalty_setup_ronaldo_01': {
        src: 'videos/pk_game_penalty_setup_ronaldo_01.mp4',
        poster: 'https://placehold.co/960x540/777/FFF?text=Ronaldo+Penalty+Setup',
        hotspots: [ /* Shot direction hotspots same as before, but will use activeCharacter */
            { id: 'shoot_left_r', text: '', shape: 'circle', cx: 25, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'left' },
            { id: 'shoot_middle_r', text: '', shape: 'circle', cx: 50, cy: 45, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'middle' },
            { id: 'shoot_right_r', text: '', shape: 'circle', cx: 75, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'right' }
        ]
    },
    'pk_game_penalty_setup_messi_01': {
        src: 'videos/pk_game_penalty_setup_messi_01.mp4',
        poster: 'https://placehold.co/960x540/777/FFF?text=Messi+Penalty+Setup',
        hotspots: [ /* Shot direction hotspots */
            { id: 'shoot_left_m', text: '', shape: 'circle', cx: 25, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'left' },
            { id: 'shoot_middle_m', text: '', shape: 'circle', cx: 50, cy: 45, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'middle' },
            { id: 'shoot_right_m', text: '', shape: 'circle', cx: 75, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'right' }
        ]
    },

    // VI. Gameplay Animations – Shot vs. Keeper Outcomes (Player Specific Examples)
    // RONALDO OUTCOMES (Need 9 total for Ronaldo)
    'pk_shot_left_vs_keeper_dive_right_goal_ronaldo_01': { src: 'videos/pk_shot_L_vs_keepR_goal_ronaldo_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=Ronaldo+GOAL!', hotspots: [], onEnd: 'pk_react_goal_player_celeb_ronaldo_01' },
    'pk_shot_left_vs_keeper_dive_left_save_ronaldo_01': { src: 'videos/pk_shot_L_vs_keepL_save_ronaldo_01.mp4', poster: 'https://placehold.co/960x540/A00/FFF?text=Ronaldo+SAVE!', hotspots: [], onEnd: 'pk_react_save_keeper_celeb_ronaldo_01' },
    // ... (add all 9 outcome variations for Ronaldo) ...

    // MESSI OUTCOMES (Need 9 total for Messi)
    'pk_shot_left_vs_keeper_dive_right_goal_messi_01': { src: 'videos/pk_shot_L_vs_keepR_goal_messi_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=Messi+GOAL!', hotspots: [], onEnd: 'pk_react_goal_player_celeb_messi_01' },
    'pk_shot_left_vs_keeper_dive_left_save_messi_01': { src: 'videos/pk_shot_L_vs_keepL_save_messi_01.mp4', poster: 'https://placehold.co/960x540/A00/FFF?text=Messi+SAVE!', hotspots: [], onEnd: 'pk_react_save_keeper_celeb_messi_01' },
    // ... (add all 9 outcome variations for Messi) ...


    // VII. Result Reactions (Player Specific Examples)
    'pk_react_goal_player_celeb_ronaldo_01': { src: 'videos/pk_react_goal_ronaldo_celeb_01.mp4', poster: 'https://placehold.co/960x540/7A7/FFF?text=Ronaldo+Celebrates+Goal', hotspots: [], onEnd: 'pk_react_crowd_cheers_goal_01' }, // Generic crowd cheer for now
    'pk_react_save_keeper_celeb_ronaldo_01': { src: 'videos/pk_react_save_ronaldo_disappoint_01.mp4', poster: 'https://placehold.co/960x540/A77/FFF?text=Ronaldo+Disappointed+Save', hotspots: [], onEnd: 'pk_react_crowd_gasp_save_01' }, // Generic crowd gasp

    'pk_react_goal_player_celeb_messi_01': { src: 'videos/pk_react_goal_messi_celeb_01.mp4', poster: 'https://placehold.co/960x540/7A7/FFF?text=Messi+Celebrates+Goal', hotspots: [], onEnd: 'pk_react_crowd_cheers_goal_01' },
    'pk_react_save_keeper_celeb_messi_01': { src: 'videos/pk_react_save_messi_disappoint_01.mp4', poster: 'https://placehold.co/960x540/A77/FFF?text=Messi+Disappointed+Save', hotspots: [], onEnd: 'pk_react_crowd_gasp_save_01' },
    
    // Generic crowd reactions (can be reused)
    'pk_react_crowd_cheers_goal_01': { src: 'videos/pk_react_crowd_cheers_goal_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Crowd+Cheers', hotspots: [], onEnd: 'pk_transition_scoreboard_update_01' },
    'pk_react_crowd_gasp_save_01': { src: 'videos/pk_react_crowd_gasp_save_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Crowd+Gasps', hotspots: [], onEnd: 'pk_transition_scoreboard_update_01' },


    // VIII. Transitions & Game State Logic
    'pk_transition_scoreboard_update_01': {
        src: 'videos/pk_trans_scoreboard_update_01.mp4',
        poster: 'https://placehold.co/960x540/999/FFF?text=Scoreboard',
        hotspots: [],
        onEnd: 'LOGIC_CHECK_GAME_STATE'
    },
    'LOGIC_CHECK_GAME_STATE': { // Logic Hop
        isLogicHop: true,
        onLogic: () => {
            if (gameState.kicksTaken >= gameState.maxKicks) {
                // Game Over Logic
                if (gameState.playerScore > gameState.opponentScore) { // Assuming opponent score is tracked
                    return `pk_win_celeb_${gameState.selectedCharacterName}_01`;
                } else if (gameState.playerScore < gameState.opponentScore) {
                    return `pk_game_over_lose_${gameState.selectedCharacterName}_01`;
                } else { // Draw - could add draw-specific videos or go to sudden death
                    return `pk_game_over_lose_${gameState.selectedCharacterName}_01`; // Placeholder for draw
                }
            } else {
                // Next kick
                return `pk_game_penalty_setup_${gameState.selectedCharacterName}_01`;
            }
        }
    },

    // IX. Win/Loss Sequences (Player Specific Examples)
    'pk_win_celeb_ronaldo_01': { src: 'videos/pk_win_celeb_ronaldo_01.mp4', poster: 'https://placehold.co/960x540/8A8/FFF?text=Ronaldo+Wins!', hotspots: [], onEnd: 'pk_game_over_ending_01' },
    'pk_win_celeb_messi_01': { src: 'videos/pk_win_celeb_messi_01.mp4', poster: 'https://placehold.co/960x540/8A8/FFF?text=Messi+Wins!', hotspots: [], onEnd: 'pk_game_over_ending_01' },
    
    'pk_game_over_lose_ronaldo_01': { src: 'videos/pk_gameover_lose_ronaldo_01.mp4', poster: 'https://placehold.co/960x540/A88/FFF?text=Ronaldo+Loses', hotspots: [], onEnd: 'pk_game_over_ending_01'},
    'pk_game_over_lose_messi_01': { src: 'videos/pk_gameover_lose_messi_01.mp4', poster: 'https://placehold.co/960x540/A88/FFF?text=Messi+Loses', hotspots: [], onEnd: 'pk_game_over_ending_01'},

    'pk_game_over_ending_01': { // Generic ending screen with restart
        src: 'videos/pk_gameover_ending_01.mp4', // A neutral "Thanks for playing" or similar
        poster: 'https://placehold.co/960x540/AAA/FFF?text=Game+Over',
        hotspots: [
            { id: 'restart_from_end', text: 'Play Again?', shape: 'rectangle', x: 35, y: 70, width: 30, height: 10, startTime: 1, endTime: 20, targetVideo: 'pk_cin_stadium_flythrough_01' }
        ],
        onEnd: 'pk_cin_stadium_flythrough_01'
    }
};

let currentVideoKey = 'pk_cin_stadium_flythrough_01'; // Start of the game

// --- Functions ---

function resetGameState() {
    activeCharacter = 'ronaldo'; // Default character
    gameState.playerScore = 0;
    gameState.opponentScore = 0; // Assuming an opponent for win/loss logic
    gameState.kicksTaken = 0;
    gameState.selectedCharacterName = 'ronaldo';
    messageArea.textContent = "Game state reset. Ronaldo selected.";
    
    // Clear preloaded videos on reset
    preloadedVideos.clear();
}

function showCharacterSelectScreen() {
    if (charSelectScreen) {
        charSelectScreen.classList.remove('hidden');
        overlayPlayButton.classList.add('hidden');
        videoPlayer.pause();
    }
}

function hideCharacterSelectScreen() {
    if (charSelectScreen) {
        charSelectScreen.classList.add('hidden');
    }
}

function showMainMenuScreen() {
    if (mainMenuScreen) {
        mainMenuScreen.classList.remove('hidden');
        overlayPlayButton.classList.add('hidden');
        const menuVideo = document.getElementById('main-menu-background');
        if (menuVideo) {
            menuVideo.load();
            menuVideo.play().catch(() => {});
        }
    }
}

function hideMainMenuScreen() {
    if (mainMenuScreen) {
        mainMenuScreen.classList.add('hidden');
        const menuVideo = document.getElementById('main-menu-background');
        if (menuVideo) {
            menuVideo.pause();
            menuVideo.currentTime = 0;
        }
    }
}

function startGame() {
    hideMainMenuScreen();
    playUiClick();
    resetGameState();
    loadVideo('pk_cin_stadium_flythrough_01', true);
}

function confirmCharacter(characterName) {
    playConfirmClick();
    gameState.selectedCharacterName = characterName;
    activeCharacter = characterName; // Set global activeCharacter as well
    messageArea.textContent = `${characterName.charAt(0).toUpperCase() + characterName.slice(1)} selected!`;
    // Load the player-specific tunnel walkout
    loadVideo(`pk_cin_tunnel_walk_${characterName}_01`, true);
}

function handleBackgroundAudio(videoKey) {
    if (!bgAudio) return;

    // Start the loop when entering character select
    if (CHARACTER_SELECT_VIDEOS.includes(videoKey)) {
        if (bgAudio.paused) {
            try {
                bgAudio.currentTime = 0;
                bgAudio.play();
            } catch (e) {
                console.error('Audio play error:', e);
            }
        }
    } else {
        // Once started, keep the music playing for the rest of the game
        if (bgAudio.paused) {
            try {
                bgAudio.play();
            } catch (e) {
                console.error('Audio play error:', e);
            }
        }
        // Intentionally do not pause when leaving character select
    }
}

function playUiClick() {
    if (clickAudio) {
        try {
            clickAudio.currentTime = 0;
            clickAudio.play();
        } catch (e) {
            console.error('Audio play error:', e);
        }
    }
}

function playConfirmClick() {
    if (confirmAudio) {
        try {
            confirmAudio.currentTime = 0;
            confirmAudio.play();
        } catch (e) {
            console.error('Audio play error:', e);
        }
    }
}

// Enhanced loadVideo function with smooth transitions
async function loadVideo(videoKey, autoplay = true) {
    if (isTransitioning) {
        console.log('Already transitioning, skipping:', videoKey);
        return;
    }
    
    if (!videoData[videoKey]) {
        console.error('Error: Video key not found:', videoKey);
        messageArea.textContent = `Error: Video key "${videoKey}" not found.`;
        videoPlayer.poster = 'https://placehold.co/960x540/FF0000/FFFFFF?text=Error:+Video+Not+Found';
        return;
    }

    isTransitioning = true;
    currentVideoKey = videoKey;
    handleBackgroundAudio(videoKey);

    if (CHARACTER_SELECT_VIDEOS.includes(videoKey)) {
        showCharacterSelectScreen();
        // Continue loading the idle video so it plays behind the UI
    } else {
        hideCharacterSelectScreen();
    }

    const data = videoData[videoKey];

    // Handle logic hops
    if (data.isLogicHop && typeof data.onLogic === 'function') {
        const nextVideoKey = data.onLogic();
        if (nextVideoKey && videoData[nextVideoKey]) {
            isTransitioning = false;
            loadVideo(nextVideoKey, autoplay);
        } else {
            console.error("Logic hop for '" + videoKey + "' did not return a valid next video key or key not found:", nextVideoKey);
            isTransitioning = false;
            loadVideo('pk_cin_stadium_flythrough_01', autoplay); // Fallback
        }
        return;
    }
    
    // Capture the current frame before switching
    if (videoPlayer.readyState >= 2 && !videoPlayer.paused && !videoPlayer.ended) {
        captureCurrentFrame();
    }
    
    // Check if video is preloaded
    const preloadedVideo = preloadedVideos.get(videoKey);
    
    if (preloadedVideo && preloadedVideo.readyState >= 3) {
        // Use preloaded video data
        videoPlayer.src = data.src;
        clearHotspots();
        
        // Wait for the new video to be ready
        videoPlayer.load();
        
        const playPromise = new Promise((resolve) => {
            const onCanPlay = () => {
                videoPlayer.removeEventListener('canplay', onCanPlay);
                hideLastFrame();
                if (autoplay) {
                    videoPlayer.play().then(resolve).catch(err => {
                        handlePlayError(err);
                        resolve();
                    });
                } else {
                    resolve();
                }
            };
            videoPlayer.addEventListener('canplay', onCanPlay);
        });
        
        await playPromise;
    } else {
        // Load video normally
        videoPlayer.src = data.src;
        clearHotspots();
        videoPlayer.load();
        
        // Wait for video to be ready
        const loadPromise = new Promise((resolve) => {
            const onLoadedData = () => {
                videoPlayer.removeEventListener('loadeddata', onLoadedData);
                hideLastFrame();
                if (autoplay) {
                    videoPlayer.play().then(resolve).catch(err => {
                        handlePlayError(err);
                        resolve();
                    });
                } else {
                    resolve();
                }
            };
            videoPlayer.addEventListener('loadeddata', onLoadedData);
        });
        
        await loadPromise;
    }
    
    // Predict and preload next videos
    predictAndPreloadNextVideos(videoKey);
    
    updatePlayPauseButton();
    isTransitioning = false;
}

function createHotspots() {
    clearHotspots(); 
    const data = videoData[currentVideoKey];
    if (!data || !data.hotspots || data.isLogicHop) return;

    const currentTime = videoPlayer.currentTime;

    data.hotspots.forEach(hs => {
        if (currentTime >= hs.startTime && currentTime <= hs.endTime) {
            const hotspotElement = document.createElement('div');
            hotspotElement.className = 'hotspot';
            if (hs.shape === 'circle') hotspotElement.classList.add('circle');
            hotspotElement.id = `hotspot-${hs.id}`;
            hotspotElement.textContent = hs.text || ''; 
            hotspotElement.dataset.targetVideo = hs.targetVideo; 
            if(hs.shotDirection) hotspotElement.dataset.shotDirection = hs.shotDirection;
            if(hs.character) hotspotElement.dataset.character = hs.character; // For confirm character logic
            
            if (hs.shape === 'circle') {
                hotspotElement.style.width = `${hs.r * 2}%`;
                hotspotElement.style.height = `${hs.r * 2}%`;
                hotspotElement.style.left = `${hs.cx - hs.r}%`;
                hotspotElement.style.top = `${hs.cy - hs.r}%`;
                hotspotElement.style.borderRadius = '50%';
            } else { 
                hotspotElement.style.left = `${hs.x}%`;
                hotspotElement.style.top = `${hs.y}%`;
                hotspotElement.style.width = `${hs.width}%`;
                hotspotElement.style.height = `${hs.height}%`;
            }
            
            hotspotElement.addEventListener('click', (event) => {
                playUiClick();
                const target = event.currentTarget.dataset.targetVideo;
                const shotDir = event.currentTarget.dataset.shotDirection;
                const characterToConfirm = event.currentTarget.dataset.character;

                if (target === 'LOGIC_CONFIRM_CHARACTER' && characterToConfirm) {
                    confirmCharacter(characterToConfirm);
                } else if (target === 'LOGIC_HANDLE_SHOT' && shotDir) {
                    handleShotChoice(shotDir); 
                } else if (target) {
                    // Preload the target video before loading
                    preloadVideo(target);
                    loadVideo(target, true);
                } else {
                    console.warn("Hotspot clicked but no targetVideo/logic defined:", hs);
                }
            });
            hotspotContainer.appendChild(hotspotElement);
            activeHotspots.push(hotspotElement);
        }
    });
}

function clearHotspots() {
    activeHotspots.forEach(hs => hs.remove());
    activeHotspots = [];
}

function updatePlayPauseButton() {
    if (videoPlayer.paused || videoPlayer.ended) {
        playPauseButton.textContent = 'Play';
    } else {
        playPauseButton.textContent = 'Pause';
    }
}

function handleShotChoice(shotDirection) {
    const keeperActions = ['dive_left', 'dive_right', 'stay_middle'];
    const randomKeeperAction = keeperActions[Math.floor(Math.random() * keeperActions.length)];
    
    console.log(`${gameState.selectedCharacterName} chose: ${shotDirection}, Keeper action: ${randomKeeperAction}`);

    let outcomeKeyRoot = '';
    let goalScored = false;

    if (shotDirection === 'left') {
        if (randomKeeperAction === 'dive_left') { outcomeKeyRoot = `shot_left_vs_keeper_dive_left_save_${gameState.selectedCharacterName}_01`; goalScored = false; }
        else { outcomeKeyRoot = `shot_left_vs_keeper_${randomKeeperAction === 'dive_right' ? 'dive_right' : 'stay_middle'}_goal_${gameState.selectedCharacterName}_01`; goalScored = true; }
    } else if (shotDirection === 'middle') {
        if (randomKeeperAction === 'stay_middle') { outcomeKeyRoot = `shot_middle_vs_keeper_stay_middle_save_${gameState.selectedCharacterName}_01`; goalScored = false; }
        else { outcomeKeyRoot = `shot_middle_vs_keeper_${randomKeeperAction === 'dive_left' ? 'dive_left' : 'dive_right'}_goal_${gameState.selectedCharacterName}_01`; goalScored = true; }
    } else { // shotDirection === 'right'
        if (randomKeeperAction === 'dive_right') { outcomeKeyRoot = `shot_right_vs_keeper_dive_right_save_${gameState.selectedCharacterName}_01`; goalScored = false; }
        else { outcomeKeyRoot = `shot_right_vs_keeper_${randomKeeperAction === 'dive_left' ? 'dive_left' : 'stay_middle'}_goal_${gameState.selectedCharacterName}_01`; goalScored = true; }
    }
    
    const outcomeVideoKey = outcomeKeyRoot;

    if (goalScored) { gameState.playerScore++; } 
    gameState.kicksTaken++;
    
    // Update message AFTER a short delay to let current action message show
    setTimeout(() => {
        messageArea.textContent = `Keeper ${randomKeeperAction}. ${goalScored ? 'GOAL!' : 'SAVE!'} (${gameState.selectedCharacterName}). Score: ${gameState.playerScore}. Kicks: ${gameState.kicksTaken}/${gameState.maxKicks}`;
    }, 100);

    // Preload the outcome video before playing
    if (videoData[outcomeVideoKey]) {
        preloadVideo(outcomeVideoKey);
        loadVideo(outcomeVideoKey, true);
    } else {
        console.error("Outcome video key not found:", outcomeVideoKey);
        messageArea.textContent = `Error: Outcome video for ${shotDirection} vs ${randomKeeperAction} (${gameState.selectedCharacterName}) not found. Key: ${outcomeVideoKey}`;
        // Fallback: go to a generic reaction for the player or to scoreboard
        const fallbackKey = goalScored ? `pk_react_goal_player_celeb_${gameState.selectedCharacterName}_01` : `pk_react_save_keeper_celeb_${gameState.selectedCharacterName}_01`;
        preloadVideo(fallbackKey);
        loadVideo(fallbackKey, true);
    }
}

// --- Event Listeners ---
videoPlayer.addEventListener('timeupdate', () => {
    const data = videoData[currentVideoKey];
    if (!data || !data.hotspots || data.hotspots.length === 0 || data.isLogicHop) {
        if (activeHotspots.length > 0) clearHotspots(); return;
    }
    let needsHotspotUpdate = false;
    const currentTime = videoPlayer.currentTime;
    for (const hs of data.hotspots) {
        const isDisplayed = activeHotspots.some(el => el.id === `hotspot-${hs.id}`);
        const shouldBe = currentTime >= hs.startTime && currentTime <= hs.endTime;
        if (shouldBe && !isDisplayed) { needsHotspotUpdate = true; break; }
        if (!shouldBe && isDisplayed) { needsHotspotUpdate = true; break; }
    }
    if (needsHotspotUpdate) createHotspots();
});

videoPlayer.addEventListener('ended', () => {
    updatePlayPauseButton(); 
    clearHotspots(); 
    const data = videoData[currentVideoKey];
    if (data && data.onEnd) {
        // Preload the next video before loading
        preloadVideo(data.onEnd);
        loadVideo(data.onEnd, true);
    } else if (data && !data.isLogicHop) {
         messageArea.textContent = `Video "${currentVideoKey}" ended.`;
    }
});

videoPlayer.addEventListener('play', () => {
    const data = videoData[currentVideoKey];
    updatePlayPauseButton();
});

videoPlayer.addEventListener('pause', () => {
    const data = videoData[currentVideoKey];
    updatePlayPauseButton();
});
        
videoPlayer.addEventListener('loadeddata', () => {
    const data = videoData[currentVideoKey];
    createHotspots(); 
    updatePlayPauseButton();
});

videoPlayer.addEventListener('error', (e) => {
    console.error("Video Error:", videoPlayer.error, "on key:", currentVideoKey, "src:", videoPlayer.currentSrc);
    let msg = `Error loading video: ${currentVideoKey}.`;
    if(videoPlayer.error) msg += ` Code: ${videoPlayer.error.code}. ${videoPlayer.error.message || ''}.`;
    messageArea.textContent = msg + " Check paths & files.";
    const data = videoData[currentVideoKey];
    videoPlayer.poster = (data && data.poster) ? data.poster.replace("FFF", "F00").replace("text=","text=LOAD+ERROR+-+") : 'https://placehold.co/960x540/F00/FFF?text=Video+Load+Error';
    updatePlayPauseButton();
    isTransitioning = false;
    hideLastFrame();
});

playPauseButton.addEventListener('click', () => {
    playUiClick();
    if (!videoPlayer.src || videoPlayer.src === window.location.href || videoPlayer.error) {
        messageArea.textContent = "No valid video or error. Loading initial...";
        loadVideo(currentVideoKey || 'pk_cin_stadium_flythrough_01', false);
        setTimeout(() => {
            if (videoPlayer.src && videoPlayer.src !== window.location.href && !videoPlayer.error) {
                 videoPlayer.play().catch(handlePlayError);
            } else if (!videoPlayer.error) {
                messageArea.textContent = "Src not set. Check config.";
            }
        }, 150); return;
    }
    if (videoPlayer.paused || videoPlayer.ended) {
        videoPlayer.play().catch(handlePlayError);
        overlayPlayButton.classList.add('hidden');
    } else {
        videoPlayer.pause();
    }
});

function handlePlayError(error) {
    messageArea.textContent = `Playback error: ${error.message}.`;
    console.error("Play error:", error); 
    updatePlayPauseButton();
}

restartButton.addEventListener('click', () => {
    playUiClick();
    messageArea.textContent = 'Restarting game...';
    videoPlayer.pause(); 
    resetGameState();
    // Clear last frame on restart
    hideLastFrame();
    loadVideo('pk_cin_stadium_flythrough_01', true);
});

overlayPlayButton.addEventListener('click', () => {
    playUiClick();
    overlayPlayButton.classList.add('hidden');
    videoPlayer.play().catch(handlePlayError);
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize last frame capture
    initializeLastFrameCapture();
    
    resetGameState();
    showMainMenuScreen();
    messageArea.textContent = "Welcome to Penalty King!";
    
    // Preload the initial video
    preloadVideo('pk_cin_stadium_flythrough_01');
    // Preload character select videos
    preloadVideo('pk_charselect_ronaldo_01');
    preloadVideo('pk_charselect_messi_01');

    document.querySelectorAll('.select-character').forEach(btn => {
        btn.addEventListener('click', () => {
            const character = btn.dataset.character;
            hideCharacterSelectScreen();
            confirmCharacter(character);
        });
    });

    const playBtn = document.getElementById('menu-play');
    const charBtn = document.getElementById('menu-character-select');
    const settingsBtn = document.getElementById('menu-settings');
    [playBtn, charBtn, settingsBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', startGame);
    });
});
