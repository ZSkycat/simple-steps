import c from 'chalk';
import { parseDisplayLength } from './help';

export interface StepsOption {
    showDuration: boolean;
    splitLine: false | number;
    stepTotal: false | number;
    handleStepWhenStepsSucceed: boolean;
    handleStepWhenStepsFail: boolean;
}

export class Steps {
    static defaultOption: StepsOption = {
        showDuration: true,
        splitLine: 128,
        stepTotal: false,
        handleStepWhenStepsSucceed: false,
        handleStepWhenStepsFail: true,
    };

    option: StepsOption;
    isStarted = false;
    stepList: Step[] = [];
    tickBegin = 0;
    tickEnd = 0;

    get last() {
        return this.stepList[this.stepList.length - 1];
    }

    get duration() {
        if (this.isStarted) this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }

    private get durationOutput() {
        return this.option.showDuration ? ` in ${this.duration}s` : '';
    }

    constructor(option?: Partial<StepsOption>) {
        if (option) this.option = Object.assign({}, Steps.defaultOption, option);
        else this.option = Object.assign({}, Steps.defaultOption);
    }

    step(title?: string) {
        if (this.stepList.length === 0) {
            this.isStarted = true;
            this.tickBegin = Date.now();
        }
        let step = new Step(this, title);
        this.stepList.push(step);
        return step;
    }

    stop() {
        if (this.isStarted) {
            this.isStarted = false;
            this.tickEnd = Date.now();
        }
    }

    succeed(handleStep: boolean = this.option.handleStepWhenStepsSucceed) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.succeed());
        // _succeed_ in 0.XXXs
        console.log(c.black.bgGreen(' succeed ') + c.green(this.durationOutput));
    }

    fail(handleStep: boolean = this.option.handleStepWhenStepsFail) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.fail());
        // _fail_ in 0.XXXs
        console.log(c.black.bgRed(' fail ') + c.red(this.durationOutput));
    }
}

export type StepState = 'initial' | 'start' | 'stop' | 'succeed' | 'fail';

export class Step {
    context: Steps;
    title: string;
    state: StepState = 'initial';
    tickBegin = 0;
    tickEnd = 0;

    get ordinal() {
        return this.context.stepList.findIndex(x => x === this) + 1;
    }

    get duration() {
        if (this.isStarted) this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }

    get isStarted() {
        return this.state === 'initial' ? false : true;
    }

    get isResult() {
        return this.state === 'succeed' || this.state === 'fail';
    }

    private get ordinalOutput() {
        return `[${this.ordinal}${this.context.option.stepTotal ? '/' + this.context.option.stepTotal : ''}]`;
    }

    private get durationOutput() {
        return this.context.option.showDuration ? c.gray(`(${this.duration}s)`) : '';
    }

    constructor(context: Steps, title: string = '') {
        this.context = context;
        this.title = title;
    }

    start() {
        if (this.isStarted === false) {
            this.tickBegin = Date.now();
            this.state = 'start';
            // [0/0] > {title} ----------
            let msg = `${c.cyan(this.ordinalOutput)} ${c.cyan('>')} ${this.title}`;
            if (this.context.option.splitLine) {
                let columns = this.context.option.splitLine;
                if (process.stdout.columns && process.stdout.columns < columns) columns = process.stdout.columns;
                let length = columns - parseDisplayLength(msg) - 5;
                msg += ' ' + c.gray('-'.repeat(length));
            }
            console.log(msg);
        }
        return this;
    }

    stop() {
        if (this.isStarted) {
            this.state = 'stop';
            this.tickEnd = Date.now();
        }
    }

    succeed(title: string = this.title) {
        if (this.isResult) return;

        this.stop();
        this.state = 'succeed';
        // [0/0] √ {title} (0.XXXs)
        console.log(`${c.green(this.ordinalOutput)} ${c.green('√')} ${title} ${this.durationOutput}`);
    }

    fail(title: string = this.title) {
        if (this.isResult) return;

        this.stop();
        this.state = 'fail';
        // [0/0] × {title} (0.XXXs)
        console.log(`${c.red(this.ordinalOutput)} ${c.red('×')} ${title} ${this.durationOutput}`);
    }
}
