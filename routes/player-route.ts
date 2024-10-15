import { Router } from "express";
import { PlayerControllers } from "../controllers/player-controller";
import authentication from "../middlewares/authentication";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Player
 *   description: The player managing end points
 */

/**
 * @swagger
 * /api/player/register:
 *   post:
 *     summary: Create new account on the website
 *     tags: [Player]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Player Email
 *               username:
 *                 type: string
 *                 description: Player Name
 *               password:
 *                 type: string
 *                 description: Player password should be between 4 and 10 character
 *             example:
 *               email: test@gmail.com
 *               password: test123
 *               username: test test
 *     responses:
 *       201:
 *         description: The account has created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Response status ,always its true
 *                 data:
 *                   type: object
 *                   properties:
 *                     authToken:
 *                       type: string
 *                       description: Authentication token to verify the player
 *               example:
 *                 status: true
 *                 data: {"authToken":eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I}
 *       500:
 *         description: The email is already used by another account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Response status ,always its false
 *                 message:
 *                   type: string
 *                   description: Explanation of the error
 *               example:
 *                 status: false
 *                 message: the email is already exist
 */
router.route("/register").post(PlayerControllers.registerController);

/**
 * @swagger
 * /api/player/login:
 *   post:
 *     summary: Log in to your account
 *     tags: [Player]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Player Email
 *               username:
 *                 type: string
 *                 description: Player Name
 *               password:
 *                 type: string
 *                 description: Player password should be between 4 and 10 character
 *             example:
 *               email: test@gmail.com
 *               password: test123
 *     responses:
 *       200:
 *         description: Login completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Response status ,always its true
 *                 data:
 *                   type: object
 *                   properties:
 *                     authToken:
 *                       type: string
 *                       description: Authentication token to verify the player
 *               example:
 *                 status: true
 *                 data: {"authToken":eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I}
 *       500:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Response status ,always its false
 *                 message:
 *                   type: string
 *                   description: Explanation of the error
 *               example:
 *                 status: false
 *                 message: email or password is incorrect
 */
router.route("/login").post(PlayerControllers.loginController);

/**
 * @swagger
 * /api/player/delete:
 *   delete:
 *     summary: Delete the account
 *     tags: [Player]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password of the account
 *             example:
 *               password: test123
 *     responses:
 *       202:
 *         description: The account has deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Response status ,always its true
 *                 data:
 *                   type: null
 *                   description: No data returned
 *               example:
 *                 status: true
 *                 data: null
 *       500:
 *         description: The token is invalid or the password is wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Response status ,always its false
 *                 message:
 *                   type: string
 *                   description: Explanation of the error
 *             examples:
 *               The password is wrong:
 *                 value:
 *                   status: false
 *                   message: wrong password
 *               The token is wrong:
 *                 value:
 *                   status: false
 *                   message: invalid token
 */

router
  .route("/delete")
  .delete(authentication, PlayerControllers.deleteController);

export default router;
