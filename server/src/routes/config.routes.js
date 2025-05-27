import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import SystemConfig from '../models/SystemConfig.js';

const router = express.Router();

// Get system configuration
router.get('/',
  protect,
  authorize('Admin','HR'),
  async (req, res) => {
    try {
      const config = await SystemConfig.findOneOrCreate();
      res.json(config);
    } catch (error) {
      console.error('Error fetching system config:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update system configuration
router.put('/',
  protect,
  authorize('Admin','HR'),
  async (req, res) => {
    try {
      let config = await SystemConfig.findOne();
      if (!config) {
        config = new SystemConfig();
      }

      // Update all fields
      Object.assign(config, req.body);

      await config.save();
      res.json(config);
    } catch (error) {
      console.error('Error updating system config:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;