export const NG_SETS = {
    human: {
        fighter: {
            armor: { name: "Wooden Brigandine", type: "leather", grade: "NG", defense: 6, stats: { maxHp: 20 } },
            weapon: { name: "Rusty Broadsword", type: "sword", damage: 9, grade: "NG", stats: { CRIT: 2 } }
        },
        mystic: {
            armor: { name: "Apprentice Tunic", type: "cloth", grade: "NG", defense: 4, stats: { maxMp: 30 } },
            weapon: { name: "Apprentice Staff", type: "staff", damage: 5, grade: "NG", stats: { MATK: 8 } }
        }
    },
    elf: {
        fighter: {
            armor: { name: "Leather Tunic", type: "leather", grade: "NG", defense: 5, stats: { DEX: 1 } },
            weapon: { name: "Short Dagger", type: "dagger", damage: 7, grade: "NG", stats: { attackSpeed: 20 } }
        },
        mystic: {
            armor: { name: "Elven Tunic", type: "cloth", grade: "NG", defense: 3, stats: { maxMp: 40 } },
            weapon: { name: "Willow Staff", type: "staff", damage: 4, grade: "NG", stats: { MATK: 9 } }
        }
    },
    dark_elf: {
        fighter: {
            armor: { name: "Dark Stockings", type: "leather", grade: "NG", defense: 5, stats: { STR: 1 } },
            weapon: { name: "Ritual Sword", type: "sword", damage: 10, grade: "NG", stats: { CRIT: 4 } }
        },
        mystic: {
            armor: { name: "Shadow Tunic", type: "cloth", grade: "NG", defense: 3, stats: { INT: 1 } },
            weapon: { name: "Bone Staff", type: "staff", damage: 6, grade: "NG", stats: { MATK: 12 } }
        }
    }
};