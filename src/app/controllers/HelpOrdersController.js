import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async delete(req, res) {
    const helperorder = HelpOrder.findByPk(req.params.id);
    if (!helperorder)
      return res.status(400).json({ error: 'Helper Order not found' });

    await helperorder.destroy();

    return res.json({ message: 'Deleted' });
  }

  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const helperorders = await HelpOrder.findAll({
      limit,
      offset: (page - 1) * limit,
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(helperorders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const { question } = req.body;
    const student_id = req.params.id;

    // Checking student
    const student = await Student.findByPk(student_id);
    if (!student) return res.status(400).json({ error: 'Student not found' });

    // Checking question
    const questionExists = await HelpOrder.findOne({
      where: {
        student_id,
        question,
      },
    });
    if (questionExists)
      return res.status(400).json({ error: 'This question already exists' });

    const helporder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(helporder);
  }

  async update(req, res) {
    return res.json();
  }
}

export default new HelpOrderController();
