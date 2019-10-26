import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async delete(req, res) {
    if (!req.params.id)
      return res.status(400).json({ error: 'id not informed' });

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    await plan.destroy();

    return res.json({ ok: true });
  }

  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const planExists = await Plan.findOne({
      where: {
        title: req.body.title,
      },
    });

    if (planExists) return res.status(400).json('This plan already exists');

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    if (!req.params.id)
      return res.status(400).json({ error: 'id not informed' });

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) return res.status(400).json({ error: 'Plan not found' });

    const { title, durance, price } = await plan.update(req.body);

    return res.json({ id: plan.id, title, durance, price });
  }
}

export default new PlanController();
