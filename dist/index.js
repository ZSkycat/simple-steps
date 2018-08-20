"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const help_1 = require("./help");
class Steps {
    constructor(option) {
        this.isStarted = false;
        this.stepList = [];
        this.tickBegin = 0;
        this.tickEnd = 0;
        if (option)
            this.options = Object.assign({}, Steps.defaultOptions, option);
        else
            this.options = Object.assign({}, Steps.defaultOptions);
        this.stream = this.options.stream;
    }
    get last() {
        return this.stepList[this.stepList.length - 1];
    }
    get duration() {
        if (this.isStarted)
            this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }
    get formatDuration() {
        return this.options.duration ? ` in ${this.duration}s` : '';
    }
    step(title) {
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
    succeed(handleStep = this.options.handleStepWhenStepsSucceed) {
        this.stop();
        if (handleStep)
            this.stepList.forEach(x => x.succeed());
        this.stream.write(chalk_1.default.black.bgGreen(' succeed ') + chalk_1.default.green(this.formatDuration) + '\n');
    }
    // format:
    // █fail█ in 0.XXXs
    fail(handleStep = this.options.handleStepWhenStepsFail) {
        this.stop();
        if (handleStep)
            this.stepList.forEach(x => x.fail());
        this.stream.write(chalk_1.default.black.bgRed(' fail ') + chalk_1.default.red(this.formatDuration) + '\n');
    }
}
Steps.defaultOptions = {
    stream: process.stdout,
    duration: true,
    splitLine: 128,
    stepTotal: false,
    handleStepWhenStepsSucceed: false,
    handleStepWhenStepsFail: true,
};
exports.Steps = Steps;
class Step {
    constructor(context, title = '') {
        this.state = 'initial';
        this.tickBegin = 0;
        this.tickEnd = 0;
        this.context = context;
        this.title = title;
    }
    get index() {
        return this.context.stepList.findIndex(x => x === this) + 1;
    }
    get duration() {
        if (this.state === 'start')
            this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }
    get isComplete() {
        return this.state === 'succeed' || this.state === 'fail';
    }
    get formatIndex() {
        return `[${this.index}${this.context.options.stepTotal ? '/' + this.context.options.stepTotal : ''}]`;
    }
    get formatDuration() {
        return this.context.options.duration ? chalk_1.default.gray(`(${this.duration}s)`) : '';
    }
    // format:
    // [0/0] > {title} ----------
    start() {
        if (this.state === 'initial') {
            this.tickBegin = Date.now();
            this.state = 'start';
            let msg = `${chalk_1.default.cyan(this.formatIndex)} ${chalk_1.default.cyan('>')} ${this.title}`;
            if (this.context.options.splitLine) {
                let columns = this.context.options.splitLine;
                if (process.stdout.columns && process.stdout.columns < columns)
                    columns = process.stdout.columns;
                let length = columns - help_1.parseDisplayLength(msg) - 1;
                if (length > 0)
                    msg += ' ' + chalk_1.default.gray('-'.repeat(length));
            }
            this.context.stream.write(msg + '\n');
        }
        return this;
    }
    stop() {
        if (this.state === 'start') {
            this.state = 'stop';
            this.tickEnd = Date.now();
        }
    }
    // format:
    // [0/0] √ {title} (0.XXXs)
    succeed(title = this.title) {
        if (this.isComplete)
            return;
        this.stop();
        this.state = 'succeed';
        this.context.stream.write(`${chalk_1.default.green(this.formatIndex)} ${chalk_1.default.green('√')} ${title} ${this.formatDuration}` + '\n');
    }
    // format:
    // [0/0] × {title} (0.XXXs)
    fail(title = this.title) {
        if (this.isComplete)
            return;
        this.stop();
        this.state = 'fail';
        this.context.stream.write(`${chalk_1.default.red(this.formatIndex)} ${chalk_1.default.red('×')} ${title} ${this.formatDuration}` + '\n');
    }
}
exports.Step = Step;
//# sourceMappingURL=index.js.map