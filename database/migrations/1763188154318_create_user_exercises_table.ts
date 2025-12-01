import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('exercise_id')
        .unsigned()
        .references('id')
        .inTable('exercises')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('lesson_id').unsigned().references('id').inTable('lessons').onDelete('CASCADE')
      table.text('answer').notNullable()
      table.boolean('is_correct').notNullable()
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
