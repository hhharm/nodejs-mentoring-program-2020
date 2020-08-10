import express from "express";
import * as winston from "winston";
import * as  expressWinston from "express-winston";
import {v4 as uuidv4} from "uuid";
import {sortBy} from "lodash";

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
const USER_COLLECTION: Record<string, User> = {
    [ADMIN.id]: ADMIN,
    [MODERATOR.id]: MODERATOR
};
const DEFAULT_SLICE_LIMIT = 10;

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

router.param("id", (req: express.Request, res: express.Response, next) => {
    const { id } = req.params;
    const userExist: boolean = Object.keys(USER_COLLECTION).includes(id);
    if (!userExist) {
        res.status(404).send({
            message: `User with id ${req.params.id} is not found.`,
        });
    } else {
        next();
    }
});

// query param: loginSubstring and limit
// example: /user/suggest?limit=5&loginSubstring=har
// returns array of found users
// NB! user/suggest should be always before user/:id
router.get("/user/suggest", (req: express.Request, res: express.Response<{ users: User[] }>) => {
    const { loginSubstring = "", limit } = req.query;
    const lowLoginSubstring = (loginSubstring as string).toLowerCase();
    const sliceLimit = limit ? +limit : DEFAULT_SLICE_LIMIT;
    const findUserByLoginSubstr = (user: User) =>
        user.login.toLowerCase().includes(lowLoginSubstring);
    const users: User[] = sortBy(
        Object.values(USER_COLLECTION).filter(findUserByLoginSubstr).slice(0, sliceLimit),
        "login") as User[];
    res.status(200).send({ users });
});

router.get("/user/:id", (req: express.Request, res: express.Response<User | { message: string }>) => {
    const { id } = req.params;
    res.status(200).json(USER_COLLECTION[id]);
});

router.put("/user/:id", (req: express.Request, res: express.Response<User | { message: string }>) => {
    const { age, login, password } = req.body;
    const { id } = req.params;
    USER_COLLECTION[id] = {
        ...USER_COLLECTION[id],
        age,
        login,
        password,
    };
    res.status(200).send(USER_COLLECTION[id]);
});

router.post("/user", (req: express.Request, res: express.Response<User>) => {
    const { age = 0, login = "", password = "" } = req.body;
    const user: User = {
        id: uuidv4(),
        login,
        password,
        age,
        isDeleted: false,
    };
    USER_COLLECTION[user.id] = user;
    res.status(201).json(user);
});

router.delete("/user/:id", (req: express.Request, res: express.Response<{ message: string }>) => {
    const { id } = req.params;
    USER_COLLECTION[id] = {
        ...USER_COLLECTION[id],
        isDeleted: true,
    };
    res.status(200).send({
        message: `User with id ${id} was deleted.`
    });
});

app.use("/", router);

app.listen(SERVER_PORT, function () {
    console.log("User REST API app listening on port 3000!");
});
