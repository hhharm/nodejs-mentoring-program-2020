import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {find, findIndex, sortBy, defaultTo, filter, slice} from "lodash";

const SERVER_PORT = process.env.SERVER_PORT || 3000;
type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};

const ADMIN: User = {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    login: "admin",
    password: "password",
    age: 25,
    isDeleted: false,
};
const MODERATOR: User = {
    id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    login: "moderator",
    password: "password",
    age: 23,
    isDeleted: false,
};
const USER_COLLECTION: User[] = [ADMIN, MODERATOR];

const app = express();
const router = express.Router();

// without this express always see req.body as undefined
app.use(express.json());

// logs
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console(),
    ],
    format: winston.format.combine(
        winston.format.json(),
    ),
    meta: false,
}));

// query param: loginSubstring and limit
// example: /user/suggest?limit=5&loginSubstring=har
// returns array of found users
router.get("/user/suggest", (
    req: Request, res: Response<{ users: User[] }>
) => {
    const loginSubstring: string = defaultTo(req.query.loginSubstring, "")
        .toString()
        .toLowerCase();
    const limit: number = +defaultTo(req.query.limit, "");
    const findUserByLoginSubstr = (user: User) =>
        user.login.toLowerCase().includes(loginSubstring);
    const users: User[] = sortBy(
        slice(
            filter(USER_COLLECTION, findUserByLoginSubstr),
            0, limit),
        "login") as User[];
    res.status(200).send({users});
});

router.get("/user/:id", (
    req: Request, res: Response<User | { message: string }>
) => {
    const user = find(USER_COLLECTION, {id: req.params.id});
    if (!user) {
        res.status(404).send({
            message: `User with id ${req.params.id} is not found.`,
        });
    } else {
        res.status(200).json(user);
    }
});

router.put("/user/:id", (
    req: Request, res: Response<User | { message: string }>
) => {
    const {age, login, password} = req.body;
    const userIndex: number = findIndex(USER_COLLECTION,
        {id: req.params.id},
    );

    if (userIndex === -1) {
        const body = {
            message: `User with id ${req.params.id} is not found.`,
        };
        res.status(404).send(body);
    } else {
        USER_COLLECTION[userIndex] = {
            ...USER_COLLECTION[userIndex],
            age,
            login,
            password,
        };
        res.status(200).send(USER_COLLECTION[userIndex]);
    }
});

router.post("/user", (
    req, res: Response<User>
) => {
    const {age = "", login = "", password = ""} = req.body;
    const user: User = {
        id: uuidv4(),
        login,
        password,
        age,
        isDeleted: false,
    };
    USER_COLLECTION.push(user);
    res.status(201).json(user);
});

router.delete("/user/:id", (
    req: Request, res: Response<{ message: string }>
) => {
    const userIndex = findIndex(USER_COLLECTION, {id: req.params.id});
    if (userIndex === -1) {
        res.status(404).send({
            message: `User with id ${req.params.id} is not found.`,
        });
    } else {
        USER_COLLECTION[userIndex] = {
            ...USER_COLLECTION[userIndex],
            isDeleted: true,
        };
        res.status(200).send({
            message: `User with id ${req.params.id} was deleted.`,
        });
    }
});

app.use("/", router);

app.listen(SERVER_PORT, function () {
    console.log("User REST API app listening on port 3000!");
});
