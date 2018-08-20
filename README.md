# simple-steps
[![version](https://img.shields.io/npm/v/simple-steps.svg)](https://www.npmjs.com/package/simple-steps)
[![downloads](https://img.shields.io/npm/dt/simple-steps.svg)](https://www.npmjs.com/package/simple-steps)

Help you output the step log in the terminal, and count the time spent.<br>
帮助你在终端输出步骤日志，和计算所花费的时间。<br>

![preview](https://user-images.githubusercontent.com/20368649/42366169-20b5ab62-8133-11e8-8bf3-0c3aee8d1d09.gif)

## 起步
**安装**
```
npm install --save-dev simple-steps
```

**用法**
```javascript
// 导入
const Steps = require('simple-steps').Steps;

// 示例
let steps = new Steps({ stepTotal: 2 });
try {
    steps.step('clear').start();
    // 做些事情
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
try {
    steps.step('build').start();
    // 做些事情
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
steps.succeed();
```

## API
```typescript
const steps = new Steps(options?: StepsOptions);
const step = steps.step('title').start();
```
### StepsOptions

实例化 Steps 的选项。

### StepsOptions.duration
**类型:** `boolean`<br>
**默认:** `true`<br>
是否输出花费时间。

### StepsOptions.splitLine
**类型:** `false | number`<br>
**默认:** `128`<br>
是否输出分割线，并指定最大长度。

### StepsOptions.stepTotal
**类型:** `false | number`<br>
**默认:** `false`<br>
是否输出步骤总数，并指定数量。

### StepsOptions.handleStepWhenStepsSucceed
**类型:** `boolean`<br>
**默认:** `false`<br>
当调用 `steps.succeed()` 时，是否自动调用所有步骤的 `step.succeed()`。

### StepsOptions.handleStepWhenStepsFail
**类型:** `boolean`<br>
**默认:** `true`<br>
当调用 `steps.fail()` 时，是否自动调用所有步骤的 `step.fail()`。

---

### Class Steps
主要入口。

### steps.isStarted: boolean
获取是否正在计时。

### steps.stepList: Step[]
获取所有步骤。

### steps.last: Step
获取最后一个步骤。

### steps.duration: number
获取花费时间，单位 ms。

### steps.step(title?: string): Step
`title`: 设置步骤的标题<br>
创建新的步骤实例。第一次调用时，`Steps` 将开始计时。

### steps.stop()
停止计时。

### steps.succeed(handleStep?: boolean)
`handleStep`: 参考 `StepsOptions.handleStepWhenStepsSucceed`<br>
输出成功消息。

### steps.fail(handleStep?: boolean)
`handleStep`: 参考 `StepsOptions.handleStepWhenStepsFail`<br>
输出失败消息。

---

### Class Step
使用 `steps.step()` 创建的步骤实例。

### step.state: StepState
`StepState`: `'initial' | 'start' | 'stop' | 'succeed' | 'fail'`<br>
获取步骤的状态。

### step.index: number
获取步骤的索引。（创建顺序）

### step.duration: number
获取花费时间，单位 ms。

### step.isComplete: boolean
获取步骤是否已经完成。

### step.start(): this
输出开始信息，并开始计时。

### step.stop()
停止计时。

### step.succeed(title?: string)
`title`: 设置输出的标题<br>
输出成功信息。

### step.fail(title?: string)
`title`: 设置输出的标题<br>
输出失败信息。

## License
[MIT](https://github.com/ZSkycat/simple-steps/blob/master/LICENSE.txt)
