import { Request, Response } from 'express';
import { endRequest } from '../utils/endRequest';

export default (opts: {
  hasRole: Array<'ADMIN' | 'RECRUITER' | 'INTERVIEWER' | 'EMPLOYEE' | 'CANDIDATE'>;
  allowSameEmployee?: boolean;
}) => {
  return (req: Request, res: Response, next: Function) => {
    const { uid, role } = req['context'];
    const { id } = req.params;

    if (opts.allowSameEmployee && id && uid === id) return next();

    if (!role) return endRequest(403, 'Forbidden', res);

    if (opts.hasRole.includes(role)) return next();

    return endRequest(403, 'Forbidden', res);
  };
};
