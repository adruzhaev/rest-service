import express, { Router } from 'express';
import { user } from './routes/user';
import { UserService } from './services/user.sevice';
import { mockData } from './util/mock-data';

const port = 8000;
const app = express();
const routes = Router();

user(routes, new UserService(mockData));

app.use(express.json());
app.use('', routes);

app.listen(port, () => {
    console.log(`Server is started on port: ${port}`);
});
