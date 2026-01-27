import kaplay from "kaplay";

let kInstance: any = null;

export function initKaplay(config: any) {
  if (kInstance) {
    console.log("Re-initializing Pong Kaplay...");
  }
  kInstance = kaplay(config);
  return kInstance;
}

const kHandler = {
  get: (target: any, prop: string) => {
    if (!kInstance) return undefined;
    const value = kInstance[prop];
    return typeof value === 'function' ? value.bind(kInstance) : value;
  }
};

const k = new Proxy({}, kHandler);
export default k;