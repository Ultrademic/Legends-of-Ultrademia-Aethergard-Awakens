export const RACE_STATS = {
    elf: {
        name: "Elf",
        STR: 36,   
        CON: 36,   
        DEX: 35,   
        WIT: 14,   
        INT: 23,   
        MEN: 26,   
        bonuses: {
            castSpeed: 1.10,     
            manaRegen: 1.20,     
            bowSpeed: 1.05,      
            movement: 1.02       
        },
        description:
            "Elves are revered children of Vel’Astra, blessed with high aether affinity and superior agility."
    },
    dark_elf: {
        name: "Dark Elf",
        STR: 41,   
        CON: 32,   
        DEX: 34,   
        WIT: 12,   
        INT: 25,   
        MEN: 26,   
        bonuses: {
            manaRegen: 1.35,     
            darkAffinity: 1.10,  
            critRate: 1.05,      
            attackSpeed: 1.03    
        },
        description:
            "Dark Elves of Nhar’Lith wield forbidden aether, mastering curses, shadow magic, and deadly precision."
    },
    human: {
        name: "Human",
        STR: 40,   
        CON: 43,   
        DEX: 30,   
        WIT: 11,   
        INT: 21,   
        MEN: 25,   
        bonuses: {
            hpBonus: 1.15,       
            defenseBonus: 1.10,  
            staminaRegen: 1.10,  
            balance: 1.00        
        },
        description:
            "Humans of Astryn possess unmatched resilience and versatility, excelling as frontline fighters."
    }
};