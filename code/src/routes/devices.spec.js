import 'mocha'
// import * as td from 'testdouble'
import { context } from '../../test/mock-utility' /*, expectMiddlewareFunctionThrow */
import { devicesGet } from './devices'
import { expect } from 'chai'

describe('Routes for devices', () => {
  describe('GET', () => {
    it.skip('should return all devices in the database', async () => {
      await devicesGet(context)

      expect(context.body).to.deep.equal({
        'Controllers existing in the database': [
          {
            'serial number': 'HL001_17386_000001729708'
          },
          {
            'serial number': 'HL001_17386_000001729711'
          }
        ]
      })
    })
  })
})
