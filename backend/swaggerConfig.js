/**
 * API Documentation using Swagger/OpenAPI 3.0
 * Generate API docs with: npx swagger-jsdoc -d swaggerConfig.js -o swagger.json
 */

module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Foodies Recipe API',
      version: '1.0.0',
      description: 'API for recipe management, search, and social features',
      contact: {
        name: 'Foodies API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.foodies.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Recipe ID' },
            label: { type: 'string', description: 'Recipe name' },
            image: { type: 'string', format: 'uri', description: 'Recipe image URL' },
            source: { type: 'string', description: 'Recipe source' },
            url: { type: 'string', format: 'uri', description: 'Recipe source URL' }
          }
        },
        UserRecipe: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            title: { type: 'string', minLength: 3, maxLength: 150 },
            description: { type: 'string', minLength: 10, maxLength: 2000 },
            prep_time: { type: 'integer', description: 'Minutes' },
            cook_time: { type: 'integer', description: 'Minutes' },
            servings: { type: 'integer' },
            ingredients: { type: 'array', items: { type: 'string' } },
            instructions: { type: 'array', items: { type: 'string' } },
            difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
            image: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' }
          },
          required: ['title', 'description', 'prep_time', 'cook_time', 'servings', 'ingredients', 'instructions']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            display_name: { type: 'string' },
            avatar_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            recipe_id: { type: 'string' },
            user_id: { type: 'integer', nullable: true },
            content: { type: 'string', minLength: 1, maxLength: 1000 },
            username: { type: 'string' },
            display_name: { type: 'string' },
            avatar_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './routes/auth.js',
    './routes/recipes.js',
    './routes/users.js',
    './routes/comments.js'
  ]
};
