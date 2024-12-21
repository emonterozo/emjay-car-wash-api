import express from 'express';
import { get_all_services_controller } from 'src/infrastructure/controllers/services';

const router = express.Router();

router.get('/', async (req, res) => {
    const reponse = await get_all_services_controller.handle();

    res
        .status(200)
        .send(reponse)
});

export default router;
