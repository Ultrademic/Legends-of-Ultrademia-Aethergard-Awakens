// /core/scene_loader.js
// ULTRADEMIC STANDARD — Safe Scene Reset + Async Zone Loading

import { scene } from "./renderer.js";
import { loadVillage } from "../modules/zones/zone_village.js";
import { loadElvenRuins } from "../modules/zones/zone_elven_ruins.js";

export async function loadZone(zone) {

  console.log("%c[SceneLoader] Loading zone:", "color:cyan;font-weight:bold", zone);

  // ------------------------------------------------------------------
  // SAFE SCENE CLEANUP
  // ------------------------------------------------------------------
  // NEVER mutate scene.children directly — remove children backward.
  // Protect:
  //   - player model       (child.keep === true)
  //   - persistent lights  (child.keep === true)
  //   - FX like particles  (child.keep === true)
  //   - skybox             (child.keep === true)
  // ------------------------------------------------------------------

  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];

    // Skip objects marked as permanent
    if (child.keep === true) continue;

    // Remove everything else
    scene.remove(child);
  }

  // ------------------------------------------------------------------
  // ZONE DISPATCH
  // Turn all zone loaders into async functions.
  // ------------------------------------------------------------------
  try {
    switch (zone) {
      case "village":
        console.log("%c[SceneLoader] → Gladeon Village", "color:lime;font-weight:bold");
        await loadVillage();
        break;

      case "elven_ruins":
        console.log("%c[SceneLoader] → Elven Ruins", "color:violet;font-weight:bold");
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
