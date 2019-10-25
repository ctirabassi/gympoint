import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddlaware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddlaware);

routes.post('/userss', UserController.store);

routes.post('/students', StudentController.store);

export default routes;
