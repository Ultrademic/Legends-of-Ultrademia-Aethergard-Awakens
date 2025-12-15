# Testing Guide

The game is currently running in **Fallback Mode**. This means it does not require external `.glb` assets to function.

## Controls
- **WASD**: Move character
- **Mouse Right-Click + Drag**: Rotate Camera
- **Scroll Wheel**: Zoom Camera
- **1 - 8**: Use Skills (Action Bar)
- **Tab**: Cycle Targets
- **Esc**: Deselect Target / Close Windows
- **C**: Character Window
- **I** or **B**: Inventory Window

## Testing Combat
1. Walk up to a "Gladeon Wolf" (Grey Box in Fallback Mode).
2. Click it to select (Red Circle under feet).
3. Press **1** (Power Strike) or **2** (Mortal Blow/Stun).
4. Watch for:
   - Floating damage numbers (Orange/Red).
   - Health bar decreasing.
   - XP gain + Loot message on death.
   - Respawn after 8 seconds.

## Testing Quests
1. The **Village Elder** (Yellow Sphere) gives the starter quest.
2. If you don't see the dialog, click the Elder.
3. Accept "Cull the Wolves".
4. Kill 5 wolves.
5. Return to the Elder to complete and get rewards.

## Testing Shops
1. Click **Merchant Rolfe** (Blue Sphere).
2. Buy "Soulshots" or "Potions".
3. Open Inventory (I).
4. Click Soulshots to toggle Auto-Use (Cyan glow).

## Troubleshooting
- If the screen is black, check the Console (F12) for errors.
- If assets fail to load, the game automatically uses colored boxes.
