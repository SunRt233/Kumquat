class Channel {
    constructor(id, ws, options = {}) {
        this.id = id;
        this.ws = ws;
        this.listeners = {};
        this.readyState = WebSocket.CLOSED;
        this.binaryType = 'arraybuffer';
        this.priority = options.priority || 1; // 默认优先级为1
        this.maxBandwidth = options.maxBandwidth || 1024; // 默认最大带宽为1024字节/秒
        this.tokenBucket = this.maxBandwidth; // 初始令牌数量等于最大带宽
        this.lastTokenRefill = Date.now(); // 上次填充令牌的时间
        this.lastTimestamp = null; // 上次发送数据的时间戳
        this.sentBytes = 0; // 已发送的字节数

        // 设置事件监听器
        this.setupListeners();
    }

    setupListeners() {
        this.ws.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            if (data.channel === this.id) {
                switch (data.type) {
                    case 'open':
                        this.readyState = WebSocket.OPEN;
                        if (this.listeners.open) {
                            this.listeners.open.call(this);
                        }
                        break;
                    case 'message':
                        if (this.listeners.message) {
                            this.listeners.message.call(this, { data: data.data });
                        }
                        break;
                    case 'error':
                        if (this.listeners.error) {
                            this.listeners.error.call(this, { message: data.message });
                        }
                        break;
                    case 'close':
                        this.readyState = WebSocket.CLOSING;
                        if (this.listeners.close) {
                            this.listeners.close.call(this);
                        }
                        break;
                }
            }
        });
    }

    send(data) {
        if (this.readyState !== WebSocket.OPEN) return;

        // 检查令牌桶是否有足够的令牌
        const now = Date.now();
        const elapsed = now - this.lastTokenRefill;
        this.tokenBucket += elapsed * (this.maxBandwidth / 1000); // 每秒填充maxBandwidth字节
        this.tokenBucket = Math.min(this.tokenBucket, this.maxBandwidth); // 不超过最大值
        this.lastTokenRefill = now;

        if (this.tokenBucket < data.byteLength) {
            // 等待直到有足够的令牌
            const waitTime = (data.byteLength - this.tokenBucket) * 1000 / this.maxBandwidth;
            setTimeout(() => this.send(data), waitTime);
            return;
        }

        this.tokenBucket -= data.byteLength;
        this.sentBytes += data.byteLength;
        this.lastTimestamp = now;

        this.ws.send(JSON.stringify({
            channel: this.id,
            type: 'data',
            data: data,
            priority: this.priority,
            timestamp: now
        }));
    }

    close() {
        if (this.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ channel: this.id, type: 'close' }));
            delete this.ws.channels[this.id];
        }
    }
}

class MultiChannelWebSocket extends EventTarget {
    constructor(url) {
        super();
        this.url = url;
        this.ws = new WebSocket(url);
        this.channels = {};
        this.ws.binaryType = 'arraybuffer';

        // 设置WebSocket的事件监听器
        this.ws.addEventListener('open', () => {
            this.dispatchEvent(new Event('open'));
        });
        this.ws.addEventListener('error', event => {
            this.dispatchEvent(new Event('error', { detail: event }));
        });
        this.ws.addEventListener('close', event => {
            this.dispatchEvent(new Event('close', { detail: event }));
        });
    }

    createChannel(id, options) {
        if (!this.channels[id]) {
            this.channels[id] = new Channel(id, this, options);
            this.ws.send(JSON.stringify({ channel: id, type: 'subscribe' }));
            return this.channels[id];
        }
        throw new Error(`Channel with ID ${id} already exists.`);
    }

    removeChannel(id) {
        const channel = this.channels[id];
        if (channel) {
            channel.close();
            delete this.channels[id];
        }
    }
}