import { validateEmail } from './emailValidation'

describe('Email validation', () => {
    it('should return error for empty email', () => {
        const result = validateEmail('')
        expect(result.isValid).toBe(false)
        expect(result.errorMessage).toBe('Email is required')
    })

    it('should return error for invalid email format', () => {
        const invalidEmails = [
            'user@domain.',
            'user.namedomain.com',
            'user+tag@domain.',
            '1234@.org'
        ]

        invalidEmails.forEach(email => {
            const result = validateEmail(email)
            expect(result.isValid).toBe(false)
            expect(result.errorMessage).toBe('Please enter a valid email address')
        })
    })

    it('should return true for valid email format', () => {
        const validEmails = [
            'user@domain.com',
            'user123@nameDomain.app',
            'Twe342tt#2@data.co.uk'
        ]
        
        validEmails.forEach(email => {
            const result = validateEmail(email)
            expect(result.isValid).toBe(true)
            expect(result.errorMessage).toBe('')
        })
    })
})