async function operator(proxies = [], targetPlatform, context) {
  const { type, name } = argumentsObj;
  const config = JSON.parse(fileContent);

  try {
    const proxiesFromArtifact = await processArtifact(name, type, 'sing-box');
    const updatedConfig = await handleOutbounds(config, proxiesFromArtifact);

    outputContent = JSON.stringify(updatedConfig, null, 2);
  } catch (error) {
    handleError(error);
  }
  return proxies;
}

async function processArtifact(name, type, platform) {
  return produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
    platform,
    produceType: 'internal',
  });
}

async function handleOutbounds(config, proxiesFromArtifact) {
  const compatibleOutbound = { tag: 'COMPATIBLE', type: 'block' };
  config.outbounds.forEach(outbound => {
    handleSpecialOutboundStrategy(outbound, proxiesFromArtifact, config, compatibleOutbound);
    handleSpecialTags(outbound);
  });
  return config;
}

function handleSpecialOutboundStrategy(outbound, proxiesFromArtifact, config, compatibleOutbound) {
  if (outbound.outbounds && outbound.outbounds.includes("{all}")) {
    outbound.outbounds = outbound.outbounds.filter(item => item !== "{all}");
    const tags = getTags(proxiesFromArtifact, outbound.filter && outbound.filter[0] && outbound.filter[0].keywords[0]);
    if (outbound.filter && outbound.filter.length > 0) {
      applyFilter(outbound, tags, outbound.filter[0].action);
      delete outbound.filter;
    } else {
      outbound.outbounds = outbound.outbounds.concat(tags);
    }
  }
}

function applyFilter(outbound, tags, action) {
  if (action === "include") {
    outbound.outbounds = outbound.outbounds.concat(tags);
  } else if (action === "exclude") {
    outbound.outbounds = outbound.outbounds.concat(getTags(proxiesFromArtifact).filter(tag => !tags.includes(tag)));
  }
}

function handleSpecialTags(outbound) {
  const specialTags = ["🎯 全球直连", "🚀 节点选择", "dns-out"];
  if (specialTags.includes(outbound.tag)) {
    outbound.outbounds = [outbound.tag];
  }
}

function handleError(error) {
  console.error("An error occurred:", error);
  outputContent = JSON.stringify({
    "status": "failed",
    "error": {
      "code": "INTERNAL_SERVER_ERROR",
      "type": "InternalServerError",
      "message": "Failed to process configuration: sboxx",
      "details": `Reason: ${error.message}`
    }
  }, null, 2);
}
