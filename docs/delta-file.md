# Delta-file

delta-file uses to incremental deploy changes into DB. Delta-file also declarative file, witch contains description, how to apply changes into DB.

v1 example `20240807-ff62f1df-af31-46f5-b92e-30f1467402cc.json`:

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

v2 more imperative example `20240809_ba178d0a-d573-47a5-8e54-78742fc7e6dd.json` (finite state machine designed by callbacks):

```json
[
  [
    "#metadata",
    {
      "name": "20240809_ba178d0a-d573-47a5-8e54-78742fc7e6dd",
      "tables": [
        {
          "name": "some_table",
          "relations": {
            "creatorId": {
              "table": "user",
              "field": "id"
            },
            "categoryId": {
              "table": "category",
              "field": "id"
            }
          }
        },
        "some_table2",
        "some_table3"
      ]
    }
  ],
  [
    "#use_defaults",
    "some_table",
    ["aliasField", ["#each_get_alias"]],
    ["code", 100],
    ["creatorId", ["#find", "user", ["name", "system"], "id"]]
  ],
  [
    "#apply",
    "some_table",
    [
      "af591fc6-8a65-47e3-9484-c699bd5e5994",
      { "field1": true, "field2": "example string" }
    ],
    ["alias_name", { "field1": false, "field2": "why not?" }]
  ],
  [
    "#delete",
    "some_table2",
    "024b05cd-89fb-43e5-8c73-297dec1d1af4",
    "5979b82e-d74f-46c1-9848-5e0ab1412c63",
    "a3baab52-91ac-4435-a6ca-eb6848c887fd",
    "baaaa4b9-c634-493d-af09-a1236ea419b8"
  ],
  [
    "#apply",
    "some_table",
    "226d4790-f471-4e99-bb3d-1fc3debfaebc",
    [
      "#obj_create",
      ["field1_boolean", true],
      ["field2_array", ["#array", [1, 2, 3]]],
      [
        "field3_number",
        [
          "#get_field_data",
          "some_table3",
          "51114ab3-0c73-4cba-af99-cdd29280854d",
          "id"
        ]
      ],
      ["some_string", ["#string_concat", "percent = ", "20", "%"]]
    ]
  ],
  [
    "#test_row_exists",
    "some_table",
    "af591fc6-8a65-47e3-9484-c699bd5e5994",
    "alias_name"
  ],
  [
    "#test_row_not_exists",
    "some_table",
    "024b05cd-89fb-43e5-8c73-297dec1d1af4",
    "5979b82e-d74f-46c1-9848-5e0ab1412c63",
    "a3baab52-91ac-4435-a6ca-eb6848c887fd",
    "baaaa4b9-c634-493d-af09-a1236ea419b8"
  ]
]
```

v3 more imperative example `20240809_ba178d0a-d573-47a5-8e54-78742fc7e6dd.json` (finite state machine designed by callbacks):

```json
[
  "==>",
  ["/=> array_function", "var1", ["::", ["::num", "@var1"], 2]],
  ["==> array_function", 2],
  [
    "==> metadata",
    {
      "name": "20240809_ba178d0a-d573-47a5-8e54-78742fc7e6dd",
      "tables": [
        {
          "name": "some_table",
          "relations": {
            "creatorId": {
              "table": "user",
              "field": "id"
            },
            "categoryId": {
              "table": "category",
              "field": "id"
            }
          }
        },
        "some_table2",
        "some_table3"
      ]
    }
  ],
  ["==> jsonpath", "$.phoneNumbers[:1].type", "#some_var1"],
  ["==> path", "tables[0].name", "#some_var2"],
  [
    "==> use_defaults",
    "some_table",
    [
      "/=>",
      "alias",
      [
        "::obj",
        ["::", "aliasField", ["::str", "@alias"]],
        ["::", "code", 100],
        ["::", "creatorId", ["==> find", "user", ["name", "system"], "id"]]
        ["::", "number add", ["::num.+", 10, "20"]],
        ["::", "array map", ["::.map", [1, 2, 3], ["/=>", ["item"], ["::num.*", "@item", 2]]]],
      ]
    ]
  ],
  [
    "==> apply",
    "some_table",
    [
      "::",
      "af591fc6-8a65-47e3-9484-c699bd5e5994",
      { "field1": true, "field2": "example string" }
    ],
    ["::", "alias_name", { "field1": false, "field2": "why not?" }]
  ],
  [
    "==> delete",
    "some_table2",
    "024b05cd-89fb-43e5-8c73-297dec1d1af4",
    "5979b82e-d74f-46c1-9848-5e0ab1412c63",
    "a3baab52-91ac-4435-a6ca-eb6848c887fd",
    "baaaa4b9-c634-493d-af09-a1236ea419b8"
  ],
  [
    "==> apply",
    "some_table",
    "226d4790-f471-4e99-bb3d-1fc3debfaebc",
    [
      "::obj",
      ["::", "field1_boolean", true],
      ["::", "field2_array", ["::", [1, 2, 3]]],
      [
        "::",
        "field3_number",
        [
          "==> get_field_data",
          "some_table3",
          "51114ab3-0c73-4cba-af99-cdd29280854d",
          "id"
        ]
      ],
      ["::", "some_string", ["::str", "percent = ", "20", "%"]],
      { "maybe": true }
    ]
  ],
  [
    "==> test.row_exists",
    "some_table",
    "af591fc6-8a65-47e3-9484-c699bd5e5994",
    "alias_name"
  ],
  [
    "==> test.row_not_exists",
    "some_table",
    "024b05cd-89fb-43e5-8c73-297dec1d1af4",
    "5979b82e-d74f-46c1-9848-5e0ab1412c63",
    "a3baab52-91ac-4435-a6ca-eb6848c887fd",
    "baaaa4b9-c634-493d-af09-a1236ea419b8"
  ]
]
```

```json
[
  ["==>", ["/=> custom_fun", "res", ["::", "@res"]]],
  [
    "==?",
    ["::bool.<", ["::.len", "#arguments"], 3],
    ["::err", "arguments less than 3"]
  ],
  [
    "==?",
    ["::bool.>", ["::.len", "#arguments"], 3],
    ["::err", "arguments more than 3"]
  ],
  [
    "::.map",
    "#arguments",
    [
      "/=>",
      ["argument", "index"],
      [
        "==> seq",
        ["==?", ["::bool.=", "@index", 0], ["::str", "@argument"]],
        ["==?", ["::bool.between", "@index", 1, 3], ["::num", "@argument"]],
        ["::num", 5]
      ],
      [
        "==> pipe",
        "",
        ["/=>", ["res"], ["::str", "@res", "@", "res", " "]],
        ["/=>", ["res"], ["::str", "@res", " "]],
        ["/=>", ["res"], ["::str", "@res", " "]]
      ]
    ]
  ]
]
```
