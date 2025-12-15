# Needed Assets Checklist

To replace the fallback models with production assets, please provide the following `.glb` files in the `/assets/` directory.

## Player Models (Humanoid)
All humanoid models should share a compatible skeleton/rig if possible to share animations, or provide specific animations for each.

### Human
- `/assets/models/races/human/human_idle.glb`
- `/assets/models/races/human/human_walk.glb`
- `/assets/models/races/human/human_run.glb`
- `/assets/models/races/human/human_attack.glb`
- `/assets/models/races/human/human_death.glb` (optional)

### Elf
- `/assets/models/races/elf/elf_idle.glb`
- `/assets/models/races/elf/elf_walk.glb`
- `/assets/models/races/elf/elf_run.glb`
- `/assets/models/races/elf/elf_attack.glb`

### Dark Elf
- `/assets/models/races/dark_elf/dark_elf_idle.glb`
- `/assets/models/races/dark_elf/dark_elf_walk.glb`
- `/assets/models/races/dark_elf/dark_elf_run.glb`
- `/assets/models/races/dark_elf/dark_elf_attack.glb`

## Monster Models

### Wolf
- `/assets/models/monsters/wolf/wolf.glb` (Base mesh with animations embedded OR separate files below)
- Animations needed (embedded or separate):
  - `idle`
  - `walk` / `run`
  - `attack`
  - `death`

### Spider (Future)
- `/assets/models/monsters/spider/spider.glb`

### Goblin (Future)
- `/assets/models/monsters/goblin/goblin.glb`

## Audio
- Background music for login/character select.
- Sound effects for:
  - Sword swing / Hit impact
  - Footsteps
  - Spell casting
  - Level up
