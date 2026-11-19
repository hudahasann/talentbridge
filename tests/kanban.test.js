import { Selector, Role, ClientFunction } from 'testcafe';

const BASE_URL = 'https://talentbridge-two-nu.vercel.app/';
const RECRUITER_EMAIL = 'qa.recruiter1@test.com';
const PASSWORD = 'password123'; 

// 1. Login Role
const recruiterRole = Role(BASE_URL, async t => {
    await t.click(Selector('button').withText('Sign In')).wait(1500);
    await t.typeText(Selector('input[placeholder="Enter your email"]'), RECRUITER_EMAIL)
           .typeText(Selector('input[placeholder="Enter your password"]'), PASSWORD)
           .click(Selector('button').withText('Sign In').nth(1));
    await t.expect(Selector('button').withText('View Applicants').exists).ok({ timeout: 15000 });
});

// 2. Auto-Reset Helper
async function resetBoard(t) {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1500);
    
    const otherColumns = ['INTERVIEWING', 'HIRED', 'REJECTED'];
    for (const col of otherColumns) {
        const colSelector = Selector('.kanban-column').withText(col);
        const moveBackBtn = colSelector.find('button[title="Move Back"]');
        
        while (await moveBackBtn.count > 0) {
            await t.click(moveBackBtn.nth(0)).wait(500); // Reduced wait time for speed
        }
    }
    await t.click(Selector('button').withText('✕')).wait(500);
}

fixture `TalentBridge - Kanban Board Deep Testing`
    .page `${BASE_URL}`
    // THIS RUNS ONCE AT THE VERY BEGINNING
    .before(async t => {
        await resetBoard(t);
    });

// --- TEST CASES (No more resetBoard inside these) ---

test('ST-01: Status transition Applied to Interviewing', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const card = Selector('.kanban-card').withText('Applicant 1');
    await t.click(card.find('button[title="Move Forward"]')).wait(800);
    await t.expect(Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 1').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-02: Status transition Interviewing to Hired', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const card = Selector('.kanban-card').withText('Applicant 1');
    await t.click(card.find('button[title="Move Forward"]')).wait(800);
    await t.click(card.find('button[title="Move Forward"]')).wait(800);
    await t.expect(Selector('.kanban-column').withText('HIRED').find('.kanban-card').withText('Applicant 1').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-09: Double click moves one stage only', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    // We use Applicant 2 so we don't conflict with ST-01 and ST-02
    const card = Selector('.kanban-card').withText('Applicant 2');
    const forwardBtn = card.find('button[title="Move Forward"]');
    
    await t.doubleClick(forwardBtn).wait(1200);
    await t.expect(Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 2').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-10: Update status to invalid value via API', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const sendInvalidStatus = ClientFunction(() => {
        const appId = '65f1a2b3c4d5e6f7a8b9c0d1'; 
        return fetch(`/api/applications/${appId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Archived' })
        }).then(res => res.status);
    });
    
    const status = await sendInvalidStatus();
    await t.expect([400, 401, 404].includes(status)).ok();
    await t.click(Selector('button').withText('✕'));
});

test('FB-02: Reject with reason shows on card', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const card = Selector('.kanban-card').withText('Applicant 3');
    await t.click(card.find('button.reject-btn')).wait(800);
    await t.typeText(Selector('textarea'), 'Missing React skills.').click(Selector('button').withText('Submit')).wait(1000);
           
    const rejectedCol = Selector('.kanban-column').withText('REJECTED');
    await t.expect(rejectedCol.find('.kanban-card').withText('Applicant 3').exists).ok();
    await t.expect(rejectedCol.find('.kanban-card').withText('Missing React skills.').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('FB-05: Reject with spaces only is blocked', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    // We reset A3 manually in this specific test since it was rejected in FB-02
    const card = Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3');
    await t.click(card.find('button[title="Move Back"]')).wait(800);
    
    const appliedCard = Selector('.kanban-card').withText('Applicant 3');
    await t.click(appliedCard.find('button.reject-btn')).wait(800);
    
    // Type only spaces
    await t.typeText(Selector('textarea'), '     ').click(Selector('button').withText('Submit')).wait(1000);
    
    // Should NOT move to Rejected because our new frontend fix blocks it
    await t.expect(Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3').exists).notOk();
    await t.click(Selector('button').withText('✕'));
});

test('MS-02: Two of three skills matched (67%)', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const cardA2 = Selector('.kanban-card').withText('Applicant 2');
    await t.expect(cardA2.find('.match-badge').withText('67%').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('MS-14: High match badge at 70% boundary', async t => {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1000);
    
    const cardA1 = Selector('.kanban-card').withText('Applicant 1');
    const cardA2 = Selector('.kanban-card').withText('Applicant 2');
    
    await t.expect(cardA1.find('.match-badge.high').exists).ok();
    await t.expect(cardA2.find('.match-badge.high').exists).notOk();
    await t.click(Selector('button').withText('✕'));
});

test('PF-01: Board opens quickly (< 6s)', async t => {
    await t.useRole(recruiterRole);
    
    const startTime = Date.now();
    await t.click(Selector('button').withText('View Applicants'));
    await t.expect(Selector('.kanban-card').exists).ok({ timeout: 6000 });
    const loadTime = Date.now() - startTime;
    
    await t.expect(loadTime).lt(6000);
    await t.click(Selector('button').withText('✕'));
});