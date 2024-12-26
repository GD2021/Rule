## 配置对比

| 配置项（中文）            | 📱 手机目前使用        | 📺 TV 目前使用                 | 📝 示例 1                | 📝 示例 2                  | 📝 示例 3                  |
|----------------------------|----------------------|-------------------------------|-----------------------|-----------------------|-----------------------|
| **类型 (Type)**            | `tun`                | `tun`, `mixed`                | `tun`, `mixed`         | `tun`                 | `tun`, `mixed`         |
| **地址 (Address)**         | `172.19.0.1/30`      | `172.18.0.1/30`               | `172.19.0.1/30`       | `172.18.0.1/30`, `fdfe:dcba:9876::1/126` | `172.18.0.1/30`       |
| **MTU**                    | `9000`               | `9000`                        | `9000`                | `9000`                | `9000`                |
| **自动路由 (Auto Route)**  | ✅ `true`             | ✅ `true`                      | ✅ `true`              | ✅ `true`              | ✅ `true`              |
| **严格路由 (Strict Route)**| ✅ `true`             | ✅ `true`                      | ✅ `true`              | ❌ `false`             | ✅ `true`              |
| **端点独立NAT (Endpoint Independent NAT)** | ❌ `false`            | ✅ `true`                      | ❌ `false`             | ❌ `false`             | ✅ `true`              |
| **堆栈 (Stack)**           | `mixed`              | `mixed`                       | `system`              | `system`              | `mixed`               |
| **嗅探 (Sniff)**           | ✅ `true`             | ✅ `true`                      | ✅ `true`              | ✅ `true`              | ✅ `true`              |
| **HTTP 代理 (HTTP Proxy)** | `127.0.0.1:8080`     | -                             | `0.0.0.0:2080`        | `127.0.0.1:7890`      | -                     |
| **路由地址 (Route Address)** | `0.0.0.0/1`, `128.0.0.0/1` | `0.0.0.0/1`, `128.0.0.0/1` | `0.0.0.0/1`, `128.0.0.0/1` | `0.0.0.0/1`, `128.0.0.0/1` | `0.0.0.0/1`, `128.0.0.0/1` |
| **排除路由地址 (Route Exclude Address)** | `10.0.0.0/8`, `172.16.0.0/12` | `192.168.0.0/16` | `192.168.0.0/16`      | `geoip-cn`            | `192.168.0.0/16`      |
| **额外配置 (Additional Configurations)** | -                    | `嗅探覆盖目的地 (sniff_override_destination)`, `自动重定向 (auto_redirect)`, `自动重定向输入标记 (auto_redirect_input_mark)`, `自动重定向输出标记 (auto_redirect_output_mark)`, `IP路由表索引 (iproute2_table_index)`, `IP路由规则索引 (iproute2_rule_index)` | `用户 (users)`, `监听地址 (listen)`, `监听端口 (listen_port)` | `自动重定向 (auto_redirect)`, `自动重定向输入标记 (auto_redirect_input_mark)`, `自动重定向输出标记 (auto_redirect_output_mark)`, `排除路由地址集 (route_exclude_address_set)`, `UDP超时 (udp_timeout)`, `绕过域名 (bypass_domain)`, `匹配域名 (match_domain)` | `混合配置 (mixed-in)`, `嗅探覆盖目的地 (sniff_override_destination)`, `监听地址 (listen)`, `监听端口 (listen_port)` |

---

