const { type, name } = $arguments
const compatible_outbound = {
    "tag": "COMPATIBLE",
    "type": "direct"
};

let config = JSON.parse($files[0])
let nodes = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
    platform: 'sing-box',
    produceType: 'internal',
})

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
            outbound.outbounds = config.outbounds.filter(o => o.type !== "selector").map(o => o.tag);
        } else if (outbound.tag === "🇭🇰 香港节点") {
            outbound.outbounds.push(...getTags(nodes, /🇭🇰|HK|hk|香港|港|HongKong/i));
        } else if (outbound.tag === "🇯🇵 日本节点") {
            outbound.outbounds.push(...getTags(nodes, /🇯🇵|JP|jp|日本|日|Japan/i));
        } else if (outbound.tag === "🇺🇲 美国节点") {
            outbound.outbounds.push(...getTags(nodes, /🇺🇸|US|us|美国|美|United States/i));
        }
    }
});

// 确保选择器至少包含一个节点
let compatible = false;
config.outbounds.forEach(outbound => {
    if (outbound.type === "selector" && Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
        if (!compatible) {
            config.outbounds.push(compatible_outbound);
            compatible = true;
        }
        outbound.outbounds.push(compatible_outbound.tag);
    }
});

$content = JSON.stringify(config, null, 2)

function getTags(nodes, regex) {
    return (regex ? nodes.filter(p => regex.test(p.tag)) : nodes).map(p => p.tag);
}
