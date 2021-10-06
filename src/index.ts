import { Container, ContainerModule } from "inversify";
import { Service, ServiceBroker } from "moleculer";

export abstract class IOCService extends Service {
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
}

export const ServiceBrokerType = Symbol.for("ServiceBroker");
