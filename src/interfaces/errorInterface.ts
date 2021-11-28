import { ValidationError } from "express-validation";

interface ErrorValidation extends ValidationError {
  code: number | string;
}

export default ErrorValidation;
