const { type, name } = $arguments;
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'block',
};

let compatible = false;
let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// 处理特殊的出站策略
config.outbounds.forEach((outbound) => {
  if (outbound.outbounds && outbound.outbounds.includes("{all}")) {
    outbound.outbounds = outbound.outbounds.filter(item => item !== "{all}");
    let p = getTags(proxies);
    
    if (outbound.filter && outbound.filter.length > 0) {
      p = getTags(proxies, outbound.filter[0].keywords[0]);
      if (outbound.filter[0].action === "include") {
        outbound.outbounds = outbound.outbounds.concat(p);
      } else if (outbound.filter[0].action === "exclude") {
        outbound.outbounds = outbound.outbounds.concat(getTags(proxies).filter(tag => !p.includes(tag)));
      }
      delete outbound.filter;
    } else {
      outbound.outbounds = outbound.outbounds.concat(p);
    }
  }
});

// 添加新的代理节点
config.outbounds.push(...proxies);

// 确保没有空的`outbounds`数组
config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound);
      compatible = true;
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

// 处理特殊的策略，如"全球直连"等
const specialTags = ["🎯 全球直连", "🚀 节点选择", "dns-out"];
config.outbounds.forEach(outbound => {
  if (specialTags.includes(outbound.tag)) {
    outbound.outbounds = [outbound.tag];
  }
});

// 输出修改后的配置
$content = JSON.stringify(config, null, 2);

// 辅助函数
function getTags(proxies, regex) {
  if (regex) {
    regex = new RegExp(regex);
  }
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
