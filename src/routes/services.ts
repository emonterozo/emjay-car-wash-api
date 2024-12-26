import express from 'express';
import { get_all_services_controller } from 'src/infrastructure/controllers/services';

const router = express.Router();

router.get('/', async (req, res) => {

    const { limit, order_by, offset } = req.body;
    const response = await get_all_services_controller.handle({ limit, order_by, offset });

    if (response.errors.length > 0)
        res.status(400)
    else
        res.status(200)

    res.send(response)
});

export default router;
