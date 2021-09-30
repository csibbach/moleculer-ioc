import { Service, ServiceBroker } from "moleculer";

export class IOCService extends Service {
    public constructor(public broker: ServiceBroker) {
		super(broker);
    }
}
