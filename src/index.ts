import { Container, ContainerModule } from "inversify";
import {
  LoggerInstance,
  Service,
  ServiceBroker,
  ServiceSchema,
  ServiceSettingSchema,
} from "moleculer";

export abstract class IOCService<S = ServiceSettingSchema> extends Service<S> {
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

  protected parseServiceSchema(schema: ServiceSchema<S>): void {
    // Hook into the created lifecycle event
    this.logger.debug("Merging schemas");
    const mergedSchema = Service.mergeSchemas(
      {
        created: () => {
          this.logger.debug("Binding logger");
          this.container
            .bind<LoggerInstance>(LoggerType)
            .toConstantValue(this.logger);
        },
      } as ServiceSchema<S>,
      schema
    );

    this.logger.debug(mergedSchema);

    super.parseServiceSchema(mergedSchema as ServiceSchema<S>);
  }
}

export const ServiceBrokerType = Symbol.for("ServiceBroker");
export const LoggerType = Symbol.for("Logger");
