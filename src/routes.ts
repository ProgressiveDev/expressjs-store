import { Router } from 'express';
import { Request, Response } from "express";
import { ItemsController } from './itemsController';
import { ConfigController } from "./ConfigController";

export const routes = Router();

// Get single item by ID
routes.get('/:server/items/:id', ItemsController.getSingleItem);

// Get all items
routes.get("/:server/items", ItemsController.getAllItems);

routes.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Hello")
});

// Get server config
routes.get("/config", ConfigController.getConfig);

// Let update config
routes.post("/config", ConfigController.updateConfig);

// Get specified items quantity by id
routes.get("/:server/items/:id/quantity", ItemsController.getItemQuantity);

// Calculate price for specified item by ID
routes.post("/:server/items/:id/calculate-price", ItemsController.calculatePrice);