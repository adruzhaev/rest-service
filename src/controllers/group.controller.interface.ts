import { Request, Response, NextFunction } from 'express';

export interface IGroupController {
    getAllGroups: (req: Request, res: Response, next: NextFunction) => void;
    getOneGroup: (req: Request, res: Response, next: NextFunction) => void;
    createGroup: (req: Request, res: Response, next: NextFunction) => void;
    updateGroup: (req: Request, res: Response, next: NextFunction) => void;
    deleteGroup: (req: Request, res: Response, next: NextFunction) => void;
}
