import { subDays } from 'date-fns';
import Checkin from '../schemas/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.find({
      student_id: req.params.id,
    })
      .sort('created_At')
      .limit(20);

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) return res.status(400).json({ error: 'Student not found' });

    const amount_checkins = await Checkin.countDocuments({
      createdAt: { $gte: subDays(new Date(), 7) },
    });
    if (amount_checkins > 5)
      return res.status(400).json({
        error: 'Exceeded number of check-ins allowed in last 5 days',
      });

    const checkin = await Checkin.create({ student_id: id });

    return res.json(checkin);
  }
}

export default new CheckinController();
