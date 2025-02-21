import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { validateSignUp } from "../middlewares/validate";
import { verifyAuth, verifyRefreshToken } from "@/middlewares/auth.middleware";
import transactionsController from "@/controllers/transactions.controller";
import { uploader } from "@/helpers/multer";

export class transactionRouter {
  private router: Router;
  private transactions: transactionsController;

  constructor() {
    this.transactions = new transactionsController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/pay", verifyAuth, uploader().single("paymentProof"), this.transactions.createTransactions);
    this.router.get("/", verifyAuth, this.transactions.getAllTransactions);
    this.router.get('/org/:id', this.transactions.getTransactionByORG)
    this.router.get("/:id", verifyAuth, this.transactions.getTransactionById);;
  }

  getRouter(): Router {
    return this.router;
  }
}
