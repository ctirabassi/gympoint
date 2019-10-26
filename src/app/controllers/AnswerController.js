import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerMail from '../jobs/AnswerEmail';
import Queue from '../../lib/Queue';

class AnswerController {
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
        answer: null,
      },
    });

    return res.json(helperorders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const { answer } = req.body;

    // Checking question
    const helperorder = await HelpOrder.findByPk(req.params.id, {
      include: {
        model: Student,
        as: 'student',
        atributes: ['name', 'email'],
      },
    });
    if (!helperorder)
      return res.status(400).json({ error: 'Helper Order not found' });

    helperorder.answer = answer;
    helperorder.answer_at = new Date();

    await helperorder.save();

    await Queue.add(AnswerMail.key, { helperorder });

    return res.json(helperorder);
  }
}

export default new AnswerController();
