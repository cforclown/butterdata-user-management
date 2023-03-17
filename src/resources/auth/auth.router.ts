import express from 'express';
import { RequestHandler, validateBody } from '../../utils';
import { AuthenticatePayloadSchema, LoginGooglePayloadSchema, LoginPayloadSchema, RefreshTokenPayloadSchema, RegisterPayloadSchema } from '.';
import { AuthController } from './auth.controller';

export function AuthRouter ({ authController }: { authController: AuthController }): express.Router {
  const router = express.Router();

  /**
   * @swagger
   * /auth/login:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Login
   *          responses:
   *              '200':
   *                  description: Login Success
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/login'
   */
  router.post('/login', validateBody(LoginPayloadSchema), RequestHandler(authController.login));

  /**
   * @swagger
   * /auth/login-google:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Register
   *          responses:
   *              '200':
   *                  description: Login with Google success
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/loginGoogle'
   */
  router.post('/login-google', validateBody(LoginGooglePayloadSchema), RequestHandler(authController.loginGoogle));

  /**
   * @swagger
   * /auth/register:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Register
   *          responses:
   *              '200':
   *                  description: Register success
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/register'
   */
  router.post('/register', validateBody(RegisterPayloadSchema), RequestHandler(authController.register));

  /**
   * @swagger
   * /auth/refresh:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Refresh Token
   *          responses:
   *              '200':
   *                  description: Access token has been refreshed
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/refreshToken'
   */
  router.post('/refresh', validateBody(RefreshTokenPayloadSchema), RequestHandler(authController.refresh));

  /**
   * @swagger
   * /auth/logout:
   *      delete:
   *          tags:
   *              - Authentication
   *          description: Logout success
   *          responses:
   *              '200':
   *                  description: Logout Success
   *          security:
   *              - Bearer: []
   */
  router.delete('/logout', RequestHandler(async () => Promise.resolve(true)));

  router.post('/authenticate', validateBody(AuthenticatePayloadSchema), RequestHandler(authController.authenticate));

  return router;
}
