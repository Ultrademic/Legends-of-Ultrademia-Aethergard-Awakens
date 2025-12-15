export const BASE_CLASSES = {
    human: {
        fighter: {
            name: "Human Fighter",
            description: "A master of physical combat, relying on strength and constitution.",
            armor: "leather", 
            weapons: ["sword", "blunt"],
            roles: ["tank", "warrior", "rogue"],
            icon: "sword"
        },
        mystic: {
            name: "Human Mystic",
            description: "A scholar of the arcane, channeling elements and divine magic.",
            armor: "cloth",
            weapons: ["staff", "book"],
            roles: ["sorcerer", "cleric", "summoner"],
            icon: "sparkles"
        }
    },
    elf: {
        fighter: {
            name: "Elven Fighter",
            description: "An agile warrior utilizing dexterity and speed.",
            armor: "leather",
            weapons: ["sword", "bow", "dagger"],
            roles: ["scout", "ranger", "tank"],
            icon: "sword"
        },
        mystic: {
            name: "Elven Mystic",
            description: "A conduit of light and water magic, casting with great speed.",
            armor: "cloth",
            weapons: ["staff"],
            roles: ["wizard", "oracle", "elementalist"],
            icon: "sparkles"
        }
    },
    dark_elf: {
        fighter: {
            name: "Dark Fighter",
            description: "A deadly combatant focusing on critical strikes and offense.",
            armor: "leather",
            weapons: ["sword", "dagger"],
            roles: ["assassin", "shillien knight", "bladedancer"],
            icon: "sword"
        },
        mystic: {
            name: "Dark Mystic",
            description: "A wielder of dark arts and shadowy curses.",
            armor: "cloth",
            weapons: ["staff"],
            roles: ["dark wizard", "shillien oracle", "phantom summoner"],
            icon: "sparkles"
        }
    }
};