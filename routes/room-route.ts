import { Router } from "express";
import { RoomControllers } from "../controllers/room-controller";
import authentication from "../middlewares/authentication";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: The room managing end points
 */

/**
 * @swagger
 * /api/room/getall:
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I
 *     responses:
 *       200:
 *         description: All rooms returns successfully
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
 *                     rooms:
 *                       type: object
 *                       properties:
 *                         46e9510a-b650-4989-89ab-d387800aa0d5:
 *                           type: object
 *                           properties:
 *                             roomId:
 *                               type: string
 *                               description: Room Id
 *                             roomName:
 *                               type: string
 *                               description: Room Name
 *                             isPrivate:
 *                               type: boolean
 *                               description: Status of the room private or public, it's false by default
 *                             rounds:
 *                               type: number
 *                               description: Game Rounds Number, it's 5 by default
 *                             maxPlayers:
 *                               type: number
 *                               description: maximum number of players in the room, it's 5 by default
 *                           example:
 *                             roomId: 46e9510a-b650-4989-89ab-d387800aa0d5
 *                             roomName: heros
 *                             maxPlayers: 5
 *                             rounds: 5
 *                             isPrivate: true
 *       500:
 *         description: The token is not valid any more
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
 *             example:
 *               status: false
 *               message: invalid token
 */

router.route("/getall").get(authentication, RoomControllers.getAllRooms);

/**
 * @swagger
 * /api/room/create:
 *   post:
 *     summary: Create new room
 *     tags: [Room]
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
 *               - roomName
 *               - password
 *             properties:
 *               roomName:
 *                 type: string
 *                 description: Room Name
 *               maxPlayers:
 *                 type: number
 *                 description: Max number of players in the room, its 5 by default
 *               rounds:
 *                 type: number
 *                 description: Game rounds, its 5 by default
 *               password:
 *                 type: string
 *                 description: Room Password, Should be between 4 and 10 character
 *           example:
 *             roomName: snake
 *             password: snake123
 *             maxPlayers: 10
 *             rounds: 4
 *     responses:
 *       201:
 *         description: The room created successfully
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
 *                     roomToken:
 *                       type: string
 *                       description: Authentication token to access the room
 *             example:
 *               status: true
 *               data: {"roomToken":eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I}
 *       500:
 *         description: The token is not valid any more
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
 *             example:
 *               status: false
 *               message: invalid token
 */
router.route("/create").post(authentication, RoomControllers.createRoom);

/**
 * @swagger
 * /api/room/join:
 *   patch:
 *     summary: Join to room
 *     tags: [Room]
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
 *               - roomId
 *               - password
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: Room ID
 *               password:
 *                 type: string
 *                 description: Room Password, Should be between 4 and 10 character
 *           example:
 *             roomId: 670e731d0f5fc1fcda0d4664
 *             password: snake123
 *     responses:
 *       200:
 *         description: join to room done successfully
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
 *                     roomToken:
 *                       type: string
 *                       description: Authentication token to access the room
 *             example:
 *               status: true
 *               data: {"roomToken":eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NmIzZTFjMDQ5M2E0ZTkxNmFmYzdlZjQiLCJpYXQiOjE3MjM0ODY5NjUsImV4cCI6NDMxNTQ4Njk2NX0.-HhVZgYJZmZZSfBfm9RlKp1W_X58wOUm02cT_lQeN-I}
 *       500:
 *         description: The token is invalid or the password is wrong or the room is full of players
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
 *               Room password is wrong:
 *                 value:
 *                   status: false
 *                   message: wrong password
 *               The token is wrong:
 *                 value:
 *                   status: false
 *                   message: invalid token
 *               The room is full of players:
 *                 value:
 *                   status: false
 *                   message: The room is full of players
 */

router.route("/join").patch(authentication, RoomControllers.joinRoom);
export default router;
