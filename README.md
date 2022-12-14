## Requirements

- Docker
- Docker Compose

## Commands

### Docker Compose Startup

```bash
docker-compose up --detach
```

### Dependencies Installation

```bash
docker-compose exec node npm install
```

### Client Startup

```bash
docker-compose exec node npm run start:client
```

### Socket Startup

```bash
docker-compose exec node npm run start:socket
```

### Docker Compose Shutdown

```bash
docker-compose down --remove-orphans --volumes --timeout 0
```