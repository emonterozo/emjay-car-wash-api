import express from 'express';
import { get_all_employees_controller, get_employee_controller } from '../infrastructure/controllers/employees';

const router = express.Router();

router.get('/', async (req, res) => {

    const limit = +(req.query.limit as string);
    const offset = +(req.query.offset as string);
    let query_order = JSON.parse((req.query?.order_by as string) ?? "{}");
    if (!query_order?.field || !query_order?.direction)
        query_order = undefined;

    const token = req.headers.authorization?.split(' ')[1] ?? ''
    const response = await get_all_employees_controller.handle(token);

    res
        .status(response.status!)
        .send(response);
});

router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const token = req.headers.authorization?.split(' ')[1] ?? ''
    const response = await get_employee_controller.handle(token, employee_id);

    res
        .status(response.status!)
        .send(response);
})


export default router;
