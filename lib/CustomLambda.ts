import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

interface CustomLambdaProps {
  id: string;
  variables?: Record<string, string>;
  runtime?: lambda.Runtime;
  timeout?: number;
  eventBusArn?: string;
}

export class CustomLambda extends Construct {
  public lambda: lambda.Function;

  public eventBus?: events.IEventBus;

  constructor(scope: Construct, private props: CustomLambdaProps) {
    super(scope, `${props.id}Lambda`);

    this.eventBus = this.getEventBus();

    this.lambda = this.createLambda();

    this.addEnvironmentVariables(this.props.variables);
    this.grantAccessToEventBus();
  }

  private getEventBus() {
    if (!this.props.eventBusArn) return undefined;

    return events.EventBus.fromEventBusArn(
      this,
      "EventBus",
      this.props.eventBusArn
    );
  }

  private createLambda() {
    return new lambda.Function(this, "Lambda", {
      functionName: `${this.props.id}Lambda`,
      runtime: this.props.runtime || lambda.Runtime.NODEJS_20_X,
      handler: `dist/handlers/index.lambdaHandler`,
      code: lambda.Code.fromInline(
        "exports.handler = function(event, context) { console.log(event); return event; }"
      ),
      timeout: cdk.Duration.seconds(this.props.timeout || 15),
      retryAttempts: 0,
    });
  }

  private addEnvironmentVariables(env?: Record<string, string>) {
    if (!env) return;

    Object.entries(env).forEach(([key, value]) => {
      this.lambda.addEnvironment(key, value);
    });
  }

  private grantAccessToEventBus() {
    if (!this.eventBus) return;

    this.addEnvironmentVariables({ EVENT_BUS: this.eventBus.eventBusName });
    this.eventBus.grantPutEventsTo(this.lambda);
  }

  public grantInvokeTo(deps: Record<string, string>) {
    Object.keys(deps).forEach((key) => {
      const externalFunction = lambda.Function.fromFunctionAttributes(
        this,
        `${key}Lambda`,
        {
          functionArn: deps[key],
          sameEnvironment: true,
        }
      );
      externalFunction.grantInvoke(this.lambda);
      this.addEnvironmentVariables({
        [`${key.toUpperCase()}_LAMBDA`]: externalFunction.functionName,
      });
    });
  }
}
