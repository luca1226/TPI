import 'mocha'
import * as td from 'testdouble'
import { context, expectMiddlewareFunctionThrow } from '../../test/mock-utility'
import { expect } from 'chai'

describe('Routes for probes', () => {
  /** The module under test (SUT) */
  let sut
  /** the require done by the SUT that wil be mock */
  let mock

  beforeEach(() => {
    mock = td.replace('../controllers/databaseRequest')
    sut = require('./probes')
  })

  afterEach(() => {
    td.reset()
  })

  describe('GET', () => {
    it('returns valid json number of probesType', async () => {
      // act
      const actual = 2
      const expected = '{"type":8,"number":2}'
      td.when(mock.getNumberOfProbeType(8)).thenResolve(actual)

      context.params.probeId = 8

      // arrange
      await sut.probesGet(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal(expected)
    })

    it('should throw when the probeId is not a number ', async () => {
      // act
      // arrange
      td.when(mock.getNumberOfProbeType(td.matchers.argThat((ctx) => {
        return (ctx.params.probeId = '8')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Must be a number')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.probesGet, 400, 'Must be a number')
    })
  })
})
