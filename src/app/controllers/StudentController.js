import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExist)
      return res.status(400).json({ error: 'student already exists.' });

    const { id, name, email, age, weight, heigth } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, weight, heigth });
  }
}

export default new StudentController();
