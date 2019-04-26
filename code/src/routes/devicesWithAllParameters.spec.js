import 'mocha'
// import * as td from 'testdouble'
import { context } from '../../test/mock-utility' /*, expectMiddlewareFunctionThrow */
import { devicesGet, devicesPost, deviceDelete } from './devicesWithAllParameters'
import { expect } from 'chai'

describe('Routes for devices with all parameters(connectivity, probes)', () => {
  describe('GET', () => {
    it('returns all devices with their parameters in the database', async () => {
      await devicesGet(context)

      expect(context.body).to.deep.equal({
        'Controllers with all parameters existing in the database': [
          {
            'serial number': 'HL001_17386_000001729708',
            'connectivity': 'lan',
            'probe 1': 'LDO 2 sc',
            'probe 2': 'Nitratax sc'
          },
          {
            'serial number': 'HL001_17386_000001729711',
            'connectivity': 'modem',
            'probe 1': 'Amtax sc',
            'probe 2': 'pHD sc'
          }
        ]
      })
    })
  })
  describe('POST', () => {
    it.skip('should post a new device', async () => {
      context.request.body.serialNumber = 'HL001_17386_000001729711'
      context.request.body.connectivity = 'modem'
      context.request.body.probe1 = 'Amtax sc'
      context.request.body.probe2 = 'pHD sc'

      await devicesPost(context)
      expect(context.body).to.deep.equal({
        'serial Number': 'HL001_17386_000001729711',
        'connectivity': 'modem',
        'probe 1': 'Amtax sc',
        'probe 2': 'pHD sc'
      })
    })
  })
  describe('DELETE', () => {
    it.skip('should delete a device', async () => {
      context.params.id = 3

      await deviceDelete(context)
      expect(context.body).to.deep.equal({
        'Device id deleted': 3
      })
    })
  })
})
