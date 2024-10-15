#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TranscribeCdkStack } from "../lib/TranscribeCdkStack";

const app = new cdk.App();
new TranscribeCdkStack(app, "TranscribeCdkStack", {
  stackName: "TranscribeCdkStack",
});
