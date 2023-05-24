import { Container, ContainerModule } from "inversify";
import {
  LoggerInstance,
  Service,
  ServiceBroker,
  ServiceSchema,
  ServiceSettingSchema,
} from "moleculer";

export abstract class IOCService extends Service<ServiceSettingSchema> {
  protected container: Container;

  public constructor(public broker: ServiceBroker) {
    super(broker);

    // Create the container for the service
    this.container = new Container();

    // Bind the service broker
    this.container
      .bind<ServiceBroker>(ServiceBrokerType)
      .toConstantValue(this.broker);

    // Load the defined modules
    this.container.load(...this.modules());
  }

  public abstract modules(): ContainerModule[];

  protected parseServiceSchema(
    schema: ServiceSchema<ServiceSettingSchema>
  ): void {
    // Hook into the created lifecycle event
    const mergedSchema = this.mergeSchemas(
      {
        created: () => {
          this.container
            .bind<LoggerInstance>(LoggerType)
            .toConstantValue(this.logger);
        },
      },
      schema
    );

    super.parseServiceSchema(
      mergedSchema as ServiceSchema<ServiceSettingSchema>
    );
  }
}

export const ServiceBrokerType = Symbol.for("ServiceBroker");
export const LoggerType = Symbol.for("Logger");
