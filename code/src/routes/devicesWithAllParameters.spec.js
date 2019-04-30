import 'mocha'
import * as td from 'testdouble'
import { context, expectMiddlewareFunctionThrow } from '../../test/mock-utility'
import { expect } from 'chai'

describe('Routes for devices with all parameters(connectivity, probes)', () => {
  /** The module under test (SUT) */
  let sut
  /** the require done by the SUT that wil be mock */
  let mock

  beforeEach(() => {
    mock = td.replace('../controllers/databaseRequest')
    sut = require('./devicesWithAllParameters')
  })

  afterEach(() => {
    td.reset()
  })

  describe('GET', () => {
    it('returns valid json devices with their parameters in the database', async () => {
      // act
      const expected = '{"devices":[{"serial number":"HL001_17386_000001729709","connectivity":"lan","probe 1":"Amtax sc","probe 2":"pHD sc"}]}'
      const actual = [{ 'serial number': 'HL001_17386_000001729709', 'connectivity': 'lan', 'probe 1': 'Amtax sc', 'probe 2': 'pHD sc' }]
      td.when(mock.getDevicesWithAllParameters()).thenResolve(actual)

      // arrange
      await sut.devicesGet(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal(expected)
    })

    it('returns valid json devices with their parameters in the database', async () => {
      // act
      const expected = '{"devices":[]}'
      const actual = []
      td.when(mock.getDevicesWithAllParameters()).thenResolve(actual)

      // arrange
      await sut.devicesGet(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal(expected)
    })
  })

  describe('POST', () => {
    it('should post a new device', async () => {
      // act
      context.request.body.serialNumber = 'HL001_17386_000001729711'
      context.request.body.connectivity = 'modem'
      context.request.body.probe1 = 'Amtax sc'
      context.request.body.probe2 = 'pHD sc'

      // arrange
      await sut.devicesPost(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal({
        'serial Number': 'HL001_17386_000001729711',
        'connectivity': 'modem',
        'probe 1': 'Amtax sc',
        'probe 2': 'pHD sc'
      })
    })

    it('should throw posting a new device when serial number is empty', async () => {
      // act
      // wrong serialNumber parameters to send to the post of device
      context.request.body.serialNumber = ''
      context.request.body.connectivity = 'modem'
      context.request.body.probe1 = 'Amtax sc'
      context.request.body.probe2 = 'pHD sc'

      // arrange
      td.when(mock.insertDevice(td.matchers.argThat((ctx) => {
        return (ctx.request.body.serialNumber === '' &&
          ctx.request.body.connectivity === 'modem' &&
          ctx.request.body.probe1 === 'Amtax sc' &&
          ctx.request.body.probe2 === 'pHD sc')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Serial Number is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.devicesPost, 400, 'Serial Number is empty')
    })

    it('should throw posting a new device when connectivity is empty', async () => {
      // act
      // wrong serialNumber parameters to send to the post of device
      context.request.body.serialNumber = 'HL001_17386_000001729711'
      context.request.body.connectivity = ''
      context.request.body.probe1 = 'Amtax sc'
      context.request.body.probe2 = 'pHD sc'

      // arrange
      td.when(mock.insertDevice(td.matchers.argThat((ctx) => {
        return (ctx.request.body.serialNumber === 'HL001_17386_000001729711' &&
          ctx.request.body.connectivity === '' &&
          ctx.request.body.probe1 === 'Amtax sc' &&
          ctx.request.body.probe2 === 'pHD sc')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'serial Number is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.devicesPost, 400, 'Connectivity is empty')
    })

    it('should throw posting a new device when first probe is empty', async () => {
      // act
      // wrong serialNumber parameters to send to the post of device
      context.request.body.serialNumber = 'HL001_17386_000001729711'
      context.request.body.connectivity = 'modem'
      context.request.body.probe1 = ''
      context.request.body.probe2 = 'pHD sc'

      // arrange
      td.when(mock.insertDevice(td.matchers.argThat((ctx) => {
        return (ctx.request.body.serialNumber === 'HL001_17386_000001729711' &&
          ctx.request.body.connectivity === 'mdoem' &&
          ctx.request.body.probe1 === '' &&
          ctx.request.body.probe2 === 'pHD sc')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'First probe is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.devicesPost, 400, 'First probe is empty')
    })

    it('should throw posting a new device when second probe is empty', async () => {
      // act
      // wrong serialNumber parameters to send to the post of device
      context.request.body.serialNumber = 'HL001_17386_000001729711'
      context.request.body.connectivity = 'modem'
      context.request.body.probe1 = 'Amtax sc'
      context.request.body.probe2 = ''

      // arrange
      td.when(mock.insertDevice(td.matchers.argThat((ctx) => {
        return (ctx.request.body.serialNumber === 'HL001_17386_000001729711' &&
          ctx.request.body.connectivity === 'modem' &&
          ctx.request.body.probe1 === 'Amtax sc' &&
          ctx.request.body.probe2 === '')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Second probe is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.devicesPost, 400, 'Second probe is empty')
    })
  })

  describe('DELETE', () => {
    it('should delete a device', async () => {
      // act
      context.params.id = 3

      // arrange
      await sut.deviceDelete(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal({
        'id': 3
      })
    })
  })
})
