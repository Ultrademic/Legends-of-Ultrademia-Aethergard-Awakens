import React, { useEffect, useRef } from 'react';
import { Race } from '../types';

interface GameCanvasProps {
  race: Race;
  playerClass: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ race, playerClass }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initGame = async () => {
      try {
        const { renderer } = await import('../core/renderer.js');
        const { startEngine } = await import('../core/engine.js');
        const { loadZone } = await import('../core/scene_loader.js');
        const { player } = await import('../modules/characters/player.js');
        const { initInput } = await import('../core/input.js');
        const { initTargeting } = await import('../modules/combat/targeting.js');

        if (containerRef.current && renderer.domElement) {
          containerRef.current.innerHTML = ''; 
          containerRef.current.appendChild(renderer.domElement);
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        initInput();
        initTargeting();

        console.log(`[GameCanvas] Initializing for race: ${race}, class: ${playerClass}`);
        
        // Ensure archetype is derived correctly if playerClass string is passed directly
        // We assume App.tsx passes the localized string, but spawn needs 'fighter'/'mystic'
        // Ideally we pass that prop, but for now we rely on player internal state handling or refetching
        // Since player.spawn(race, archetype) is how we call it in App.tsx BEFORE mounting,
        // we might actually be double-initializing. 
        // Ideally App.tsx calls spawn, then mounts this. 
        // But since this mounts, let's just ensure the zone loads.
        
        await loadZone("village");
        startEngine();
      } catch (err) {
        console.error("Game Init Failed:", err);
      }
    };

    initGame();

  }, [race, playerClass]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black overflow-hidden" />
  );
};