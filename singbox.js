const { type, name } = $arguments;

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
    platform: 'sing-box',
    produceType: 'internal',
});

// 将新节点添加到 outbounds
config.outbounds.push(...proxies);

// 更新现有的 selector outbounds
config.outbounds.forEach(outbound => {
    if (outbound.type === 'selector' && Array.isArray(outbound.outbounds)) {
        // 特殊处理 {all}，替换为所有节点的 tag
        if (outbound.outbounds.includes("{all}")) {
            outbound.outbounds = proxies.map(p => p.tag);
        } else {
            // 根据 filter 规则添加节点
            const filter = outbound.filter;
            if (filter && Array.isArray(filter)) {
                let filteredProxies = [...proxies]; // 克隆一份 proxies 数组，避免修改原数组
                filter.forEach(f => {
                    if (f.action === 'include' && Array.isArray(f.keywords)) {
                        filteredProxies = filteredProxies.filter(p => f.keywords.some(keyword => new RegExp(keyword, 'i').test(p.tag)));
                    } else if (f.action === 'exclude' && Array.isArray(f.keywords)) {
                        filteredProxies = filteredProxies.filter(p => !f.keywords.some(keyword => new RegExp(keyword, 'i').test(p.tag)));
                    }
                });
                outbound.outbounds.push(...filteredProxies.map(p => p.tag));
                // 去重
                outbound.outbounds = [...new Set(outbound.outbounds)];
            }
            if (outbound.tag === ' 手动切换') {
                outbound.outbounds = proxies.map(p => p.tag);
            }
        }
    }
});

$content = JSON.stringify(config, null, 2);
