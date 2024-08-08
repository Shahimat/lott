# Delta-file

delta-file uses to incremental deploy changes into DB. Delta-file also declarative file, witch contains description, how to apply changes into DB.

example `20240807-ff62f1df-af31-46f5-b92e-30f1467402cc.json`:

```json
{
  "name": "20240807-ff62f1df-af31-46f5-b92e-30f1467402cc",
  "tables": {
    "some_table": {
      "query": "remove"
    },
    "main_table": {
      "query": "apply",
      "updateStrategy": "force",
      "relations": {
        "creatorId": {
          "table": "user",
          "field": "id"
        },
        "categoryId": {
          "table": "category",
          "field": "id"
        }
      },
      "default": {
        "alias": {
          "query": "custom",
          "args": "operations, row",
          "body": "return operations.getAlias(row)"
        },
        "creatorId": {
          "query": "custom",
          "args": "operations, row",
          "body": "return operations.getId(\"UserEntity\", \"system\", true)"
        },
        "value": null,
        "isSet": false,
        "categoryId": "manual"
      },
      "rows": {
        "71ab577d-5255-4ce7-b641-dc3076d66a0e": {
          "code": 105,
          "isSet": true
        },
        "e4b9dc17-7ff0-443f-b97e-756cdfe8d9b7": {
          "code": 106
        },
        "readable_alias": {
          "code": 107
        }
      }
    }
  }
}
```
