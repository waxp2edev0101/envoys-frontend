import mqtt from 'mqtt';
import Vue from 'vue';

/**
 * @param app
 * @param inject
 * @returns {boolean}
 */
export default ({ app }, inject) => {
  let event = new Vue();

  /**
   * @type {{bind(*, *): boolean, subscribe(*, *, *): void, unsubscribe(*): void, unbind(*): void, client: MqttClient, connect: boolean}}
   */
  app.$publish = {
    client: mqtt.connect(process.env.BASE_BROKER || 'ws://localhost:15675/ws', {
      clean: true
    }),
    connect: true,

    /**
     * @param topic
     * @param channels
     * @param error
     */
    subscribe(topic, channels, error) {

      // Connect broker client.
      if (this.connect) {
        this.client.on('connect', () => {
          this.connect = false;
        });
        console.log("Connect to a trading broker.");
      }

      // Subscribe to topic.
      this.client.subscribe(topic, {qos: 2}, (err) => {
        if (err) {
          error(`Error on topic subscribe: ${err}`);
        }
        console.log("Subscribe topic:", topic);
      });

      // Message broker client.
      this.client.on("message", (t, m, packet) => {
        if (!packet.qos || !m.byteLength) {
          return;
        }
        if (topic === t) {
          let bytea = JSON.parse(m.toString());
          channels.map((channel) => {
            if (channel === bytea.channel) {
              event.$emit(channel, JSON.parse(bytea.data));
            }
          });
        }
      });
    },

    /**
     * @param topic
     */
    unsubscribe(topic) {
      this.client.unsubscribe(topic, {qos: 2}, (err) => {
        if (err) {
          console.log(err);
        }
        this.client.removeAllListeners("message");
      });
      console.log("Unsubscribe topic:", topic);
    },

    /**
     * @param channels
     */
    unbind(channels) {
      channels.map((channel) => {
        event.$off(channel);
      });
    },

    /**
     * @param channel
     * @param callback
     * @returns {boolean}
     */
    bind(channel, callback) {
      if (typeof callback !== "function") {
        return false
      }
      event.$on(channel, callback);
    }
  };
  app.$publish.client.setMaxListeners(50);
  inject('publish', app.$publish);
};