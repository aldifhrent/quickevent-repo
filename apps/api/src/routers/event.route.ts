import { Router } from "express";
import { verifyAuth } from "@/middlewares/auth.middleware";
import eventController from "@/controllers/event.controller";
import { uploader } from "@/helpers/multer";

export class eventRouter {
  private router: Router;
  private event: eventController;

  constructor() {
    this.event = new eventController();
    this.router = Router();
    this.initializeRoutes();
  }

  // Create Organizer, Get Organization by id
  private initializeRoutes(): void {
    this.router.get("/", this.event.getAllEvents);
    this.router.get('/analytics', verifyAuth, this.event.getEventAnalytics)
    this.router.get("/byorg", verifyAuth, this.event.getAllEventsByOrganizer);
    this.router.post("/", uploader().single("imageUrl"), verifyAuth, this.event.createEvent);
    this.router.get("/:id", this.event.getEvent);
    this.router.patch(":/id", verifyAuth, this.event.editEvent)

  }

  getRouter(): Router {
    return this.router;
  }
}
