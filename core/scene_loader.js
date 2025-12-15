import { scene } from "./renderer.js";
import { loadVillage } from "../modules/zones/zone_village.js";
import { loadElvenRuins } from "../modules/zones/zone_elven_ruins.js";

export async function loadZone(zone) {
  console.log("%c[SceneLoader] Loading zone:", "color:cyan;font-weight:bold", zone);

  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child.keep === true) continue;
    scene.remove(child);
  }

  try {
    switch (zone) {
      case "village":
        await loadVillage();
        break;
      case "elven_ruins":
        await loadElvenRuins();
        break;
      default:
        console.warn("%c[SceneLoader] Unknown zone: " + zone, "color:orange");
        break;
    }
  } catch (err) {
    console.error("%c[SceneLoader] Zone failed to load:", "color:red", err);
  }
}