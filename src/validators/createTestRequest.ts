import { IsDefined } from "class-validator";

export class CreateTestRequest {
  @IsDefined()
  testName!: string;
}