import { Request, Response } from "express";
import { DriverException, LockMode } from "@mikro-orm/core";
import { Project } from "@hangar/database";
import { Schema } from "@hangar/shared";
import { logger } from "../../../utils/logger";
import { validatePayload } from "../../../utils/validatePayload";

export const put = async (req: Request, res: Response) => {
    const {entityManager, params: {id}} = req;
    return void
}