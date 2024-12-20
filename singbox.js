const { type, name } = $arguments;

let config = JSON.parse($files[0]);
let proxies = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
    platform: 'sing-box',
    produceType: 'internal',
});

// 确保outbounds数组存在
if (!config.outbounds) {
    config.outbounds = [];
}

config.outbounds.push(...proxies);

// 定义需要更新的 selector/urltest 的 tag 列表
const targetOutboundTags = [
    " 节点选择", "🇭🇰 香港节点", "🇯🇵 日本节点", "🇺🇲 美国节点",
    " 香港自动", "♻️ 自动选择", " 手动切换"
];

config.outbounds.forEach(outbound => {
    if ((outbound.type === 'selector' || outbound.type === 'urltest') && targetOutboundTags.includes(outbound.tag)) {
        if (Array.isArray(outbound.outbounds)) {
            // 特殊处理 {all}
            if (outbound.outbounds.includes("{all}")) {
                outbound.outbounds = proxies.map(p => p.tag);
            } else {
                const filter = outbound.filter;
                if (filter && Array.isArray(filter)) {
                    let filteredProxies = [...proxies];
                    filter.forEach(f => {
                        if (f.action === 'include' && Array.isArray(f.keywords)) {
                            filteredProxies = filteredProxies.filter(p => f.keywords.some(keyword => new RegExp(keyword, 'i').test(p.tag)));
                        } else if (f.action === 'exclude' && Array.isArray(f.keywords)) {
                            filteredProxies = filteredProxies.filter(p => !f.keywords.some(keyword => new RegExp(keyword, 'i').test(p.tag)));
                        }
                    });
                    outbound.outbounds = [...new Set(filteredProxies.map(p => p.tag))];
                }
            }
        }

        if (outbound.type === 'selector' && outbound.default && !outbound.outbounds.includes(outbound.default)) {
            outbound.outbounds.unshift(outbound.default);
        }

        if (!outbound.interrupt_exist_connections) {
            outbound.interrupt_exist_connections = false;
        }
    }
});

$content = JSON.stringify(config, null, 2);
