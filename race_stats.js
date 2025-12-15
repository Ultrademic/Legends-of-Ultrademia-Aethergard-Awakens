export const RACE_STATS = {

    // 🧝 LIGHT ELVES — Aether Elves (Roinne Lineage Possible)
    elf: {
        name: "Elf",
        STR: 36,   // lighter physical power
        CON: 36,   // lighter durability
        DEX: 35,   // fast archery / movement
        WIT: 14,   // fastest cast speed
        INT: 23,   // strong magic power
        MEN: 26,   // good mana pool

        // racial passives
        bonuses: {
            castSpeed: 1.10,     // +10% cast speed
            manaRegen: 1.20,     // +20% mana regen
            bowSpeed: 1.05,      // +5% bow draw
            movement: 1.02       // subtle mobility boost
        },

        description:
            "Elves are revered children of Vel’Astra, blessed with high aether affinity and superior agility."
    },

    // 🌑 DARK ELVES — Umbral Elves
    dark_elf: {
        name: "Dark Elf",
        STR: 41,   // highest melee potential
        CON: 32,   // lowest durability
        DEX: 34,   // agile
        WIT: 12,   // slower cast
        INT: 25,   // strong magic damage
        MEN: 26,   // strong mana pool

        bonuses: {
            manaRegen: 1.35,     // +35% mana regen (highest)
            darkAffinity: 1.10,  // +10% shadow damage
            critRate: 1.05,      // +5% crit chance
            attackSpeed: 1.03    // quick assassin strikes
        },

        description:
            "Dark Elves of Nhar’Lith wield forbidden aether, mastering curses, shadow magic, and deadly precision."
    },

    // 🛡 HUMANS — Astryn Humans
    human: {
        name: "Human",
        STR: 40,   // strong
        CON: 43,   // highest durability
        DEX: 30,   // average
        WIT: 11,   // slow cast
        INT: 21,   // low magic
        MEN: 25,   // solid mana

        bonuses: {
            hpBonus: 1.15,       // +15% HP
            defenseBonus: 1.10,  // +10% physical defense
            staminaRegen: 1.10,  // better natural regen
            balance: 1.00        // no racial penalties
        },

        description:
            "Humans of Astryn possess unmatched resilience and versatility, excelling as frontline fighters."
    }

};
