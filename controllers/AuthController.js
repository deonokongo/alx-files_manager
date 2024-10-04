import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  // Handle user connection and generate a token
  static async getConnect(req, res) {
    const { user } = req;

    // Check if user is authenticated
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = uuidv4();

    // Store the token in Redis with a TTL of 24 hours
    await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60);
    res.status(200).json({ token });
  }

  // Handle user disconnection and delete the token
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    // Check if token is provided
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}
