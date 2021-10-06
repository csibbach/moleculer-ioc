# moleculer-ioc
Inversion of Control support for the Moleculer framework.

This package publishes a new IOCService class that extends the base Service class from Moleculer. IOCService creates an InversifyJS container, and registers the ServiceBroker instance into it. It requires an abstract method "modules" be implemented, which will return an array of Inversify ContainerModules. These are also loaded into the container. At the moment, in order to use the configured modules, your actions and methods will need to directly get what they need from the container:

```
const interestingService = this.container.get<IMyInterestingBusinessLayerService>(IMyInterestingBusinessLayerServiceType);

return await interstingService.interestingThing();
```
