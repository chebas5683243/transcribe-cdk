import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

interface CustomBucketProps {
  id: string;
}

export class CustomBucket extends Construct {
  public bucket: s3.Bucket;

  constructor(scope: Construct, public props: CustomBucketProps) {
    super(scope, `${props.id}Bucket`);

    this.bucket = this.createBucket();
  }

  private createBucket() {
    return new s3.Bucket(this, "Bucket", {
      bucketName: `${this.props.id}Bucket`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}
