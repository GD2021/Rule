const { templatePath, name, type } = $arguments;

// 读取并解析配置模板文件
let config;
try {
  config = JSON.parse($file.readString(templatePath));
} catch (error) {
  console.error(`读取或解析模板文件失败: ${error}`);
  $done();
}

// 获取订阅节点信息
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
});

// 兼容性处理 - 定义一个默认的 DIRECT 出站
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
};
let compatible = false;

// 将订阅节点添加到配置模板的 outbounds 中
config.outbounds.push(...proxies);

// 根据模板中的 selector 出站，将节点添加到对应的组中
config.outbounds.forEach(outbound => {
  if (outbound.type !== 'selector') return; // 只处理 selector 类型的出站

  switch (outbound.tag) {
    case '🐸 手动切换':
    case '♻️ 自动选择':
      outbound.outbounds.push(...getTags(proxies));
      break;
    case '🎥 Emby':
      outbound.outbounds.push(...getTags(proxies, /(JP|US).*0[.]20x/i));
      break;
    case '🇭🇰 香港节点':
    case '🔯 香港自动':
      outbound.outbounds.push(...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong/i));
      break;
    case '🇹🇼 台湾节点':
      outbound.outbounds.push(...getTags(proxies, /🇹🇼|TW|tw|台湾|台|Taiwan/i));
      break;
    case '🇯🇵 日本节点':
      outbound.outbounds.push(...getTags(proxies, /🇯🇵|JP|jp|日本|日|Japan/i));
      break;
    case '🇰🇷 韩国节点':
      outbound.outbounds.push(...getTags(proxies, /🇰🇷|KR|韩|韩国|Korea/i));
      break;
    case '🇸🇬 狮城节点':
      outbound.outbounds.push(...getTags(proxies, /🇸🇬|SG|sg|新加坡|狮城|Singapore/i));
      break;
    case '🇺🇲 美国节点':
      outbound.outbounds.push(...getTags(proxies, /🇺🇸|US|us|美国|美|United States/i));
      break;
    case '♻️ 低倍自动':
      outbound.outbounds.push(...getTags(proxies, /0.1x|0.20x|0.50x/i));
      break;
    default:
      if (outbound.filter) {
        const includeKeywords = outbound.filter.find(f => f.action === 'include')?.keywords;
        const excludeKeywords = outbound.filter.find(f => f.action === 'exclude')?.keywords;

        if (includeKeywords) {
          const includeRegex = new RegExp(includeKeywords.join('|'), 'i');
          outbound.outbounds.push(...getTags(proxies, includeRegex));
        }

        if (excludeKeywords) {
          const excludeRegex = new RegExp(excludeKeywords.join('|'), 'i');
          outbound.outbounds = outbound.outbounds.filter(tag => !excludeRegex.test(tag));
        }
      }
      break;
  }
});

// 处理 selector 出站中没有节点的情况，添加 DIRECT 出站
config.outbounds.forEach(outbound => {
  if (outbound.type === 'selector' && Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound);
      compatible = true;
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

// 将最终的配置转换为 JSON 字符串并输出
$content = JSON.stringify(config, null, 2);

// 辅助函数：根据正则表达式过滤节点标签
function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
