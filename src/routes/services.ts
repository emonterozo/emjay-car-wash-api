import express from 'express';
import { get_all_services_controller } from 'src/infrastructure/controllers/services';

const router = express.Router();

router.get('/', async (req, res) => {
    const response = await get_all_services_controller.handle();

    if (response.errors.length > 0)
        res.status(400)
    else
        res.status(200)

    res.send(response)
});

export default router;
