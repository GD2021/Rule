const fs = require('fs');
const path = require('path');

// 模拟 $arguments 和 $files
const arguments = { type: 'subscription', name: 'my-proxies' };
const files = [path.join(__dirname, 'config.json')];

const { type, name } = arguments;
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};

let compatible = false;
let config = JSON.parse(fs.readFileSync(files[0], 'utf8'));

// 模拟 produceArtifact 函数
async function produceArtifact(options) {
  // 这里应该是获取代理节点的逻辑，这里用一个示例代替
  return [
    { tag: 'proxy1', type: 'http' },
    { tag: 'proxy2', type: 'https' },
    // 添加更多代理节点
  ];
}

let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

config.outbounds.push(...proxies);

config.outbounds.forEach(i => {
  if (i.tag === '🐸 手动切换') {
    i.outbounds.push(...getTags(proxies));
    i.default = i.outbounds[0]; // 添加 default 字段
    i.interrupt_exist_connections = false; // 添加 interrupt_exist_connections 字段
  }
  if (['🇭🇰 香港节点', '🔯 香港自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong/i));
    i.default = i.outbounds[0]; // 添加 default 字段
    i.interrupt_exist_connections = false; // 添加 interrupt_exist_connections 字段
  }
  if (i.tag === '🇯🇵 日本节点') {
    i.outbounds.push(...getTags(proxies, /🇯🇵|JP|jp|日本|日|Japan/i));
    i.default = i.outbounds[0]; // 添加 default 字段
    i.interrupt_exist_connections = false; // 添加 interrupt_exist_connections 字段
  }
  if (i.tag === '🇺🇲 美国节点') {
    i.outbounds.push(...getTags(proxies, /🇺🇸|US|us|美国|美|United States/i));
    i.default = i.outbounds[0]; // 添加 default 字段
    i.interrupt_exist_connections = false; // 添加 interrupt_exist_connections 字段
  }
  if (i.tag === '♻️ 自动选择') {
    i.outbounds.push(...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong|🇯🇵|JP|jp|日本|日|Japan|🇺🇸|US|us|美国|美|United States/i));
    i.url = "http://www.gstatic.com/generate_204"; // 添加 url 字段
    i.interval = "10m"; // 添加 interval 字段
    i.tolerance = 50; // 添加 tolerance 字段
    i.idle_timeout = ""; // 添加 idle_timeout 字段
    i.interrupt_exist_connections = false; // 添加 interrupt_exist_connections 字段
  }
});

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound);
      compatible = true;
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

fs.writeFileSync(path.join(__dirname, 'updated-config.json'), JSON.stringify(config, null, 2));

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
