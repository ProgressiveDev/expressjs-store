import { Request, Response } from "express";
import { ConfigSpec } from "./ServerConfig";

export let config = {
    servers: [
        {
            name: "alpha",
            errorFrequency: 0
        }
    ]
}

let counter = 1;
function updateCounter() {
  counter = 1;
}

export const serverStatus = (config: ConfigSpec, req: string): any => {
    if (req === config.servers[0].name) {
      if (counter <= config.servers[0].errorFrequency) {
        if (counter === 10) {
          counter = 1;
        } else {
          counter++;
        }
        return 500;
      } else {
        if (counter === 10) {
          counter = 1;
        } else {
          counter++;
        }
        return 200;
      }
    } else {
      return 500;
    }
}

export class ConfigController {

    static getConfig(_req: Request, res: Response) {
        res.status(200).send(ConfigController.sendConfig());
    }

    static sendConfig = () => {
        return config;
    }

    static validate(obj1: any): boolean {
        let objBody = Object.keys(obj1);

        if (objBody.length < 1 || obj1.servers.length <= 0) {
            return true;
        }

        if (obj1.servers[0].name === null || obj1.servers[0].name === '') {
            return true;
        }

        if (typeof obj1.servers[0].name !== 'string' || typeof obj1.servers[0].errorFrequency !== 'number') {
            return true;
        }

        if (parseInt(obj1.servers[0].errorFrequency) < 0 || parseInt(obj1.servers[0].errorFrequency) > 10) {
            return true;
        }

        return false;
    }

    static updateConfig(req: Request, res: Response) {
        const request = req.body as ConfigSpec;
        if (ConfigController.validate(request)) {
            res.status(400).send('Invalid config');
            updateCounter();
            return;
        }

        config = request;
        res.status(200).send(request);
        updateCounter();
    }
}
