# simple-steps
A module that facilitates the display of step status and time in the terminal.<br>
一个方便在终端显示步骤状态和花费时间的模块。<br>

![preview](https://user-images.githubusercontent.com/20368649/42366169-20b5ab62-8133-11e8-8bf3-0c3aee8d1d09.gif)


## Getting Started
**Installation** ([npm](https://www.npmjs.com/package/simple-steps))
```
npm install --save-dev simple-steps
yarn add --dev simple-steps
```

**Usage**
```javascript
// import using CommonJS
const Steps = require('simple-steps').Steps;
// import using ESModule
import { Steps } from 'simple-steps';

// example
let steps = new Steps({ stepTotal: 2 });
try {
    steps.step('clear').start();
    // doing
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
try {
    steps.step('build').start();
    // doing
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
steps.succeed();
```


## API
### Class Steps
```typescript
new Steps(option?: StepsOption)

interface StepsOption {
    showDuration: boolean;               // default: true
    splitLine: false | number;           // default: 128
    stepTotal: false | number;           // default: false
    handleStepWhenStepsSucceed: boolean; // default: false
    handleStepWhenStepsFail: boolean;    // default: true
}
```

#### StepsOption.showDuration
是否启用显示花费时间

#### StepsOption.splitLine
是否启用显示分割线，并指定最大长度 (自动根据终端宽度计算)，例<br>
`splitLine: 128`: 启用，分割线所在行最大 64 字符

#### StepsOption.stepTotal
是否显示步骤总数，并指定总数，例<br>
`stepTotal: 3`: 启用，步骤总数为 3

#### StepsOption.handleStepWhenStepsSucceed
是否自动调用所有步骤的 `step.succeed()`

#### StepsOption.handleStepWhenStepsFail
是否自动调用所有步骤的 `step.fail()`

#### steps.last: Step
获取最后一个步骤

#### steps.step(title?: string): Step
`title`: 指定步骤的标题<br>
创建步骤，返回 `Step` 实例

#### steps.stop()
停止花费时间的计时

#### steps.succeed(handleStep?: boolean)
`handleStep`: 和 `StepsOption.handleStepWhenStepsSucceed` 一样<br>
输出成功消息

#### steps.fail(handleStep?: boolean)
`handleStep`: 和 `StepsOption.handleStepWhenStepsFail` 一样<br>
输出失败消息

### Class Step
需要使用 `steps.step` 创建

#### step.start(): this
输出开始信息

#### step.stop()
停止花费时间的计时

#### step.succeed(title?: string)
`title`: 指定输出的标题<br>
输出成功信息

#### step.fail(title?: string)
`title`: 指定输出的标题<br>
输出失败信息


## License
[MIT](https://github.com/ZSkycat/simple-steps/blob/master/LICENSE)
