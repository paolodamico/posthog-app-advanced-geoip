import { Plugin } from '@posthog/plugin-scaffold'
export interface AppInterface {
    config: {
        discardIp: 'true' | 'false'
    }
}

const GEO_IP_PLUGIN = /^GeoIP \(\d+\)$/

const plugin: Plugin<AppInterface> = {
    processEvent: async (event, { config }) => {
        if (config.discardIp === 'true') {
            if (
                Array.isArray(event.properties?.$plugins_succeeded) &&
                event.properties?.$plugins_succeeded.find((val: string) => val.toString().match(GEO_IP_PLUGIN))
            ) {
                event.properties.$ip = undefined
                event.ip = null
                console.info(`IP discarded for event ${event.uuid || event.event}.`)
            } else {
                console.error(
                    `Could not discard IP for event ${event.uuid || event.event} as GeoIP has not been processed.`
                )
            }
        }

        return event
    },
}

module.exports = plugin
