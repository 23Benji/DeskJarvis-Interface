import kaplay, { KAPLAYCtx } from "kaplay";

let kInstance: KAPLAYCtx | null = null;

export function initKaplay(config: Record<string, unknown>) {
  if (kInstance) {
    console.log("Re-initializing Tetris Kaplay...");
  }
  kInstance = kaplay(config);
  return kInstance;
}

const kHandler: ProxyHandler<KAPLAYCtx> = {
  get: (target, prop: string) => {
    if (!kInstance) return undefined;
    const value = (kInstance as any)[prop];
    return typeof value === 'function' ? value.bind(kInstance) : value;
  }
};

const k = new Proxy({} as KAPLAYCtx, kHandler);
export default k;