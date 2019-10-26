import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddlaware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AnswerController from './app/controllers/AnswerController';

const routes = new Router();

routes.post('/session', SessionController.store);

// Check-in
routes.get('/students/:id/checkin', CheckinController.index);
routes.post('/students/:id/checkin', CheckinController.store);

// Help Orders
routes.get('/students/:id/help-orders', HelpOrdersController.index);
routes.post('/students/:id/help-orders', HelpOrdersController.store);

// Auth
routes.use(authMiddlaware);

routes.post('/users', UserController.store);

// Students
routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);

// Plans
routes.delete('/plans/:id', PlanController.delete);
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);

// Enrollment
routes.delete('/enrollments/:id', EnrollmentController.delete);
routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);

// Answer
routes.delete('/help-orders/:id/answer', AnswerController.delete);
routes.get('/help-orders', AnswerController.index);
routes.put('/help-orders/:id/answer', AnswerController.update);

export default routes;
