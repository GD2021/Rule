async function operator(proxies = [], targetPlatform, context) {
  try {
    const { type, name } = $arguments;
    const compatible_outbound = {
      tag: 'COMPATIBLE',
      type: 'block',
    };

    let compatible = false;
    let config = JSON.parse($files[0]);

    let proxiesFromArtifact = await produceArtifact({
      name,
      type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
      platform: 'sing-box',
      produceType: 'internal',
    });

    // 处理特殊的出站策略
    config.outbounds.forEach((outbound) => {
      if (outbound.outbounds && outbound.outbounds.includes("{all}")) {
        outbound.outbounds = outbound.outbounds.filter(item => item !== "{all}");
        let p = getTags(proxiesFromArtifact);
        
        if (outbound.filter && outbound.filter.length > 0) {
          p = getTags(proxiesFromArtifact, outbound.filter[0].keywords[0]);
          if (outbound.filter[0].action === "include") {
            outbound.outbounds = outbound.outbounds.concat(p);
          } else if (outbound.filter[0].action === "exclude") {
            outbound.outbounds = outbound.outbounds.concat(getTags(proxiesFromArtifact).filter(tag => !p.includes(tag)));
          }
          delete outbound.filter;
        } else {
          outbound.outbounds = outbound.outbounds.concat(p);
        }
      }
    });

    // 添加新的代理节点
    config.outbounds.push(...proxiesFromArtifact);

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
  } catch (error) {
    console.error("An error occurred:", error);
    $content = JSON.stringify({
      "status": "failed",
      "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "type": "InternalServerError",
        "message": "Failed to download file: sboxx",
        "details": "Reason: " + error.message
      }
    }, null, 2);
  }
  return proxies;
}

// 辅助函数
function getTags(proxies, regex) {
  if (regex) {
    regex = new RegExp(regex);
  }
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag);
}
