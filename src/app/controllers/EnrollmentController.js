import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(400).json({ error: 'Enrollment not found' });

    await enrollment.destroy();

    return res.json({ message: 'Deleted' });
  }

  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const enrollmentExists = await Enrollment.findOne({
      where: {
        student_id: req.body.student_id,
      },
    });

    const { student_id, plan_id, start_date } = req.body;

    if (enrollmentExists)
      return res
        .status(400)
        .json({ error: 'This student is already enrolled' });

    // Checking student
    const student = await Student.findByPk(student_id);
    if (!student) return res.status(400).json({ error: 'Student not found' });

    // Checking plan
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    // Calculating
    const price = plan.price * plan.duration;
    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment)
      return res.status(400).json({ error: 'Enrollment not found' });

    const { plan_id, start_date } = req.body;

    // Checking plan
    const plan = await Plan.findByPk(plan_id);
    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    // Calculating
    enrollment.price = plan.price * plan.duration;
    enrollment.end_date = addMonths(parseISO(start_date), plan.duration);

    enrollment.save();

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
