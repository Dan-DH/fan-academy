import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Navbar from '../../src/lib/components/Navbar.svelte';

describe('Navbar Component SSR & Render Tests', () => {
  it('renders game title and brand elements properly', () => {
    const result = render(Navbar, {
      props: {
        gameTitle: 'FAN ACADEMY',
        onlinePlayersCount: 2500,
        serverOnline: true
      }
    });

    expect(result.body).toContain('FAN ACADEMY');
    expect(result.body).toContain('2,500 Playing');
    expect(result.body).toContain('How to Play');
    expect(result.body).toContain('FAQ');
    expect(result.body).toContain('Factions');
  });

  it('renders visitor buttons when currentUser is null', () => {
    const result = render(Navbar, {
      props: {
        currentUser: null
      }
    });

    expect(result.body).toContain('Login');
    expect(result.body).toContain('Register');
    expect(result.body).toContain('Play Now');
  });

  it('renders player profile badge when currentUser is present', () => {
    const result = render(Navbar, {
      props: {
        currentUser: {
          username: 'Archmage_Ignis',
          level: 30
        }
      }
    });

    expect(result.body).toContain('Archmage_Ignis');
  });

  it('renders modals for How to Play and FAQ', () => {
    const result = render(Navbar, {
      props: {}
    });

    expect(result.body).toContain('How to Play Fan Academy');
    expect(result.body).toContain('Frequently Asked Questions');
    expect(result.body).toContain('Is Fan Academy free to play?');
  });
});
