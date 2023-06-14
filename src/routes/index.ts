import { Request, Response, Router } from "express";

const routes = Router()

routes.get('/', (_: Request, res: Response) => {
    res.send({ status: "Server up and running" })
})

export default routes;