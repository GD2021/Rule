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
