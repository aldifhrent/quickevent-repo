import { NextFunction, Request, response, Response } from "express";
import transactionServices from "@/services/transaction.services";

class transactionsController {
  async createTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionServices.createTransaction(req, res);
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionServices.getAllTransactions(req, res);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionServices.getTransactionStatus(req, res);
    } catch (error) {
      next(error);
    }
  }
  // async updateTransactionStatus(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     await transactionServices.updateTransactionStatus(req, res);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getTransactionByORG(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionServices.getTransactionsByOrganizer(req, res);
    } catch (error) {
      next(error);
    }
  }

  async verifyTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionServices.verifyTransaction(req, res)
    } catch (error) {
      next(error);
    }
  }

}

export default transactionsController;
