import eventServices from "@/services/event.services";
import { NextFunction, Request, Response } from "express";

class eventController {
  async getAllEventsByOrganizer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await eventServices.getAllEventsByORG(req, res, next);
    } catch (error) {
      next(error);
    }
  }
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      await eventServices.getEvents(req, res, next);
    } catch (error) {
      next(error);
    }
  }
  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventServices.getEvent(req, res, next);
    } catch (error) {
      next(error);
    }
  }
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventServices.createEvent(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async getEventAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      await eventServices.getEventAnalytics(req, res, next)
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async editEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventServices.editEvent(req, res, next)
    } catch (error) {
      next(error);
    }
  }
}

export default eventController;
