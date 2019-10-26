import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddlaware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

const routes = new Router();

routes.post('/session', SessionController.store);

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

export default routes;