**📱 SJ目前使用**
```
{
      "type": "tun",
      "address": "172.19.0.1/30",
      "mtu": 9000,
      "auto_route": true,
      "strict_route": true,
      "sniff": true,
      "endpoint_independent_nat": false,
      "route_address": [
          "0.0.0.0/1",
          "128.0.0.0/1"
        ]，
      "route_exclude_address": [
          "10.0.0.0/8",
          "172.16.0.0/12"
        ]，
      "stack": "mixed",
        "platform": {
          "http_proxy": {
            "server": "127.0.0.1",
            "server_port": 8080
          }
        }
      }
```
**📺 TV目前使用**
```
    {
        "type": "tun",
        "tag": "tun-in",
        "interface_name": "tun0",
        "address": "172.18.0.1/30",
        "mtu": 9000,
        "auto_route": true,
        "iproute2_table_index": 2022,
        "iproute2_rule_index": 9000,
        "auto_redirect": false,
        "auto_redirect_input_mark": "0x2023",
        "auto_redirect_output_mark": "0x2024",
        "strict_route": true,
        "route_address": [
          "0.0.0.0/1",
          "128.0.0.0/1"
        ],

        "route_exclude_address": "192.168.0.0/16",
        "endpoint_independent_nat": true,
        "stack": "mixed",
        "sniff": true,
        "sniff_override_destination": true
      },
      {
        "type": "mixed",
        "tag": "mixed-in",
        "listen": "127.0.0.1",
        "listen_port": 2334,
        "sniff": true,
        "sniff_override_destination": true
      }
```
示例1
```
        {
            "type": "tun",
            "tag": "tun-in",
            "interface_name": "tun0",
            "address": "172.19.0.1/30",
            "mtu": 9000,
            "auto_route": true,
            "iproute2_table_index": 2022,
            "iproute2_rule_index": 9000,
            "auto_redirect": false,
            "auto_redirect_input_mark": "0x2023",
            "auto_redirect_output_mark": "0x2024",
            "strict_route": true,
            "sniff": true,
            "endpoint_independent_nat": false,
            "stack": "system",
            "route_address": [
                "0.0.0.0/1",
                "128.0.0.0/1"
            ],
            "route_exclude_address": "192.168.0.0/16",
            "platform": {
                "http_proxy": {
                    "enabled": true,
                    "server": "0.0.0.0",
                    "server_port": 2080
                }
            }
        },
        {
            "type": "mixed",
            "listen": "0.0.0.0",
            "listen_port": 2080,
            "sniff": true,
            "users": [

            ]
        }
```
示例2
```
   {
            "type": "tun",
            "tag": "tun-in",
            "interface_name": "tun0",
            "address": [
                "172.18.0.1/30",
                "fdfe:dcba:9876::1/126"
            ],
            "mtu": 9000,
            "auto_route": true,
            "iproute2_table_index": 2022,
            "iproute2_rule_index": 9000,
            "auto_redirect": true,
            "auto_redirect_input_mark": "0x2023",
            "auto_redirect_output_mark": "0x2024",
            "route_exclude_address_set": [
                "geoip-cn"
            ],
            "endpoint_independent_nat": false,
            "udp_timeout": "5m",
            "stack": "system",
            "sniff": true,
            "platform": {
                "http_proxy": {
                    "enabled": false,
                    "server": "127.0.0.1",
                    "server_port": 7890,
                    "bypass_domain": [],
                    "match_domain": []
                }
            }
        }
```
示例3
```
{
        "type": "tun",
        "tag": "tun-in",
        "interface_name": "tun0",
        "address": "172.18.0.1/30",
        "mtu": 9000,
        "auto_route": true,
        "iproute2_table_index": 2022,
        "iproute2_rule_index": 9000,
        "auto_redirect": false,
        "auto_redirect_input_mark": "0x2023",
        "auto_redirect_output_mark": "0x2024",
        "strict_route": true,
        "route_address": [
          "0.0.0.0/1",
          "128.0.0.0/1"
        ],

        "route_exclude_address": "192.168.0.0/16",
        "endpoint_independent_nat": true,
        "stack": "mixed",
        "sniff": true,
        "sniff_override_destination": true
      },
      {
        "type": "mixed",
        "tag": "mixed-in",
        "listen": "127.0.0.1",
        "listen_port": 2334,
        "sniff": true,
        "sniff_override_destination": true
      }
```
