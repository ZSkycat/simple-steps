import { Steps } from '../src/index';

async function waitTime(time: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), time);
    });
}

describe('', function() {
    this.timeout(60 * 1000);

    it('output normal', async function() {
        let steps = new Steps({ stepTotal: 3 });

        try {
            steps.step('clear').start();
            await waitTime(1000);
            steps.last.succeed();
        } catch (e) {
            steps.fail();
            return;
        }

        try {
            steps.step('test').start();
            await waitTime(1000);
            steps.last.succeed();
        } catch (e) {
            steps.fail();
            return;
        }

        try {
            steps.step('build').start();
            await waitTime(1000);
            steps.last.succeed();
        } catch (e) {
            steps.fail();
            return;
        }

        steps.succeed();
    });

    it('output fail', async function() {
        let steps = new Steps({ stepTotal: 2 });

        try {
            steps.step('clear').start();
            await waitTime(1000);
            steps.last.succeed();
        } catch (e) {
            steps.fail();
            return;
        }

        try {
            steps.step('build').start();
            await waitTime(1000);
            throw new Error();
        } catch (e) {
            steps.fail();
            return;
        }
    });

    it('output concurrent ', async function() {
        let steps = new Steps({ splitLine: false, stepTotal: 3 });
        let step1 = steps.step('project.A build').start();
        let step2 = steps.step('project.B build').start();
        let step3 = steps.step('project.C build').start();

        await waitTime(1000);
        step3.succeed();
        await waitTime(1000);
        step1.succeed();
        step2.succeed();

        steps.succeed();
    });
});
