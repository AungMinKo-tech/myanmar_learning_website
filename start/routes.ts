/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const AlphabetsController = () => import('#controllers/alphabets_controller')
const LessonsController = () => import('#controllers/lessons_controller')
const ExerciseController = () => import('#controllers/exercises_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('/v1')

router
  .group(() => {
    router.get('/alphabets', [AlphabetsController, 'index'])
    router.get('/alphabets/:id', [AlphabetsController, 'show'])
    router.post('/alphabets', [AlphabetsController, 'store'])
    router.put('/alphabets/:id', [AlphabetsController, 'update'])
    router.delete('/alphabets/:id', [AlphabetsController, 'destroy'])
  })
  .prefix('/v1')

router
  .group(() => {
    router.get('/lessons', [LessonsController, 'index'])
    router.get('/lessons/:id', [LessonsController, 'show'])
    router.post('/lessons', [LessonsController, 'store'])
    router.put('/lessons/:id', [LessonsController, 'update'])
    router.delete('/lessons/:id', [LessonsController, 'destroy'])
  })
  .prefix('/v1')

router
  .group(() => {
    router.get('/exercises', [ExerciseController, 'index'])
    router.get('/exercises/:id', [ExerciseController, 'show'])
    router.post('/exercises', [ExerciseController, 'store'])
    router.put('/exercises/:id', [ExerciseController, 'update'])
    router.delete('/exercises/:id', [ExerciseController, 'destroy'])
  })
  .prefix('/v1')
