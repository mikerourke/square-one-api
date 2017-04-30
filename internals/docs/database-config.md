# Database Configuration

Sequelize requires a configuration file in this format:

```json
{
    "development": {
        "username": "testing",
        "password": "testing",
        "database": "square1-dev",
        "host": "127.0.0.1",
        "port": 5432,
        "dialect": "postgres"
    },
    "test": {
        "username": "testing",
        "password": "testing",
        "database": "square1-test",
        "host": "127.0.0.1",
        "port": 5432,
        "dialect": "postgres"
    }
}
```
