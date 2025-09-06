# 部署

Docker Compose 配置参考

```yaml
services:
  web:
    env_file:
      - .env
    image: ghcr.io/caiwen666/blog:latest
    ports:
      - "${APP_PORT:-3000}:3000"
    volumes:
      - "${APP_CONFIG_DIR:-./config.json}:/app/config.json"
      - "${APP_PUBLIC_DIR:-./public}:/app/public"
      - "${APP_DATA_DIR:-./data}:/app/data"
    environment:
      - NODE_ENV=production
    depends_on:
      meilisearch:
        condition: service_healthy
  meilisearch:
    env_file:
      - .env
    image: getmeili/meilisearch:v1.19
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY:-masterKey}
      MEILI_ENV: production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - meili_data:/data.ms
volumes:
  meili_data:
```

然后创建 `.env` 文件，配置如下环境变量：

```
APP_PORT=3000
APP_PUBLIC_DIR=public目录的路径
APP_CONFIG_DIR=config.json文件的路径
APP_DATA_DIR=data目录的路径
MEILI_MASTER_KEY=meilisearch 的 key
```

其中 config.json 的格式如下：

```json
{
	"api_token": "博客一些接口的 token",
	"meilisearch_token": "meilisearch 的 token，和环境变量保持一致"
}
```
