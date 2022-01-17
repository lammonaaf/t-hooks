[t-hooks](README.md) / Exports

# t-hooks

## Table of contents

### Functions

- [useGeneratorCallback](modules.md#usegeneratorcallback)
- [useGeneratorCallbackState](modules.md#usegeneratorcallbackstate)
- [useGeneratorEffect](modules.md#usegeneratoreffect)
- [useGeneratorMemo](modules.md#usegeneratormemo)
- [useGeneratorMemoState](modules.md#usegeneratormemostate)
- [useTaskCallback](modules.md#usetaskcallback)
- [useTaskCallbackState](modules.md#usetaskcallbackstate)
- [useTaskEffect](modules.md#usetaskeffect)
- [useTaskMemo](modules.md#usetaskmemo)
- [useTaskMemoState](modules.md#usetaskmemostate)

## Functions

### useGeneratorCallback

▸ `Const` **useGeneratorCallback**<`A`, `T`, `TT`, `R`\>(`taskGeneratorFunction`, `deps`): (...`args`: `A`) => `Task`<`R`\>

Generator-based asynchronous callback hook (convinience binding)

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `A` | extends `any`[] | callback arguments type |
| `T` | `T` | - |
| `TT` | extends `Task`<`T`, `TT`\> | yielded task type |
| `R` | `R` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGeneratorFunction` | `TaskGeneratorFunction`<`A`, `T`, `TT`, `R`\> | task generator function |
| `deps` | `DependencyList` | dependency list |

#### Returns

`fn`

callback to be invoked

▸ (...`args`): `Task`<`R`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `A` |

##### Returns

`Task`<`R`\>

#### Defined in

[index.ts:376](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L376)

___

### useGeneratorCallbackState

▸ `Const` **useGeneratorCallbackState**<`A`, `T`, `TT`, `R`\>(`taskGeneratorFunction`, `deps`): readonly [(...`args`: `A`) => `Task`<`R`\>, `boolean`, () => `void`]

Generator-based asynchronous callback hook

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `A` | extends `any`[] | callback arguments type |
| `T` | `T` | - |
| `TT` | extends `Task`<`T`, `TT`\> | yielded task type |
| `R` | `R` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGeneratorFunction` | `TaskGeneratorFunction`<`A`, `T`, `TT`, `R`\> | task generator function |
| `deps` | `DependencyList` | dependency list |

#### Returns

readonly [(...`args`: `A`) => `Task`<`R`\>, `boolean`, () => `void`]

callback to be invoked, current execution status (running or not) and cancellation function

#### Defined in

[index.ts:342](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L342)

___

### useGeneratorEffect

▸ `Const` **useGeneratorEffect**<`T`, `TT`, `R`\>(`taskGeneratorFunction`, `deps`): readonly [`boolean`, () => `void`]

Generator-invoking hook

Generator version of task-effect converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskEffect

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | - |
| `TT` | extends `Task`<`T`, `TT`\> | yielded task type |
| `R` | `R` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGeneratorFunction` | `TaskGeneratorFunction`<[], `T`, `TT`, `R`\> | task generator function |
| `deps` | `DependencyList` | dependency list |

#### Returns

readonly [`boolean`, () => `void`]

current execution status (running or not) and cancellation function

#### Defined in

[index.ts:78](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L78)

___

### useGeneratorMemo

▸ `Const` **useGeneratorMemo**<`T`, `TT`, `R`\>(`initialValue`, `taskGeneratorFunction`, `deps`): `R`

Generator-based asynchronous memo hook (convinience binding)

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useGeneratorMemoState

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | - |
| `TT` | extends `Task`<`T`, `TT`\> | yielded task type |
| `R` | `R` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `R` | initial value available immediately |
| `taskGeneratorFunction` | `TaskGeneratorFunction`<[], `T`, `TT`, `R`\> | task generator function |
| `deps` | `DependencyList` | dependency list |

#### Returns

`R`

memorized value

#### Defined in

[index.ts:219](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L219)

___

### useGeneratorMemoState

▸ `Const` **useGeneratorMemoState**<`T`, `TT`, `R`\>(`initialValue`, `taskGeneratorFunction`, `deps`): readonly [`R`, `boolean`, () => `void`]

Generator-based asynchronous memo hook

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskMemoState

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | - |
| `TT` | extends `Task`<`T`, `TT`\> | yielded task type |
| `R` | `R` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `R` | initial value available immediately |
| `taskGeneratorFunction` | `TaskGeneratorFunction`<[], `T`, `TT`, `R`\> | task generator function |
| `deps` | `DependencyList` | dependency list |

#### Returns

readonly [`R`, `boolean`, () => `void`]

memorized value, current execution status (running or not) and cancellation function

#### Defined in

[index.ts:191](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L191)

___

### useTaskCallback

▸ `Const` **useTaskCallback**<`A`, `T`\>(`taskFunction`, `deps`): (...`args`: `A`) => `Task`<`T`\>

Task-based asynchronous callback hook (convinience binding)

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `A` | extends `any`[] | callback arguments type |
| `T` | `T` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskFunction` | `TaskFunction`<`A`, `T`\> | task taskFunction to be invoked as callback |
| `deps` | `DependencyList` | dependency list |

#### Returns

`fn`

callback to be invoked

▸ (...`args`): `Task`<`T`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `A` |

##### Returns

`Task`<`T`\>

#### Defined in

[index.ts:315](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L315)

___

### useTaskCallbackState

▸ `Const` **useTaskCallbackState**<`A`, `T`\>(`taskFunction`, `deps`): readonly [(...`args`: `A`) => `Task`<`T`\>, `boolean`, () => `void`]

Task-based asynchronous callback hook

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `A` | extends `any`[] | callback arguments type |
| `T` | `T` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskFunction` | `TaskFunction`<`A`, `T`\> | task taskFunction to be invoked as callback |
| `deps` | `DependencyList` | dependency list |

#### Returns

readonly [(...`args`: `A`) => `Task`<`T`\>, `boolean`, () => `void`]

callback to be invoked, current execution status (running or not) and cancellation function

#### Defined in

[index.ts:248](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L248)

___

### useTaskEffect

▸ `Const` **useTaskEffect**<`T`\>(`taskFunction`, `deps`): readonly [`boolean`, () => `void`]

Task-invoking hook

Task equivalent to useEffect hook allowing to perform asynchronous operations as effects

Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskFunction` | `TaskFunction`<[], `T`\> | task taskFunction to be invoked as effect |
| `deps` | `DependencyList` | dependency list |

#### Returns

readonly [`boolean`, () => `void`]

current execution status (running or not) and cancellation function

#### Defined in

[index.ts:22](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L22)

___

### useTaskMemo

▸ `Const` **useTaskMemo**<`T`\>(`initialValue`, `taskFunction`, `deps`): `T`

Task-based asynchronous memo hook (convinience binding)

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskMemoState

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `T` | initial value available immediately |
| `taskFunction` | () => `Task`<`T`\> | task taskFunction to be invoked to get transformed value |
| `deps` | `DependencyList` | depandency list |

#### Returns

`T`

memorized value

#### Defined in

[index.ts:165](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L165)

___

### useTaskMemoState

▸ `Const` **useTaskMemoState**<`T`\>(`initialValue`, `taskFunction`, `deps`): readonly [`T`, `boolean`, () => `void`]

Task-based asynchronous memo hook

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | resulting task resolve type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialValue` | `T` | initial value available immediately |
| `taskFunction` | `TaskFunction`<[], `T`\> | task taskFunction to be invoked to get transformed value |
| `deps` | `DependencyList` | depandency list |

#### Returns

readonly [`T`, `boolean`, () => `void`]

memorized value, current execution status (running or not) and cancellation function

#### Defined in

[index.ts:98](https://github.com/lammonaaf/t-hooks/blob/6d4c87b/src/index.ts#L98)
