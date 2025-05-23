// --- DOM Elements ---
const videoPlayer = document.getElementById('main-video-player');
const hotspotContainer = document.getElementById('hotspot-container');
const messageArea = document.getElementById('message-area');
const playPauseButton = document.getElementById('play-pause-button');
const restartButton = document.getElementById('restart-button');

// --- Game Configuration ---
// IMPORTANT: Populate this with ALL your video data based on the "Video & Hotspot Draft".
// Paths are relative to index.html (e.g., 'videos/your_video_name.mp4').
const videoData = {
    // I. Pre-Match Cinematics
    'pre_match_stadium_flythrough': {
        src: 'videos/pk_cin_stadium_flythrough_01.mp4',
        poster: 'https://placehold.co/960x540/333/FFF?text=Stadium+Flythrough',
        hotspots: [],
        onEnd: 'pre_match_tunnel_walk'
    },
    'pre_match_tunnel_walk': {
        src: 'videos/pk_cin_tunnel_walk_01.mp4',
        poster: 'https://placehold.co/960x540/333/FFF?text=Tunnel+Walk',
        hotspots: [],
        onEnd: 'pre_match_name_screen'
    },
    'pre_match_name_screen': {
        src: 'videos/pk_cin_name_screen_01.mp4',
        poster: 'https://placehold.co/960x540/333/FFF?text=Penalty+King',
        hotspots: [
            { id: 'start_game_button', text: 'Start Game', shape: 'circle', cx: 50, cy: 80, r: 10, startTime: 1, endTime: 10, targetVideo: 'character_select_intro' }
        ],
        onEnd: 'character_select_intro' // If no interaction
    },

    // II. Character Select System
    'character_select_intro': {
        src: 'videos/pk_charselect_intro_01.mp4',
        poster: 'https://placehold.co/960x540/444/FFF?text=Character+Select',
        hotspots: [
            // Example for Blitz - Repeat for all 9 characters
            { id: 'select_blitz', text: 'Blitz', shape: 'circle', cx: 20, cy: 30, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_blitz', characterName: 'Blitz' },
            { id: 'select_rafa', text: 'Rafa', shape: 'circle', cx: 35, cy: 30, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_rafa', characterName: 'Rafa' },
            { id: 'select_kaya', text: 'Kaya', shape: 'circle', cx: 50, cy: 30, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_kaya', characterName: 'Kaya' },
            // ... Add hotspots for Viktor, Zara, Dante, Hana, Lux, Musa
            { id: 'select_viktor', text: 'Viktor', shape: 'circle', cx: 65, cy: 30, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_viktor', characterName: 'Viktor' },
            { id: 'select_zara', text: 'Zara', shape: 'circle', cx: 80, cy: 30, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_zara', characterName: 'Zara' },
            { id: 'select_dante', text: 'Dante', shape: 'circle', cx: 20, cy: 60, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_dante', characterName: 'Dante' },
            { id: 'select_hana', text: 'Hana', shape: 'circle', cx: 35, cy: 60, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_hana', characterName: 'Hana' },
            { id: 'select_lux', text: 'Lux', shape: 'circle', cx: 50, cy: 60, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_lux', characterName: 'Lux' },
            { id: 'select_musa', text: 'Musa', shape: 'circle', cx: 65, cy: 60, r: 8, startTime: 1, endTime: 15, targetVideo: 'idle_musa', characterName: 'Musa' },
        ],
        // onEnd: waits for user interaction
    },
    // --- Character Idle Videos (Example for Blitz, repeat for all 9) ---
    'idle_blitz': {
        src: 'videos/pk_char_blitz_idle_01.mp4',
        poster: 'https://placehold.co/960x540/555/FFF?text=Blitz+Locker+Room',
        hotspots: [
            { id: 'confirm_blitz', text: 'Confirm Blitz', shape: 'rectangle', x: 35, y: 80, width: 30, height: 10, startTime: 0, endTime: 60, targetVideo: 'penalty_kick_setup' },
            { id: 'back_to_char_select_blitz', text: 'Back', shape: 'rectangle', x: 5, y: 80, width: 20, height: 10, startTime: 0, endTime: 60, targetVideo: 'character_select_intro' }
        ]
    },
    'idle_rafa': { src: 'videos/pk_char_rafa_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Rafa', hotspots: [{id:'confirm_rafa', text:'Confirm Rafa', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_rafa', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_kaya': { src: 'videos/pk_char_kaya_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Kaya', hotspots: [{id:'confirm_kaya', text:'Confirm Kaya', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_kaya', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_viktor': { src: 'videos/pk_char_viktor_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Viktor', hotspots: [{id:'confirm_viktor', text:'Confirm Viktor', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_viktor', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_zara': { src: 'videos/pk_char_zara_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Zara', hotspots: [{id:'confirm_zara', text:'Confirm Zara', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_zara', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_dante': { src: 'videos/pk_char_dante_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Dante', hotspots: [{id:'confirm_dante', text:'Confirm Dante', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_dante', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_hana': { src: 'videos/pk_char_hana_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Hana', hotspots: [{id:'confirm_hana', text:'Confirm Hana', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_hana', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_lux': { src: 'videos/pk_char_lux_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Lux', hotspots: [{id:'confirm_lux', text:'Confirm Lux', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_lux', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    'idle_musa': { src: 'videos/pk_char_musa_idle_01.mp4', poster: 'https://placehold.co/960x540/555/FFF?text=Musa', hotspots: [{id:'confirm_musa', text:'Confirm Musa', shape:'rectangle', x:35,y:80,width:30,height:10,startTime:0,endTime:60,targetVideo:'penalty_kick_setup'},{id:'back_to_char_select_musa', text:'Back', shape:'rectangle',x:5,y:80,width:20,height:10,startTime:0,endTime:60,targetVideo:'character_select_intro'}] },
    
    // III. Gameplay Animations – Penalty Kick Setup
    'penalty_kick_setup': {
        src: 'videos/pk_game_penalty_setup_01.mp4',
        poster: 'https://placehold.co/960x540/666/FFF?text=Penalty+Setup',
        hotspots: [
            { id: 'shoot_left', text: '', shape: 'circle', cx: 25, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'left' },
            { id: 'shoot_middle', text: '', shape: 'circle', cx: 50, cy: 45, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'middle' },
            { id: 'shoot_right', text: '', shape: 'circle', cx: 75, cy: 50, r: 12, startTime: 3, endTime: 8, targetVideo: 'LOGIC_HANDLE_SHOT', shotDirection: 'right' }
        ]
        // onEnd: if no choice, could loop or timeout. For now, assumes choice.
    },

    // IV. Gameplay Animations – Shot vs. Keeper Outcomes (9 Videos)
    // GOAL OUTCOMES
    'shot_left_vs_keeper_dive_right_goal': { src: 'videos/pk_game_shotL_keepR_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    'shot_left_vs_keeper_stay_middle_goal': { src: 'videos/pk_game_shotL_keepM_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    'shot_middle_vs_keeper_dive_left_goal': { src: 'videos/pk_game_shotM_keepL_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    'shot_middle_vs_keeper_dive_right_goal': { src: 'videos/pk_game_shotM_keepR_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    'shot_right_vs_keeper_dive_left_goal': { src: 'videos/pk_game_shotR_keepL_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    'shot_right_vs_keeper_stay_middle_goal': { src: 'videos/pk_game_shotR_keepM_goal_01.mp4', poster: 'https://placehold.co/960x540/0A0/FFF?text=GOAL!', hotspots: [], onEnd: 'reaction_goal_player_celeb' },
    // SAVE OUTCOMES
    'shot_left_vs_keeper_dive_left_save': { src: 'videos/pk_game_shotL_keepL_save_01.mp4', poster: 'https://placehold.co/960x540/A00/FFF?text=SAVE!', hotspots: [], onEnd: 'reaction_save_keeper_celeb' },
    'shot_middle_vs_keeper_stay_middle_save': { src: 'videos/pk_game_shotM_keepM_save_01.mp4', poster: 'https://placehold.co/960x540/A00/FFF?text=SAVE!', hotspots: [], onEnd: 'reaction_save_keeper_celeb' },
    'shot_right_vs_keeper_dive_right_save': { src: 'videos/pk_game_shotR_keepR_save_01.mp4', poster: 'https://placehold.co/960x540/A00/FFF?text=SAVE!', hotspots: [], onEnd: 'reaction_save_keeper_celeb' },

    // V. Cinematic Content – Result Reactions (6 Videos)
    'reaction_goal_player_celeb': { src: 'videos/pk_react_goal_playerceleb_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Player+Celebrates', hotspots: [], onEnd: 'reaction_goal_keeper_frust' },
    'reaction_goal_keeper_frust': { src: 'videos/pk_react_goal_keeperfrust_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Keeper+Frustrated', hotspots: [], onEnd: 'reaction_crowd_cheers_goal' },
    'reaction_crowd_cheers_goal': { src: 'videos/pk_react_crowd_cheers_goal_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Crowd+Cheers', hotspots: [], onEnd: 'transition_scoreboard_update' }, // Or check win condition

    'reaction_save_keeper_celeb': { src: 'videos/pk_react_save_keeperceleb_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Keeper+Celebrates+Save', hotspots: [], onEnd: 'reaction_save_player_disappoint' },
    'reaction_save_player_disappoint': { src: 'videos/pk_react_save_playerdisappoint_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Player+Disappointed', hotspots: [], onEnd: 'reaction_crowd_gasp_save' },
    'reaction_crowd_gasp_save': { src: 'videos/pk_react_crowd_gasp_save_01.mp4', poster: 'https://placehold.co/960x540/777/FFF?text=Crowd+Gasps', hotspots: [], onEnd: 'transition_scoreboard_update' }, // Or check lose condition

    // VI. Cinematic Content – Victory Sequences (3 Videos)
    'win_celeb_teammates_rush': { src: 'videos/pk_win_teammates_rush_01.mp4', poster: 'https://placehold.co/960x540/888/FFF?text=Teammates+Rush', hotspots: [], onEnd: 'win_celeb_group_hug' },
    'win_celeb_group_hug': { src: 'videos/pk_win_group_hug_01.mp4', poster: 'https://placehold.co/960x540/888/FFF?text=Group+Hug', hotspots: [], onEnd: 'win_celeb_confetti' },
    'win_celeb_confetti': { src: 'videos/pk_win_confetti_crowd_01.mp4', poster: 'https://placehold.co/960x540/888/FFF?text=Confetti!', hotspots: [], onEnd: 'game_over_screen_win' },

    // VII. Cinematic Content – Transitions & Polish (3 Videos)
    'transition_scoreboard_update': {
        src: 'videos/pk_trans_scoreboard_update_01.mp4',
        poster: 'https://placehold.co/960x540/999/FFF?text=Scoreboard',
        hotspots: [],
        // onEnd logic will be more complex: check game state (more kicks? game over?)
        // For now, let's assume it leads to next kick or a generic game over.
        // This should be handled by a game state management function.
        onEnd: 'check_game_state_after_scoreboard' // Placeholder for game logic
    },
    'transition_stadium_flyover': { src: 'videos/pk_trans_stadium_flyover_01.mp4', poster: 'https://placehold.co/960x540/999/FFF?text=Stadium+Flyover', hotspots: [], onEnd: 'pre_match_tunnel_walk' }, // Example
    'transition_get_ready': { src: 'videos/pk_trans_get_ready_01.mp4', poster: 'https://placehold.co/960x540/999/FFF?text=Get+Ready', hotspots: [], onEnd: 'penalty_kick_setup' },

    // Game Over Screens
    'game_over_screen_win': {
        src: 'videos/pk_gameover_win_01.mp4', // Create this video
        poster: 'https://placehold.co/960x540/AAA/FFF?text=YOU+WIN!',
        hotspots: [
            { id: 'restart_from_win', text: 'Play Again?', shape: 'rectangle', x: 35, y: 70, width: 30, height: 10, startTime: 1, endTime: 20, targetVideo: 'pre_match_name_screen' }
        ],
        onEnd: 'pre_match_name_screen'
    },
    'game_over_screen_lose': {
        src: 'videos/pk_gameover_lose_01.mp4', // Create this video
        poster: 'https://placehold.co/960x540/AAA/FFF?text=GAME+OVER',
        hotspots: [
            { id: 'restart_from_lose', text: 'Try Again?', shape: 'rectangle', x: 35, y: 70, width: 30, height: 10, startTime: 1, endTime: 20, targetVideo: 'pre_match_name_screen' }
        ],
        onEnd: 'pre_match_name_screen'
    },
    // Placeholder for game logic transition
    'check_game_state_after_scoreboard': {
        src: '', // This isn't a real video, but a logic hop.
        poster: 'https://placehold.co/960x540/000/FFF?text=Checking+State',
        isLogicHop: true, // Custom flag
        onLogic: () => { // Custom function to be called
            // TODO: Implement game state logic here
            // e.g., check score, number of kicks taken.
            // For now, just go to next kick or a win/lose screen randomly for demo
            const score = { player: 0, opponent: 0 }; // Placeholder
            const kicksTaken = 0; // Placeholder
            if (kicksTaken < 5) { // Example: 5 kicks per game
                return 'penalty_kick_setup';
            } else {
                return score.player > score.opponent ? 'win_celeb_teammates_rush' : 'game_over_screen_lose';
            }
        }
    },
    // Fallback / Example start videos from original template
    'start': { // This was the original 'start' for basic demo
        src: 'videos/intro_sequence.mp4', 
        poster: 'https://placehold.co/960x540/333333/FFFFFF?text=Intro+Sequence+(Old)',
        hotspots: [
            { id: 'option1_old', text: 'Go Left (Old)', shape: 'rectangle', x: 10, y: 70, width: 30, height: 15, startTime: 3, endTime: 7, targetVideo: 'outcome_left_old' },
            { id: 'option2_old', text: 'Go Right (Old)', shape: 'rectangle', x: 60, y: 70, width: 30, height: 15, startTime: 3, endTime: 7, targetVideo: 'outcome_right_old' }
        ],
        onEnd: 'pre_match_stadium_flythrough' // Point to the new start of the game
    },
    'outcome_left_old': { src: 'videos/player_goes_left.mp4', poster: 'https://placehold.co/960x540/55AA55/FFFFFF?text=Outcome:+Went+Left+(Old)', hotspots: [], onEnd: 'start' },
    'outcome_right_old': { src: 'videos/player_goes_right.mp4', poster: 'https://placehold.co/960x540/AA5555/FFFFFF?text=Outcome:+Went+Right+(Old)', hotspots: [], onEnd: 'start' }
};

let currentVideoKey = 'pre_match_stadium_flythrough'; // Start with the actual beginning
let activeHotspots = [];
// TODO: Add game state variables (score, current kicker, kicks remaining, etc.)
let gameState = {
    playerScore: 0,
    opponentScore: 0,
    kicksTaken: 0,
    maxKicks: 5, // Example: 5 kicks per shootout
    currentPlayer: null // To store selected character data if needed
};


// --- Functions ---

function loadVideo(videoKey) {
    if (!videoData[videoKey]) {
        console.error('Error: Video key not found:', videoKey);
        messageArea.textContent = `Error: Video key "${videoKey}" not found. Check videoData.`;
        videoPlayer.poster = 'https://placehold.co/960x540/FF0000/FFFFFF?text=Error:+Video+Not+Found';
        return;
    }

    currentVideoKey = videoKey;
    const data = videoData[videoKey];

    // Handle logic hops that aren't actual videos
    if (data.isLogicHop && typeof data.onLogic === 'function') {
        const nextVideoKey = data.onLogic();
        if (nextVideoKey) {
            loadVideo(nextVideoKey);
        } else {
            console.error("Logic hop did not return a next video key for:", videoKey);
            loadVideo('pre_match_name_screen'); // Fallback
        }
        return;
    }
    
    videoPlayer.src = data.src;
    videoPlayer.poster = data.poster || `https://placehold.co/960x540/111111/FFFFFF?text=${videoKey.replace(/_/g, '+')}`;
    messageArea.textContent = `Loading: ${videoKey}`;
    
    clearHotspots();
    videoPlayer.load(); 
    updatePlayPauseButton();
}

function createHotspots() {
    clearHotspots(); 
    const data = videoData[currentVideoKey];
    if (!data || !data.hotspots || data.isLogicHop) return; // Don't create hotspots for logic hops

    const currentTime = videoPlayer.currentTime;

    data.hotspots.forEach(hs => {
        if (currentTime >= hs.startTime && currentTime <= hs.endTime) {
            const hotspotElement = document.createElement('div');
            hotspotElement.className = 'hotspot';
            hotspotElement.id = `hotspot-${hs.id}`;
            hotspotElement.textContent = hs.text || ''; 
            hotspotElement.dataset.targetVideo = hs.targetVideo; 
            if(hs.shotDirection) hotspotElement.dataset.shotDirection = hs.shotDirection;
            if(hs.characterName) hotspotElement.dataset.characterName = hs.characterName;
            
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
                const target = event.currentTarget.dataset.targetVideo;
                const shotDir = event.currentTarget.dataset.shotDirection;
                const charName = event.currentTarget.dataset.characterName;

                if (charName) {
                    gameState.currentPlayer = charName; // Store selected character
                    messageArea.textContent = `${charName} selected.`;
                }

                if (target === 'LOGIC_HANDLE_SHOT' && shotDir) {
                    handleShotChoice(shotDir); 
                } else if (target) {
                    messageArea.textContent = `Hotspot "${hs.id}" clicked! Loading: ${target}`;
                    loadVideo(target);
                } else {
                    console.warn("Hotspot clicked but no targetVideo defined:", hs);
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
    messageArea.textContent = `Shot: ${shotDirection}. Keeper preparing...`;
    const keeperActions = ['dive_left', 'dive_right', 'stay_middle'];
    const randomKeeperAction = keeperActions[Math.floor(Math.random() * keeperActions.length)];
    
    console.log(`Player chose: ${shotDirection}, Keeper action: ${randomKeeperAction}`);

    let outcomeVideoKey = '';
    let goalScored = false;

    // Determine actual outcome based on the 9 defined videos
    if (shotDirection === 'left') {
        if (randomKeeperAction === 'dive_left') { outcomeVideoKey = 'shot_left_vs_keeper_dive_left_save'; goalScored = false; }
        else if (randomKeeperAction === 'dive_right') { outcomeVideoKey = 'shot_left_vs_keeper_dive_right_goal'; goalScored = true; }
        else { outcomeVideoKey = 'shot_left_vs_keeper_stay_middle_goal'; goalScored = true; } // keeper stays middle
    } else if (shotDirection === 'middle') {
        if (randomKeeperAction === 'dive_left') { outcomeVideoKey = 'shot_middle_vs_keeper_dive_left_goal'; goalScored = true; }
        else if (randomKeeperAction === 'dive_right') { outcomeVideoKey = 'shot_middle_vs_keeper_dive_right_goal'; goalScored = true; }
        else { outcomeVideoKey = 'shot_middle_vs_keeper_stay_middle_save'; goalScored = false; } // keeper stays middle
    } else { // shotDirection === 'right'
        if (randomKeeperAction === 'dive_left') { outcomeVideoKey = 'shot_right_vs_keeper_dive_left_goal'; goalScored = true; }
        else if (randomKeeperAction === 'dive_right') { outcomeVideoKey = 'shot_right_vs_keeper_dive_right_save'; goalScored = false; }
        else { outcomeVideoKey = 'shot_right_vs_keeper_stay_middle_goal'; goalScored = true; } // keeper stays middle
    }

    // Update score (basic example)
    if (goalScored) {
        gameState.playerScore++;
    } else {
        gameState.opponentScore++; // Or just no score for player
    }
    gameState.kicksTaken++;
    messageArea.textContent += ` Keeper ${randomKeeperAction}. Outcome: ${goalScored ? 'GOAL!' : 'SAVE!'}. Score: ${gameState.playerScore}-${gameState.opponentScore}. Kicks: ${gameState.kicksTaken}/${gameState.maxKicks}`;


    if (videoData[outcomeVideoKey]) {
        loadVideo(outcomeVideoKey);
    } else {
        console.error("FATAL: Outcome video key not found in videoData:", outcomeVideoKey, "Player:", shotDirection, "Keeper:", randomKeeperAction);
        messageArea.textContent = `Error: Critical outcome video for ${shotDirection} vs ${randomKeeperAction} not found.`;
        loadVideo('pre_match_name_screen'); // Fallback to a safe state
    }
}

// --- Event Listeners ---
videoPlayer.addEventListener('timeupdate', () => {
    const data = videoData[currentVideoKey];
    if (!data || !data.hotspots || data.hotspots.length === 0 || data.isLogicHop) {
        if (activeHotspots.length > 0) clearHotspots();
        return;
    }
    
    let needsHotspotUpdate = false;
    const currentTime = videoPlayer.currentTime;

    for (const hs of data.hotspots) {
        const hotspotIsCurrentlyDisplayed = activeHotspots.some(el => el.id === `hotspot-${hs.id}`);
        const shouldBeDisplayed = currentTime >= hs.startTime && currentTime <= hs.endTime;

        if (shouldBeDisplayed && !hotspotIsCurrentlyDisplayed) {
            needsHotspotUpdate = true; break;
        }
        if (!shouldBeDisplayed && hotspotIsCurrentlyDisplayed) {
            needsHotspotUpdate = true; break;
        }
    }

    if (needsHotspotUpdate) {
        createHotspots();
    }
});

videoPlayer.addEventListener('ended', () => {
    updatePlayPauseButton();
    clearHotspots(); 
    const data = videoData[currentVideoKey];
    if (data && data.onEnd) {
        messageArea.textContent = `Video "${currentVideoKey}" ended. Loading next: ${data.onEnd}`;
        loadVideo(data.onEnd);
    } else if (data && !data.isLogicHop) { // Don't show message if it was a logic hop that already transitioned
         messageArea.textContent = `Video "${currentVideoKey}" ended. No next video defined.`;
    }
});

videoPlayer.addEventListener('play', () => {
    const data = videoData[currentVideoKey];
    if (data && !data.isLogicHop) { // Don't update message for logic hops
      messageArea.textContent = `Playing: ${data.src ? data.src : currentVideoKey}`;
    }
    updatePlayPauseButton();
});

videoPlayer.addEventListener('pause', () => {
    const data = videoData[currentVideoKey];
    if (!videoPlayer.ended && data && !data.isLogicHop) { 
        messageArea.textContent = `Paused: ${currentVideoKey}`;
    }
    updatePlayPauseButton();
});
        
videoPlayer.addEventListener('loadeddata', () => {
    const data = videoData[currentVideoKey];
    if (data && !data.isLogicHop) {
        messageArea.textContent = `Video "${currentVideoKey}" loaded.`;
    }
    createHotspots(); 
    updatePlayPauseButton();
});

videoPlayer.addEventListener('error', (e) => {
    console.error("Video Error:", videoPlayer.error, "on video key:", currentVideoKey, "src:", videoPlayer.currentSrc);
    let errorMsg = `Error loading video: ${currentVideoKey}.`;
    if(videoPlayer.error) {
        errorMsg += ` Code: ${videoPlayer.error.code}. Message: ${videoPlayer.error.message || 'Unknown error'}.`;
    }
    errorMsg += " Check console, video paths, and ensure videos exist."
    messageArea.textContent = errorMsg;
    const data = videoData[currentVideoKey];
    videoPlayer.poster = (data && data.poster) ? data.poster.replace("FFF", "F00").replace("text=","text=LOAD+ERROR+-+") : 'https://placehold.co/960x540/FF0000/FFFFFF?text=Error+Loading+Video';
    updatePlayPauseButton();
});

playPauseButton.addEventListener('click', () => {
    if (!videoPlayer.src || videoPlayer.src === window.location.href || videoPlayer.error) {
        messageArea.textContent = "No valid video loaded or video error. Attempting to load initial video...";
        loadVideo(currentVideoKey || 'pre_match_stadium_flythrough'); 
        setTimeout(() => { 
            if (videoPlayer.src && videoPlayer.src !== window.location.href && !videoPlayer.error) {
                 videoPlayer.play().catch(handlePlayError);
            } else if (!videoPlayer.error) { 
                messageArea.textContent = "Video source not set. Please check configuration.";
            }
        }, 150);
        return;
    }

    if (videoPlayer.paused || videoPlayer.ended) {
        videoPlayer.play().catch(handlePlayError);
    } else {
        videoPlayer.pause();
    }
});

function handlePlayError(error) {
    messageArea.textContent = `Playback error: ${error.message}. User interaction might be needed.`;
    console.error("Play error:", error);
    updatePlayPauseButton();
}

function resetGameState() {
    gameState.playerScore = 0;
    gameState.opponentScore = 0;
    gameState.kicksTaken = 0;
    gameState.currentPlayer = null;
    messageArea.textContent = "Game state reset.";
}

restartButton.addEventListener('click', () => {
    messageArea.textContent = 'Restarting game...';
    videoPlayer.pause(); 
    resetGameState();
    loadVideo('pre_match_stadium_flythrough'); // Start from the very beginning
});

// --- Initial Load ---
window.addEventListener('load', () => {
    resetGameState();
    loadVideo('pre_match_stadium_flythrough'); 
    messageArea.textContent = "Game loaded. Press Play to start.";
});
