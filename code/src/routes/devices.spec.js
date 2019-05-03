import 'mocha'
import * as td from 'testdouble'
import { context } from '../../test/mock-utility'
import { expect } from 'chai'

describe('Routes for devices', () => {
  /** The module under test (SUT) */
  let sut
  /** the require done by the SUT that wil be mock */
  let mock

  beforeEach(() => {
    mock = td.replace('../controllers/databaseRequest')
    sut = require('./devices')
  })

  afterEach(() => {
    td.reset()
  })

  describe('GET', () => {
    it('returns valid json devices', async () => {
      // act
      const actual = [{ 'serial number': 'HL001_17386_000001729709' }]
      const expected = '{"devices":[{"serial number":"HL001_17386_000001729709"}]}'
      td.when(mock.getDevices()).thenResolve(actual)

      // arrange
      await sut.devicesGet(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal(expected)
    })

    it('returns valid json devices when database is empty', async () => {
      // act
      const expected = '{"devices":[]}'
      const actual = []
      td.when(mock.getDevices()).thenResolve(actual)

      // arrange
      await sut.devicesGet(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal(expected)
    })
  })
})
