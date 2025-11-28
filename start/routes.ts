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

const AuthController = () => import('#controllers/common/auth_controller')
const ChangePasswordsController = () => import('#controllers/common/change_passwords_controller')
const ProfileUpdatesController = () => import('#controllers/common/profile_updates_controller')
const UsersController = () => import('#controllers/admin/users_controller')
const AlphabetsController = () => import('#controllers/admin/alphabets_controller')
const LessonsController = () => import('#controllers/admin/lessons_controller')
const ExerciseController = () => import('#controllers/admin/exercises_controller')
const AdminExerciseController = () => import('#controllers/admin/user_exercises_controller')
const AdminTestimonialController = () => import('#controllers/admin/testimonials_controller')
const AdminContactController = () => import('#controllers/admin/contacts_controller')

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
    router
      .post('/change-password', [ChangePasswordsController, 'changePassword'])
      .use(middleware.auth())
    router.post('/profile-update', [ProfileUpdatesController, 'update']).use(middleware.auth())
  })
  .prefix('/v1')

router
  .group(() => {
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.delete('/users/:id', [UsersController, 'destroy'])

    router.get('/alphabets', [AlphabetsController, 'index'])
    router.get('/alphabets/:id', [AlphabetsController, 'show'])
    router.post('/alphabets', [AlphabetsController, 'store'])
    router.put('/alphabets/:id', [AlphabetsController, 'update'])
    router.delete('/alphabets/:id', [AlphabetsController, 'destroy'])

    router.get('/lessons', [LessonsController, 'index'])
    router.get('/lessons/:id', [LessonsController, 'show'])
    router.post('/lessons', [LessonsController, 'store'])
    router.put('/lessons/:id', [LessonsController, 'update'])
    router.delete('/lessons/:id', [LessonsController, 'destroy'])

    router.get('/exercises', [ExerciseController, 'index'])
    router.get('/exercises/:id', [ExerciseController, 'show'])
    router.post('/exercises', [ExerciseController, 'store'])
    router.put('/exercises/:id', [ExerciseController, 'update'])
    router.delete('/exercises/:id', [ExerciseController, 'destroy'])

    router.get('/user-exercises', [AdminExerciseController, 'index'])
    router.get('/user-exercises/:id', [AdminExerciseController, 'show'])
    router.delete('/user-exercises/:id', [AdminExerciseController, 'destroy'])

    router.get('/testimonials', [AdminTestimonialController, 'index'])
    router.get('/testimonials/:id', [AdminTestimonialController, 'show'])
    router.delete('/testimonials/:id', [AdminTestimonialController, 'destroy'])

    router.get('/contacts', [AdminContactController, 'index'])
    router.get('/contacts/:id', [AdminContactController, 'show'])
    router.delete('/contacts/:id', [AdminContactController, 'destroy'])
  })
  .prefix('/v1')
  .use(middleware.auth())
  .use(middleware.role('admin'))
