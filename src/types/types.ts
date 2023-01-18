import { JwtPayload } from "jsonwebtoken";
import { EStatus } from "../constant/const";

export interface RequestWithUserRole extends Request
{
    id?: string | JwtPayload | undefined,
    headers: HeaderWithAuthorization
}

interface HeaderWithAuthorization extends Headers
{
    authorization?: JwtPayload
}

export type TApiResponse = {
    status: EStatus,
    data: any,
    message: string
}