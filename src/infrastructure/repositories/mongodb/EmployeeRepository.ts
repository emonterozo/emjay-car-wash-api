import { IEmployeeRepository } from "src/application/ports/repositories/IEmployeeRepository";
import { EmployeeObject } from "src/application/use-cases/employees/common";
import { MongoDB } from "./MongoDB";
import { FindAllOptions } from "src/application/ports/repositories/common";
import { Collection, ObjectId } from "mongodb";

interface IEmployeeCollection {
    first_name: string,
    last_name: string,
    gender: "MALE" | "FEMALE"; // MALE | FEMALE
    birth_date: Date,
    contact_number: string,
    employee_title: string,
    employee_status: "ACTIVE" | "TERMINATED"; // ACTIVE | TERMINATED
    date_started: Date,
}

export class EmployeeRepository implements IEmployeeRepository {

    private readonly _mongo_client = MongoDB.instance();

    public async findAll(options: FindAllOptions<EmployeeObject>): Promise<EmployeeObject[]> {
        await this._mongo_client.connect();
        const database = this._mongo_client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<IEmployeeCollection> = database.collection(process.env.MONGO_EMPLOYEES_COLLECTION!);

        const and = options?.and_conditions?.map(condition => {
            if (condition.field === 'id')
                return { _id: new ObjectId(condition.value) };

            return { [condition.field]: condition.value }
        })

        const or = options?.or_conditions?.map(condition => {
            if (condition.field === 'id')
                return { _id: new ObjectId(condition.value) };

            return { [condition.field]: condition.value }
        })


        const not = options?.not?.map(condition => {
            if (condition.field === 'id')
                return { _id: new ObjectId(condition.value) };

            return { [condition.field]: condition.value }
        });

        const employees = await collection
            .find({
                [options?.range?.field ?? '']: {
                    $gte: options?.range?.start,
                    $lte: options?.range?.end
                },
                ...(and?.length ? { $and: and } : {}),
                ...(or?.length ? { $or: or } : {})
            })
            .toArray();

        return employees.map(employee => ({
            id: employee._id.toString(),
            first_name: employee.first_name,
            last_name: employee.last_name,
            gender: employee.gender,
            birth_date: employee.birth_date,
            contact_number: employee.contact_number,
            employee_title: employee.employee_title,
            employee_status: employee.employee_status,
            date_started: employee.date_started
        }))

    }

    public async count(options?: FindAllOptions<EmployeeObject>): Promise<number> {
        await this._mongo_client.connect();
        const database = this._mongo_client.db(process.env.MONGO_DATASOURCE);
        const collection: Collection<IEmployeeCollection> = database.collection(process.env.MONGO_EMPLOYEES_COLLECTION!);

        const employee_count = await collection.countDocuments();

        return employee_count;
    }
}