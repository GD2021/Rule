const { type, name } = $arguments;
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};

let compatible = false;
let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// Append new proxies to the existing outbounds list
config.outbounds.push(...proxies);

// Update specific selectors based on your SingBox configuration
config.outbounds.forEach(outbound => {
  if (outbound.type === "selector" && Array.isArray(outbound.outbounds)) {
    // Update for each country-specific selector
    if (outbound.tag === "🇭🇰 香港节点") {
      outbound.outbounds.push(...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong/i));
    }
    if (outbound.tag === "🇯🇵 日本节点") {
      outbound.outbounds.push(...getTags(proxies, /🇯🇵|JP|jp|日本|日|Japan/i));
    }
    if (outbound.tag === "🇺🇲 美国节点") {
      outbound.outbounds.push(...getTags(proxies, /🇺🇸|US|us|美国|美|United States/i));
    }
    if (outbound.tag === "🐸 手动切换") {
      outbound.outbounds.push(...getTags(proxies));
    }
  }
  
  // Handle cases where outbounds list might be empty
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound);
      compatible = true;
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2);

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
