import { v1 } from 'uuid';

function UTCNow(): Date {
    const date = new Date();
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
}

export class DeviceInfo {
    appNamespace: string; // "com.microsoft.bing", "com.microsoft.test", null
    appVersion: string; // "3.0.0", "3.0.0", "3.0.0", "1.0.0", "1.1.0", "1.0.0-beta", "3.1.9-alpha"
    appBuild: string; // "1", "2", "3"
    carrierCountry: string; // "US", "US", "US", "CA", "FR", "FR", "KP", "CN"
    carrierName: string; // "AT&T", "Verizon", "Verizon", "Cricket"
    locale: string;
    model: string; // "PC", "X10", "iPhone1,1", "iPod5,1", "iPad4,5"
    oemName: string; // "Dell", "Samsung", "Lenovo"
    osApiLevel: string; // 1, 3
    osName: string; // "Android", "Android", "Android", "Android", "iOS", "iOS", "iOS"
    osVersion: string; // "8.0.0", "8.1.0", "10.0.0"
    osBuild: string; // "", "1", "2"
    screenSize: string; // "1024x768", "1024x768", "1024x768", "320x240", "860x640"
    timeZoneOffset: number; // -4, 4
    sdkName: string; // "appcenter.node"
    sdkVersion: string; // "0.0.1";
}

export class SessionLogs {
    logs: any;
}

export class StartServiceLog {
    type: string = "startService";
    timestamp: string = UTCNow().toJSON();
    device: DeviceInfo;
    services: string[] = ["analytics"];
}

export class StartSessionLog {
    type: string = "startSession";
    sid: string;
    timestamp: string = UTCNow().toJSON();
    device: DeviceInfo;
    services: string[] = ["analytics"];
}

export class EventLog {
    type: string = "event";
    sid: string;
    id: string;
    name: string;
    timestamp: string = UTCNow().toJSON();
    properties: any;
    device: DeviceInfo;
}

export class AppCenterClient {
    ingestionUrl: string = "https://in.appcenter.ms/logs?Api-version=1.0.0";
    appSecret: string;
    installId: string;
    device: DeviceInfo;
    sessionId: string;
    queue: any[];
    processor: any;

    constructor(appSecret: string, installId: string, deviceInfo: DeviceInfo) {
        this.appSecret = appSecret;
        this.installId = installId;
        this.device = deviceInfo;
        this.sessionId = v1();
        this.queue = [];
    }

    public async startService() {
        let serviceLog = new StartSessionLog();
        serviceLog.device = this.device;
        this.queue.push(serviceLog);

        this.processor = setInterval(() => {
            this.flush();
        }, 5000);
    }

    public startSession() {
        let eventLog = new StartSessionLog();
        eventLog.device = this.device;
        eventLog.sid = this.sessionId;
        this.queue.push(eventLog);
    }

    public trackEvent(name: string, fieldId: string, properties: any) {
        let eventLog = new EventLog();
        eventLog.name = name;
        eventLog.id = fieldId;
        eventLog.device = this.device;
        eventLog.sid = this.sessionId;
        eventLog.properties = properties;
        this.queue.push(eventLog);
    }

    public stopService() {
        clearInterval(this.processor);
    }

    public async flushEvent(event: StartServiceLog | StartSessionLog | EventLog) {
        const logs: SessionLogs = {
            logs: [event]
        };
        await this.sendRequest(JSON.stringify(logs), 1);
    }

    public async flush() {
        let records: any[] = [];
        while (this.queue.length) records.push(this.queue.splice(0, 1)[0]);
        if (records.length > 0) {
            const logs: SessionLogs = {
                logs: records
            };
            await this.sendRequest(JSON.stringify(logs), records.length);
        }
    }

    async sendRequest(body: string, logCount: number) {
        const correlationId = v1();

        try {
            console.log(body);
            const response = await fetch(this.ingestionUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'App-Secret': this.appSecret,
                    'Install-ID': this.installId,
                    'LogCount': logCount.toString(),
                    'X-Correlation-ID': correlationId
                },
                body: body
            });
            console.dir(response);
        } catch (exception) {
            console.log('send log error:');
            console.dir(exception);
        }
    }
}