import { JwtPayloadType } from './jwt-payload.type';

export type RefreshPayloadType = JwtPayloadType & { refreshToken: string };
