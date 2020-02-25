module.exports = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Ductt",
    description: "Book Shop API",
    contact: {
      name: "Trần Tiến Đức",
      email: "trantienduc10@gmail.com"
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  servers: [
    {
      url: "http://localhost:3001/api",
      description: "Local server"
    }
  ],
  security: [
    {
      ApiKeyAuth: []
    }
  ],
  tags: [
    {
      name: "Auth Op"
    },
    {
      category: "Category Op"
    },
    {
      order: "Order Op"
    }
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth Op"],
        description: "Register user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/registerBody"
              }
            }
          },
          required: true
        },
        responses: {
          "201": {
            description: "New user is created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/registerResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth Op"],
        description: "Login user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/loginBody"
              }
            }
          },
          required: true
        },
        responses: {
          "200": {
            description: "Login success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/loginResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/getInfo": {
      get: {
        tags: ["Auth Op"],
        description: "Get info user",
        parameters: [],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/getInfoResponse"
                }
              }
            }
          }
        }
      }
    },
    "/categories/{id}": {
      get: {
        tags: ["Category Op"],
        description: "Get one category",
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "integer",
              default: 1
            },
            required: true
          }
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/getOneBookResponse"
                }
              }
            }
          }
        }
      }
    },
    "/orders": {
      post: {
        tags: ["Order Op"],
        description: "Admin add order",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/createOrderBody"
              }
            }
          },
          required: true
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/getOneBookResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      registerBody: {
        type: "object",
        properties: {
          username: {
            type: "string",
            example: "username"
          },
          email: {
            type: "string",
            example: "email"
          },
          password: {
            type: "string",
            example: "password"
          }
        }
      },
      registerResponse: {
        type: "object",
        properties: {
          username: {
            type: "string",
            example: "username"
          },
          email: {
            type: "string",
            example: "email"
          },
          password: {
            type: "string",
            example: "password"
          }
        }
      },
      loginBody: {
        type: "object",
        properties: {
          username_or_email: {
            type: "string",
            example: "username"
          },
          password: {
            type: "string",
            example: "password"
          }
        }
      },
      loginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "evjsddgdfgdfgosgsd"
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 1
              },
              username: {
                type: "string",
                example: "ductt"
              }
            }
          }
        }
      },
      getInfoResponse: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1
          },
          username: {
            type: "string",
            example: "ductt"
          }
        }
      },
      getOneBookResponse: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1
          },
          parent_id: {
            type: "number",
            example: 1
          },
          name: {
            type: "string",
            example: ""
          },
          short_name: {
            type: "string",
            example: ""
          },
          description: {
            type: "string",
            example: ""
          },
          is_active: {
            type: "boolean",
            example: true
          },
          url: {
            type: "string",
            example: ""
          },
          parent: {
            type: "object",
            example: {}
          }
        }
      },
      createOrderBody: {
        type: "object",
        properties: {
          shipping_method: {
            type: "string",
            enum: [
              "delivery",
            ],
          },
          payment_method: {
            type: "string",
            enum: [
              "online",
              "offline"
            ]
          },
          final_payment: {
            type: "number",
          },
          order_info: {
            type: "string",
            example: "{}"
          },
          delivery_info: {
            type: "string",
            example: "{}"
          },
          comment: {
            type: "string",
            example: ""
          },
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "number"
                },
                quantity: {
                  type: "number"
                },
                buy_price: {
                  type: "number"
                }
              }
            }
          }
        }
      },
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-Token"
      }
    }
  }
};
