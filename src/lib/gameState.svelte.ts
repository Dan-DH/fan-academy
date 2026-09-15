import type { UserProfile } from './components/Navbar.svelte';

export class GameState {
  // Portal Navigation
  activeNav = $state('home');
  serverOnline = $state(true);
  onlinePlayersCount = $state(1420);
  currentUser = $state<UserProfile | null>(null);
  lastActionMessage = $state<string | null>(null);

  // Quick In-Game stats when user launches game
  isPlaying = $state(false);
  gold = $state(15420);
  gems = $state(340);
  energy = $state(42);
  maxEnergy = $state(50);

  login(username: string = 'Archmage_Valerius') {
    this.currentUser = {
      username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      level: 24
    };
    this.showToast(`Logged in successfully as ${username}!`);
  }

  register(username: string = 'NewHero_Dawn') {
    this.currentUser = {
      username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      level: 1
    };
    this.showToast(`Welcome ${username}! Starter Pack unlocked.`);
  }

  logout() {
    this.currentUser = null;
    this.showToast('You have been logged out.');
  }

  playNow() {
    this.isPlaying = true;
    this.showToast('Launching Fan Academy WebGL Arena...');
  }

  exitGame() {
    this.isPlaying = false;
    this.showToast('Returned to Game Portal.');
  }

  showToast(msg: string) {
    this.lastActionMessage = msg;
    setTimeout(() => {
      if (this.lastActionMessage === msg) {
        this.lastActionMessage = null;
      }
    }, 3000);
  }
}

export const gameState = new GameState();
