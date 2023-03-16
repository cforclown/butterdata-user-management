import { Router } from 'express';
import { UsersController } from './users.controller';
import { RequestHandler, validateBody, validateParams } from '../../utils';
import { ObjectIdSchema } from '../../schemas/common-schema';
import { UpdateUserPayloadSchema } from './users.dto';

export function UsersRouter ({ usersController }:{ usersController:UsersController }): Router {
  const router = Router();

  /**
   * @swagger
   * /api/users/{objectId}:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              -   name: objectId
   *                  in: path
   *                  required: true
   */
  router.get('/:objectId', validateParams(ObjectIdSchema), RequestHandler(usersController.get));

  /**
   * @swagger
   * /api/users:
   *      get:
   *          tags:
   *              - Users
   *          description: Get all users
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   */
  router.get('/', RequestHandler(usersController.getAll));

  /**
   * @swagger
   * /api/users:
   *      patch:
   *          tags:
   *              - Users
   *          description: Update user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "Update user payload"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/updateUser'
   */
  router.patch('/', validateBody(UpdateUserPayloadSchema), RequestHandler(usersController.update));

  /**
   * @swagger
   * /api/users:
   *      delete:
   *          tags:
   *              - Users
   *          description: Delete user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              -   name: objectId
   *                  in: path
   *                  required: true
   */
  router.delete('/:objectId', RequestHandler(usersController.delete));

  return router;
}
