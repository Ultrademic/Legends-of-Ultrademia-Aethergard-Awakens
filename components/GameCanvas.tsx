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