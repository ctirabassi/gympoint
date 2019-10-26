import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helperorder } = data;

    await Mail.sendMail({
      to: `${helperorder.student.name} <${helperorder.student.email}>`,
      subject: 'Sua pergunta foi respondida!',
      template: 'answer',
      context: {
        student: helperorder.student.name,
        question: helperorder.question,
        answer: helperorder.answer,
      },
    });
  }
}

export default new AnswerMail();
