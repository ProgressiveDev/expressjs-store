import csv from 'csvtojson';
import { Request, Response } from 'express';
import { Item } from './item';
import { resolve } from 'path';
const csvFilePath = resolve(__dirname, '../store.csv');
import {serverStatus} from "./ConfigController";
import {config} from "./ConfigController";

const toItem = (line: any) => {
  return {
    description: line.description,
    expectedDeliveryDate: line.expected_delivery_date,
    id: line.id,
    image: line.image,
    seller: line.seller,
    sellerImage: line.seller_image,
    title: line.title
  }
}

export class ItemsController {
  static getSingleItem(req: Request, res: Response) {
    const id: string = (req.params as any).id;
    
    csv()
      .fromFile(csvFilePath)
      .then((lines: Item[]) => {
        const line = lines.find(line => line.id.toString() === id)
        if (line !== undefined) {
          res.send(toItem(line));
        } else {
          res.status(404).send('Could not find the id you requested');
        }
      }, (e: Error) => {
        res.status(500).send(`Sorry - was unable to open csv database: ${e.message}`);
      });

  }

  static getItemQuantity(req: Request, res: Response) {
    const id: string = (req.params as any).id;

    csv()
      .fromFile(csvFilePath)
      .then((lines: Item[]) => {
        const line = lines.find(line => line.id.toString() === id)
        if (line !== undefined) {
          res.json(Number(line.quantity));
        } else if (req.query.quantity === undefined) {
          res.status(404).send('Could not find the id you requested');
        } else {
          res.status(404).send('Could not find the id you requested');
        }
      }, (e: Error) => {
        res.status(500).send(`Sorry - was unable to open csv database: ${e.message}`);
      });
  }

  static calculatePrice(req: Request, res: Response) {
    const id: string = (req.params as any).id;
    const { quantity } = req.body;
    if (quantity === undefined) {
      res.status(400).send("Quantity is missing");
      return;
    }
    csv()
      .fromFile(csvFilePath)
      .then((lines: Item[]) => {
        const line = lines.find(line => line.id.toString() === id)
        if (line !== undefined) {
          if (quantity <= line.quantity) {
            if (line.sale !== undefined && line.sale !== "") {
              res.status(200).send(`${(quantity - Math.ceil(Number(quantity / Number(line.sale[0]))) + 1) * line.price} EUR`);
            } else {
              res.status(200).send(`${quantity * line.price} EUR`);
            }
            return;
          } else {
            res.status(400).send("Your specified quantity is higher than avaliable")
          }
          return;
        } else {
          res.status(404).send('Could not find the id you requested');
        }
      }, (e: Error) => {
        res.status(500).send(`Sorry - was unable to open csv database: ${e.message}`);
      });
  }

  static getAllItems(req: Request, res: Response) {

    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 25;

    const server = (req.params as any).server;

    if (serverStatus(config, server) === 500) {
      res.status(500).send("server error");
    } else {

    csv()
      .fromFile(csvFilePath)
      .then(
        (lines: Item[]) => res.status(200).send(
          {
            page: page,
            totalPages: Math.ceil(lines.length / size),
            totalItems: [...lines].length,
            items: lines.map(toItem).slice(page * size, page * size + size)
          }
        )
      )
    }
  }
}