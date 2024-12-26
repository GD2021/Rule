**示例1**
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
**TV目前使用**
```
 "inbounds": [
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
    ],
```
