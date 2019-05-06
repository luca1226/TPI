import 'mocha'
import * as td from 'testdouble'
import { context, expectMiddlewareFunctionThrow } from '../../test/mock-utility'
import { expect } from 'chai'

describe('Routes for Users authentication', () => {
  /** The module under test (SUT) */
  let sut
  /** the require done by the SUT that wil be mock */
  let mock

  beforeEach(() => {
    mock = td.replace('../controllers/userAuth')
    sut = require('./users')
  })

  afterEach(() => {
    td.reset()
  })
  describe('POST', () => {
    it('should create a new user', async () => {
      // act
      context.request.body.email = 'fake.email@gmail.com'
      context.request.body.password = 'fake'
      // arrange
      await sut.userSignUp(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal({
        message: 'User created'
      })
    })

    it('should throw posting a new user when email is empty', async () => {
      // act
      // wrong email parameters to send to the post of the new user
      context.request.body.email = ''
      context.request.body.password = 'fake'

      // arrange
      td.when(mock.signUp(td.matchers.argThat((ctx) => {
        return (ctx.request.body.email === '' &&
          ctx.request.body.password === 'fake')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Email is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.userSignUp, 400, 'Email is empty')
    })

    it('should throw posting a new user when password is empty', async () => {
      // act
      // wrong password parameters to send to the post of the new user
      context.request.body.email = 'fake.email@gmail.com'
      context.request.body.password = ''

      // arrange
      td.when(mock.signUp(td.matchers.argThat((ctx) => {
        return (ctx.request.body.email === 'fake.email@gmail.com' &&
          ctx.request.body.password === '')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Password is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.userSignUp, 400, 'Password is empty')
    })

    it('should log an user', async () => {
      // act
      context.request.body.email = 'fake.email@gmail.com'
      context.request.body.password = 'fake'
      // arrange
      await sut.userLogin(context)

      // assert
      const devices = context.body
      expect(devices).to.deep.equal({
        message: 'Auth successful'
      })
    })
    it('should throw logging an user when email is empty', async () => {
      // act
      // wrong email parameters to send to the log of the user
      context.request.body.email = ''
      context.request.body.password = 'fake'

      // arrange
      td.when(mock.login(td.matchers.argThat((ctx) => {
        return (ctx.request.body.email === '' &&
          ctx.request.body.password === 'fake')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Email is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.userLogin, 400, 'Email is empty')
    })

    it('should throw logging an user when password is empty', async () => {
      // act
      // wrong password parameters to send to the log of the user
      context.request.body.email = 'fake.email@gmail.com'
      context.request.body.password = ''

      // arrange
      td.when(mock.login(td.matchers.argThat((ctx) => {
        return (ctx.request.body.email === 'fake.email@gmail.com' &&
          ctx.request.body.password === '')
      })))
        .thenDo((ctx) => {
          ctx.throw(400, 'Password is empty')
        })

      // assert
      await expectMiddlewareFunctionThrow(sut.userLogin, 400, 'Password is empty')
    })
  })
})
