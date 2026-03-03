import { Request, Response } from 'express'



export const prueba = (req: Request, res: Response) => {
    res.send("Ya prendió tú");
}