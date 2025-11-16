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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/v1/register', [AuthController, 'register'])
router.post('/v1/login', [AuthController, 'login'])
router.post('/v1/logout', [AuthController, 'logout']).use(middleware.auth())
