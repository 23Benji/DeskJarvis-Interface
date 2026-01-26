import kaplay from "kaplay";

let kInstance: any = null;

// Function to initialize Kaplay later (called from main.ts)
export function initKaplay(config: any) {
  if (kInstance) {
    // Optional: Clean up old instance if needed, though Kaplay usually handles canvas removal
    // via the component's destroy lifecycle if managed correctly.
    console.log("Re-initializing Kaplay instance...");
  }
  kInstance = kaplay(config);
  return kInstance;
}

// Proxy to forward calls to the active kInstance
// This allows other files to 'import k' and use it normally,
// even though kInstance is null until the game starts.
const kHandler = {
  get: (target: any, prop: string) => {
    if (!kInstance) {
      console.warn(`[Kaplay] Accessing '${prop}' before initialization!`);
      return undefined;
    }
    const value = kInstance[prop];
    // Bind functions to the instance so 'this' context is correct
    return typeof value === 'function' ? value.bind(kInstance) : value;
  }
};

// Export a Proxy that looks and acts like the Kaplay context
const k = new Proxy({}, kHandler);

export default k;