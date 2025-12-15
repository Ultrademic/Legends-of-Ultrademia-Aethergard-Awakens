export interface SkillData {
  id: string;
  name: string;
  icon: string;
  maxCooldown: number;
  mpCost: number;
  range?: number;
  description?: string;
}

export interface Consumables {
  soulshots: number;
  spiritshots: number;
  healthPotions: number;
  adena: number;
}

export interface VendorItem {
  id: string;
  name: string;
  price: number;
  type: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  data?: {
      price?: number;
      type?: string;
      description?: string;
      [key: string]: any;
  };
}

export interface DetailedStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIT: number;
  MEN: number;
  PATK: number;
  PDEF: number;
  CRIT: number;
  attackSpeed: number;
  castSpeed: number;
  maxHp: number;
  maxMp: number;
  maxCp: number;
}

export interface EquipmentMap {
  [key: string]: InventoryItem | null;
}

export interface QuestRewardItem {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  started: boolean;
  completed: boolean;
  currentKills: number;
  requiredKills: number;
  rewards?: {
    xp: number;
    adena: number;
    items?: QuestRewardItem[];
  };
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  cp: number;
  maxCp: number;
  level: number;
  exp: number;
  name: string;
  class: string;
  archetype?: 'fighter' | 'mystic'; 
  skills: string[]; 
  skillDetails?: SkillData[]; 
  cooldowns?: { [key: string]: number };
  consumables?: Consumables;
  inventory?: InventoryItem[];
  shotConfig?: { soulshot: boolean; spiritshot: boolean; };
  
  details?: DetailedStats;
  equipment?: EquipmentMap;
  quests?: Quest[];
}

export interface SaveData {
    name: string;
    race: Race;
    baseClass: string;
    archetype: 'fighter' | 'mystic'; 
    level: number;
    xp: number;
    timestamp: number;
    stats: { hp: number; mp: number; cp: number };
    position: { x: number; y: number; z: number };
    inventory: InventoryItem[];
    equipment: EquipmentMap;
    adena: number;
    shotConfig: { soulshot: boolean; spiritshot: boolean };
    skills: string[];
    quests: any[];
}

export type ChatMessageType = 
  | 'system'    
  | 'SYSTEM'    
  | 'general'   
  | 'party'     
  | 'whisper'   
  | 'hero'      
  | 'error'     
  | 'success'   
  | 'warning'   
  | 'info'      
  | 'loot'      
  | 'experience'
  | 'level_up'  
  | 'combat'    
  | 'quest';    

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  type: ChatMessageType;
  timestamp: number;
}

export enum GameState {
  LOGIN,
  CHARACTER_SELECT,
  RACE_SELECT,
  CLASS_SELECT,
  NAME_INPUT,
  LOADING,
  PLAYING
}

export type Race = 'human' | 'elf' | 'dark_elf';