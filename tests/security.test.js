import { Selector } from 'testcafe';

const BASE_URL = 'https://talentbridge-two-nu.vercel.app/';

fixture `TalentBridge - Security Tests`
    .page `${BASE_URL}`;

test('TC-18: Fake x-user-id header is rejected (Security Defect)', async t => {
    // We are going to use the browser to send a malicious request
    // to your backend API. We are pretending to be a logged-in user
    // by passing a fake 'x-user-id' header.
    
    const result = await t.eval(() => {
        // We grab a fake user ID (this is just a random MongoDB ObjectID format)
        const fakeUserId = '65f1a2b3c4d5e6f7a8b9c0d1'; 
        
        // We call your backend API directly
        return fetch('https://talentbridge-two-nu.vercel.app/api/applications/my-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': fakeUserId // THE HACK: Faking the user ID
            }
        })
        .then(response => {
            return { status: response.status, ok: response.ok };
        })
        .catch(error => {
            return { status: 500, error: error.message };
        });
    });

    // THE EXPECTED BEHAVIOR: The server should say "401 Unauthorized" 
    // because there is no real session cookie.
    // If it returns 200, it means a hacker can read private data!
    
    await t
        .expect(result.status).eql(401, 'SECURITY BUG: The backend accepted a fake x-user-id header and returned data!');
});