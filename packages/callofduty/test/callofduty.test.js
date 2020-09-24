'use strict'

const CallOfDuty = require('..')
const { assert } = require('console')
const mockProfile = require('./mocks/api.mw.profile.json')

describe('Normalize', () => {
    const norm = CallOfDuty.Normalize.MW.Profile(mockProfile.data)
    it('profile', () => {
        const norm = CallOfDuty.Normalize.MW.Profile(mockProfile.data)
    })
})
