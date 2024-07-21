import { ARequest } from './ARequest';

//Tests for ARequest
//Ownership: Carly Bates

describe('ARequest Class', () => {
    const username = 'testUser';
    const password = 'testPass';

    class TestRequest extends ARequest {
        // Expose protected methods for testing
        public testEncodeLoginString(): string {
            return this.encodeLoginString();
        }

        public testGetUsername(): string {
            return this.getUsername();
        }

        public testGetPassword(): string {
            return this.getPassword();
        }
    }

    it('should encode login credentials correctly', () => {
        const instance = new TestRequest(username, password);
        const encoded = instance.testEncodeLoginString();

        // Perform assertions on the encoded string
        expect(encoded).toBeDefined();
        // Add more assertions as needed
    });

    it('should retrieve the correct username', () => {
        const instance = new TestRequest(username, password);
        const retrievedUsername = instance.testGetUsername();

        expect(retrievedUsername).toEqual(username);
    });

    it('should retrieve the correct password', () => {
        const instance = new TestRequest(username, password);
        const retrievedPassword = instance.testGetPassword();

        expect(retrievedPassword).toEqual(password);
    });
});