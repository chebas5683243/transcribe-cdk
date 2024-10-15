import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { CustomLambda } from "./CustomLambda";
import { CustomBucket } from "./CustomBucket";

export class TranscribeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createTranscribeLambda();
    this.createTranscribeBucket();
  }

  private createTranscribeLambda() {
    return new CustomLambda(this, {
      id: "Transcribe",
      variables: {
        TEST_ENV: "test",
      },
    });
  }

  private createTranscribeBucket() {
    return new CustomBucket(this, {
      id: "Transcribe",
    });
  }
}
