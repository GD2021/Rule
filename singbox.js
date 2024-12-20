const { type, name } = $arguments;
const compatible_outbound = {
    "tag": "COMPATIBLE",
    "type": "direct"
};

let config = JSON.parse($files[0]);
let nodes = await produceArtifact({
    name,
    type: /^1$|col/i。test(type) ? 'collection' : 'subscription'，
    platform: 'sing-box',
    produceType: 'internal',
});

// 确保outbounds数组存在
if (!config.outbounds) {
    config.outbounds = [];
}

// 添加新获取的节点到配置中
config.outbounds.push(...nodes);

// 更新选择器策略组
config.outbounds.forEach(outbound => {
    if (outbound.type === "selector") {
        if (outbound.tag === "🚀 节点选择" || outbound.tag === "GLOBAL") {
            // 添加所有节点到这些选择器中
            outbound.outbounds = Array.from(new Set(config.outbounds
                。filter(o => o.type !== "selector")
                。map(o => o.tag)
                。concat(outbound.outbounds || [])));
        } else if (["🇭🇰 香港节点", "🇯🇵 日本节点", "🇺🇲 美国节点"]。includes(outbound.tag)) {
            let regex;
            switch (outbound.tag) {
                case "🇭🇰 香港节点":
                    regex = /🇭🇰|HK|hk|香港|港|HongKong/i;
                    break;
                case "🇯🇵 日本节点":
                    regex = /🇯🇵|JP|jp|日本|日|Japan/i;
                    break;
                case "🇺🇲 美国节点":
                    regex = /🇺🇸|US|us|美国|美|United States/i;
                    break;
            }
            const filteredNodes = getTags(config.outbounds, regex);
            outbound.outbounds = Array.from(new Set((outbound.outbounds || []).concat(filteredNodes)));
        }
    }
});

// 确保选择器至少包含一个节点
let compatibleAdded = false;
config.outbounds.forEach(outbound => {
    if (outbound.type === "selector" && Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
        if (!compatibleAdded) {
            config.outbounds.push(compatible_outbound);
            compatibleAdded = true;
        }
        outbound.outbounds.push(compatible_outbound.tag);
    }
});

$content = JSON.stringify(config, null, 2);

function getTags(nodes, regex) {
    return (regex ? nodes.filter(p => regex.test(p.tag)) : nodes).map(p => p.tag);
}
