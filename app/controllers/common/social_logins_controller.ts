import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import fetch from 'node-fetch'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'
const SCOPES = ['email', 'profile'].join(' ')

export default class SocialLoginsController {
  async googleLogin({ response }: HttpContext) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL
    const url = `${GOOGLE_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${SCOPES}&access_type=offline&prompt=select_account`
    return response.redirect(url)
  }

  async googleCallback({ request, response, auth }: HttpContext) {
    const code = request.input('code')

    if (!code) {
      return response.status(400).send('Google Authorization Code not provided')
    }

    try {
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
          grant_type: 'authorization_code',
        }),
      })

      const tokenData: any = await tokenResponse.json()
      const accessToken = tokenData.access_token

      if (!accessToken) {
        throw new Error('Failed to obtain access token')
      }

      const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const socialUser: any = await userInfoResponse.json()

      let user = await User.query().where('email', socialUser.email).first()

      if (!user) {
        user = await User.create({
          name: socialUser.name,
          email: socialUser.email,
          profile: socialUser.picture,
        })
      }

      await auth.login(user)
      return response.redirect('/')
    } catch (error) {
      console.error('Google Login Error:', error)
      return response.status(500).send('Google Login error')
    }
  }
}
