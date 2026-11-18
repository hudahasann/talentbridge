import { Selector, Role } from 'testcafe';

// --- CONFIGURATION ---
const BASE_URL = 'https://talentbridge-two-nu.vercel.app/';
const RECRUITER_EMAIL = 'qa.recruiter1@test.com';
const RECRUITER_PASS = 'password123'; 

// 1. SETUP THE RECRUITER ROLE
const recruiterRole = Role(BASE_URL, async t => {
    // 1. Click Sign In
    await t
        .click(Selector('button').withText('Sign In'))
        .wait(1500); 

    // 2. Type credentials and click
    await t
        .typeText(Selector('input[placeholder="Enter your email"]'), RECRUITER_EMAIL)
        .typeText(Selector('input[placeholder="Enter your password"]'), RECRUITER_PASS)
        .click(Selector('button').withText('Sign In').nth(1)); 

    // 3. THE FIX: Wait until the Dashboard is fully loaded by looking for the "View Applicants" button
    // This gives Vercel up to 15 seconds to respond and React to render the page
    await t.expect(Selector('button').withText('View Applicants').exists).ok({ timeout: 15000 });
});

fixture `TalentBridge - Kanban Board`
    .page `${BASE_URL}`;

// --- TEST CASES ---

test('TC-01: Verify Kanban Board loads with correct applicants and match scores', async t => {
    await t.useRole(recruiterRole);

    // Dashboard is already loaded because of the Role check above
    await t
        .click(Selector('button').withText('View Applicants'))
        .wait(2000);

    await t.takeScreenshot('TC01_Kanban_Board_Loaded.png');

    const score100 = Selector('.match-badge').withText('100%');
    const score67 = Selector('.match-badge').withText('67%');
    const score0 = Selector('.match-badge').withText('0%');

    await t
        .expect(score100.exists).ok()
        .expect(score67.exists).ok()
        .expect(score0.exists).ok();
});

test('TC-02: Move Applicant 1 from Applied to Interviewing', async t => {
    await t.useRole(recruiterRole);
    
    await t
        .click(Selector('button').withText('View Applicants'))
        .wait(2000);

    const applicant1Card = Selector('.kanban-card').withText('Applicant 1');
    const moveForwardBtn = applicant1Card.find('button[title="Move Forward"]');

    await t
        .click(moveForwardBtn)
        .wait(1500);

    await t.takeScreenshot('TC02_Moved_To_Interviewing.png');

    const interviewingColumn = Selector('.kanban-column').withText('INTERVIEWING');
    await t.expect(interviewingColumn.find('.kanban-card').withText('Applicant 1').exists).ok();
});

test('TC-03: Reject Applicant 3 with a reason', async t => {
    await t.useRole(recruiterRole);
    
    await t
        .click(Selector('button').withText('View Applicants'))
        .wait(2000);

    const applicant3Card = Selector('.kanban-card').withText('Applicant 3');
    const rejectBtn = applicant3Card.find('button.reject-btn');

    await t.click(rejectBtn).wait(1000);

    const reasonTextarea = Selector('textarea[placeholder="e.g., Lacks required React experience"]');
    const submitBtn = Selector('button.btn-primary-large').withText('Submit');

    await t
        .typeText(reasonTextarea, 'Skills do not match QA Test Job requirements.')
        .click(submitBtn)
        .wait(1500);

    await t.takeScreenshot('TC03_Rejected_With_Reason.png');

    const rejectedColumn = Selector('.kanban-column').withText('REJECTED');
    await t.expect(rejectedColumn.find('.kanban-card').withText('Applicant 3').exists).ok();
});