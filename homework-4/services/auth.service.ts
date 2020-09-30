import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { resultCode, ResultCode, ResultCodeValues } from "../types/results";
import { User } from "../types/user";

const JWT_LIFETIME = 120;
const JWT_OPTIONS: SignOptions = {expiresIn: JWT_LIFETIME};
const SECRET: Secret = "512287FB08B6E5300883A78FBE4EA44DD019A5C52291B3012E3294BF05A3A6DA";

const userService = new UserService();

export class AppAuthService {
    public async getToken(username: string, password: string): Promise<string | null> {
        const user: User | null = await userService.getOneByNameAndPass(username, password);
        if (user === null) {
            return null;
        }

        const payload = {username, id: user.id};
        const token = jwt.sign(payload, SECRET, JWT_OPTIONS);
        return token;
    }

    // returns true if token is correct and false otherwise
    public checkToken(token: string): ResultCode {
        if (!token) {
            return resultCode(ResultCodeValues.CODE_NOT_FOUND);
        }
        let res: ResultCode = resultCode(ResultCodeValues.CODE_VALIDATION_ERROR);
        jwt.verify(token, SECRET, (err, decoded) => {
            res = err 
            ? resultCode(ResultCodeValues.CODE_VALIDATION_ERROR) 
            : resultCode(ResultCodeValues.CODE_OK);
        });
        return res;
    }
}