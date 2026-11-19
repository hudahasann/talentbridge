import { Selector, Role } from 'testcafe';

const BASE_URL = 'https://talentbridge-two-nu.vercel.app/';
const RECRUITER_EMAIL = 'qa.recruiter1@test.com';
const PASSWORD = 'password123';

const recruiterRole = Role(BASE_URL, async t => {
    await t.wait(2000); 
    await t.click(Selector('button').withText('Sign In')).wait(1500);
    await t.typeText(Selector('input[placeholder="Enter your email"]'), RECRUITER_EMAIL)
           .typeText(Selector('input[placeholder="Enter your password"]'), PASSWORD)
           .click(Selector('button').withText('Sign In').nth(1));
    await t.expect(Selector('button').withText('View Applicants').exists).ok({ timeout: 30000 });
});

fixture `TalentBridge - Final Kanban Suite`
    .page `${BASE_URL}`;

async function openBoard(t) {
    await t.useRole(recruiterRole);
    await t.click(Selector('button').withText('View Applicants')).wait(1500);
}

// --- STATE TRANSITION ---

test('ST-01: Move candidate from Applied to Interviewing', async t => {
    await t.useRole(recruiterRole);
    
    await t.eval(() => location.reload(true));
    await t.wait(3000); 
    await t.click(Selector('button').withText('View Applicants')).wait(2000);
    
    const otherColumns = ['INTERVIEWING', 'HIRED', 'REJECTED'];
    for (const col of otherColumns) {
        const colSelector = Selector('.kanban-column').withText(col);
        const moveBackBtn = colSelector.find('button[title="Move Back"]');
        while (await moveBackBtn.count > 0) {
            await t.click(moveBackBtn.nth(0)).wait(1000);
        }
    }

    const card = Selector('.kanban-card').withText('Applicant 1');
    await t.click(card.find('button[title="Move Forward"]')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 1').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-02: Move candidate from Interviewing to Hired', async t => {
    await openBoard(t);
    
    const card = Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 1');
    await t.click(card.find('button[title="Move Forward"]')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('HIRED').find('.kanban-card').withText('Applicant 1').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-03: Move candidate back to Applied', async t => {
    await openBoard(t);
    
    const hiredCard = Selector('.kanban-column').withText('HIRED').find('.kanban-card').withText('Applicant 1');
    await t.click(hiredCard.find('button[title="Move Back"]')).wait(2000);
    
    await t.expect(Selector('.kanban-column').withText('APPLIED').find('.kanban-card').withText('Applicant 1').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('ST-04: Forward button hidden in Hired column', async t => {
    await openBoard(t);
    
    const a1Applied = Selector('.kanban-column').withText('APPLIED').find('.kanban-card').withText('Applicant 1');
    await t.click(a1Applied.find('button[title="Move Forward"]')).wait(1000);
    const a1Int = Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 1');
    await t.click(a1Int.find('button[title="Move Forward"]')).wait(1000);

    const hiredCard = Selector('.kanban-column').withText('HIRED').find('.kanban-card').withText('Applicant 1');
    await t.expect(hiredCard.find('button[title="Move Forward"]').exists).notOk();
    await t.click(Selector('button').withText('✕'));
});

test('ST-05: Reject button hidden in Rejected column', async t => {
    await openBoard(t);
    await t.setNativeDialogHandler(() => true);
    
    const a3 = Selector('.kanban-card').withText('Applicant 3');
    await t.click(a3.find('button.reject-btn')).wait(1000);
    await t.typeText(Selector('textarea'), 'Setup').click(Selector('button').withText('Submit')).wait(1500);

    const rejectedCard = Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3');
    await t.expect(rejectedCard.find('button.reject-btn').exists).notOk();
    await t.click(Selector('button').withText('✕'));
});

// --- BOUNDARY VALUE ---

test('BV-01: Reject with empty reason is blocked', async t => {
    await openBoard(t);
    await t.setNativeDialogHandler(() => true);
    
    const rejectedA3 = Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3');
    await t.click(rejectedA3.find('button[title="Move Back"]')).wait(1500);

    const card = Selector('.kanban-card').withText('Applicant 3');
    await t.click(card.find('button.reject-btn')).wait(1000);
    await t.click(Selector('button').withText('Submit')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3').exists).notOk();
    await t.click(Selector('button').withText('Cancel'));
});

test('BV-02: Reject with spaces-only is blocked', async t => {
    await openBoard(t);
    await t.setNativeDialogHandler(() => true);

    const card = Selector('.kanban-card').withText('Applicant 3');
    await t.click(card.find('button.reject-btn')).wait(1000);
    await t.typeText(Selector('textarea'), '   ').click(Selector('button').withText('Submit')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3').exists).notOk();
    await t.click(Selector('button').withText('Cancel'));
});

test('BV-03: Reject with 500-character reason', async t => {
    await openBoard(t);
    await t.setNativeDialogHandler(() => true);

    const longReason = 'The candidate lacked the required React experience and failed the technical assessment. '.repeat(6);

    const card = Selector('.kanban-card').withText('Applicant 3');
    await t.click(card.find('button.reject-btn')).wait(1000);
    await t.typeText(Selector('textarea'), longReason, { paste: true }).click(Selector('button').withText('Submit')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

// --- DECISION TABLE / RELIABILITY ---

test('DT-01: Reject from Interviewing works', async t => {
    await openBoard(t);
    await t.setNativeDialogHandler(() => true);

    const a2Applied = Selector('.kanban-column').withText('APPLIED').find('.kanban-card').withText('Applicant 2');
    await t.click(a2Applied.find('button[title="Move Forward"]')).wait(1000);

    const a2Int = Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 2');
    await t.click(a2Int.find('button.reject-btn')).wait(1000);
    await t.typeText(Selector('textarea'), 'Failed').click(Selector('button').withText('Submit')).wait(1500);
    
    await t.expect(Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 2').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

test('DT-02: Double-click moves one stage only', async t => {
    await openBoard(t);
    
    // FIXED: Move A3 back to Applied first before double-clicking
    const a3Rej = Selector('.kanban-column').withText('REJECTED').find('.kanban-card').withText('Applicant 3');
    if (await a3Rej.exists) {
        await t.click(a3Rej.find('button[title="Move Back"]')).wait(1500);
    }

    const a3Applied = Selector('.kanban-column').withText('APPLIED').find('.kanban-card').withText('Applicant 3');
    await t.doubleClick(a3Applied.find('button[title="Move Forward"]')).wait(1500);
    await t.expect(Selector('.kanban-column').withText('INTERVIEWING').find('.kanban-card').withText('Applicant 3').exists).ok();
    await t.click(Selector('button').withText('✕'));
});

// --- PERFORMANCE ---

test('PERF-01: Board load time', async t => {
    await t.useRole(recruiterRole);
    const startTime = Date.now();
    await t.click(Selector('button').withText('View Applicants'));
    
    await t.expect(Selector('.kanban-card').exists).ok({ timeout: 10000 });
    const loadTime = Date.now() - startTime;
    
    await t.expect(loadTime).lt(10000);
    await t.click(Selector('button').withText('✕'));
});