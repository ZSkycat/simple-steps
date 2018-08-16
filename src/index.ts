import c from 'chalk';
import { parseDisplayLength } from './help';

export interface StepsOptions {
    stream: NodeJS.WriteStream;
    showDuration: boolean;
    splitLine: false | number;
    stepTotal: false | number;
    handleStepWhenStepsSucceed: boolean;
    handleStepWhenStepsFail: boolean;
}

export class Steps {
    static defaultOptions: StepsOptions = {
        stream: process.stdout,
        showDuration: true,
        splitLine: 128,
        stepTotal: false,
        handleStepWhenStepsSucceed: false,
        handleStepWhenStepsFail: true,
    };

    option: StepsOptions;
    stream: NodeJS.WriteStream;
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

    get outputDuration() {
        return this.option.showDuration ? ` in ${this.duration}s` : '';
    }

    constructor(option?: Partial<StepsOptions>) {
        if (option) this.option = Object.assign({}, Steps.defaultOptions, option);
        else this.option = Object.assign({}, Steps.defaultOptions);
        this.stream = this.option.stream;
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

    // format:
    // █succeed█ in 0.XXXs
    succeed(handleStep: boolean = this.option.handleStepWhenStepsSucceed) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.succeed());
        this.stream.write(c.black.bgGreen(' succeed ') + c.green(this.outputDuration))
    }

    // format:
    // █fail█ in 0.XXXs
    fail(handleStep: boolean = this.option.handleStepWhenStepsFail) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.fail());
        this.stream.write(c.black.bgRed(' fail ') + c.red(this.outputDuration));
    }
}

export type StepState = 'initial' | 'start' | 'stop' | 'succeed' | 'fail';

export class Step {
    context: Steps;
    title: string;
    state: StepState = 'initial';
    tickBegin = 0;
    tickEnd = 0;

    get index() {
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

    get outputIndex() {
        return `[${this.index}${this.context.option.stepTotal ? '/' + this.context.option.stepTotal : ''}]`;
    }

    get outputDuration() {
        return this.context.option.showDuration ? c.gray(`(${this.duration}s)`) : '';
    }

    constructor(context: Steps, title: string = '') {
        this.context = context;
        this.title = title;
    }

    // format:
    // [0/0] > {title} ----------
    start() {
        if (this.isStarted === false) {
            this.tickBegin = Date.now();
            this.state = 'start';
            let msg = `${c.cyan(this.outputIndex)} ${c.cyan('>')} ${this.title}`;
            if (this.context.option.splitLine) {
                let columns = this.context.option.splitLine;
                if (process.stdout.columns && process.stdout.columns < columns) columns = process.stdout.columns;
                let length = columns - parseDisplayLength(msg) - 5;
                msg += ' ' + c.gray('-'.repeat(length));
            }
            this.context.stream.write(msg);
        }
        return this;
    }

    stop() {
        if (this.isStarted) {
            this.state = 'stop';
            this.tickEnd = Date.now();
        }
    }

    // format:
    // [0/0] √ {title} (0.XXXs)
    succeed(title: string = this.title) {
        if (this.isResult) return;
        this.stop();
        this.state = 'succeed';
        this.context.stream.write(`${c.green(this.outputIndex)} ${c.green('√')} ${title} ${this.outputDuration}`);
    }

    // format:
    // [0/0] × {title} (0.XXXs)
    fail(title: string = this.title) {
        if (this.isResult) return;
        this.stop();
        this.state = 'fail';
        this.context.stream.write(`${c.red(this.outputIndex)} ${c.red('×')} ${title} ${this.outputDuration}`);
    }
}
