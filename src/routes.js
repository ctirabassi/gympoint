import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddlaware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddlaware);

routes.post('/userss', UserController.store);

routes.post('/students', StudentController.store);

routes.delete('/plans/:id', PlanController.delete);
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);

export default routes;
