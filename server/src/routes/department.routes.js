import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import Department from '../models/Department.js';

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'name email')
      .populate('parentDepartment', 'name');
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department
router.post('/',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Department name is required'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const { name, description, manager, parentDepartment, status } = req.body;

      // Check if department already exists
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return res.status(400).json({ message: 'Department already exists' });
      }

      const department = new Department({
        name,
        description,
        manager,
        parentDepartment,
        status: status || 'Active'
      });

      await department.save();
      res.status(201).json(department);
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update department
router.put('/:id',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Department name is required'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      const { name, description, manager, parentDepartment, status } = req.body;

      // Check if new name already exists (excluding current department)
      const existingDepartment = await Department.findOne({
        name,
        _id: { $ne: req.params.id }
      });
      if (existingDepartment) {
        return res.status(400).json({ message: 'Department name already exists' });
      }

      department.name = name;
      department.description = description;
      department.manager = manager;
      department.parentDepartment = parentDepartment;
      department.status = status;

      await department.save();
      res.json(department);
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete department
router.delete('/:id',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      // Check if department has employees
      const hasEmployees = await User.exists({ department: req.params.id });
      if (hasEmployees) {
        return res.status(400).json({
          message: 'Cannot delete department with assigned employees'
        });
      }

      await department.remove();
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;