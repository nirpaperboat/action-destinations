import type { BrowserActionDefinition } from '../../../lib/browser-destinations'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import type { Screeb } from '../types'

const action: BrowserActionDefinition<Settings, Screeb, Payload> = {
  title: 'Track',
  description: 'Track event to potentially filter user studies (microsurveys) later, or trigger a study now.',
  platform: 'web',
  defaultSubscription: 'type = "track" and event != "Signed Out"',
  fields: {
    name: {
      description: "The event name that will be shown on Screeb's dashboard",
      label: 'Event name',
      required: true,
      type: 'string',
      default: {
        '@path': '$.event'
      }
    },
    properties: {
      type: 'object',
      required: false,
      description: 'Object containing the properties of the event',
      label: 'Event Properties',
      default: {
        '@path': '$.properties'
      }
    }
  },
  perform: (Screeb, event) => {
    const payload = event.payload
    if (!payload || typeof payload !== 'object' || !payload.name) {
      console.warn('[Screeb] received invalid payload (expected name to be present); skipping track', payload)
      return
    }

    Screeb('event.track', payload.name, payload.properties)
  }
}

export default action
