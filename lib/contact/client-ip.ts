import { BlockList, isIP } from "node:net";

const aliases: Record<string, [address: string, prefix: number, family: "ipv4" | "ipv6"][]> = {
  loopback: [["127.0.0.0", 8, "ipv4"], ["::1", 128, "ipv6"]],
  linklocal: [["169.254.0.0", 16, "ipv4"], ["fe80::", 10, "ipv6"]],
  uniquelocal: [
    ["10.0.0.0", 8, "ipv4"],
    ["172.16.0.0", 12, "ipv4"],
    ["192.168.0.0", 16, "ipv4"],
    ["fc00::", 7, "ipv6"],
  ],
};

/**
 * Parses TRUST_PROXY: comma-separated IPs, CIDR subnets, or the aliases loopback, linklocal and
 * uniquelocal. Returns null when nothing is configured.
 */
export function parseTrustedProxies(value: string | undefined): BlockList | null {
  const entries = (value ?? "").split(",").map((entry) => entry.trim()).filter(Boolean);
  if (!entries.length) return null;

  const list = new BlockList();
  for (const entry of entries) {
    if (aliases[entry]) {
      for (const [address, prefix, family] of aliases[entry]) list.addSubnet(address, prefix, family);
      continue;
    }
    const [address, prefix] = entry.split("/");
    const version = isIP(address);
    if (!version) continue;
    const family = version === 4 ? "ipv4" : "ipv6";
    if (prefix === undefined) list.addAddress(address, family);
    else list.addSubnet(address, Number(prefix), family);
  }
  return list;
}

function normalize(address: string) {
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
  return (mapped ? mapped[1] : address).toLowerCase();
}

/**
 * Picks the visitor's address from X-Forwarded-For, reading from the right (the hop closest to
 * this server) and skipping trusted proxies. Only meaningful behind a reverse proxy that
 * overwrites the header, as described in README.md.
 */
export function clientIp(headers: Headers, trusted: BlockList | null): string {
  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((hop) => normalize(hop.trim()))
    .filter(Boolean);

  let candidate = hops[hops.length - 1];
  if (trusted) {
    candidate = hops[0];
    for (let index = hops.length - 1; index >= 0; index--) {
      const version = isIP(hops[index]);
      if (!version || !trusted.check(hops[index], version === 4 ? "ipv4" : "ipv6")) {
        candidate = hops[index];
        break;
      }
    }
  }
  return candidate && isIP(candidate) ? candidate : "unknown";
}
