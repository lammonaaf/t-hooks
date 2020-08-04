![CI](https://github.com/lammonaaf/t-hooks/workflows/CI/badge.svg)

# T-Hooks task-based React hook library

T-Hooks provides a set of react hooks built upon T-Tasks library. Using task hooks instead of conventional lifecycle hooks alows easier usage of asynchronous operations withing hooks and provides automatic operation cancelation in case of hook unmounting or re-render.

### Task-based useEffect

In this scenario, every time ```arg``` updates an asynchronous operation is started, resulting in a side effect. If hook is unmonted before the operation finishes no side effect is performed, preventing modification of state of unmounted component. Moreover, if ```arg``` changes before the operation finishes another operation in started instead, canceling the previous one.

```tsx
const taskCreator = (arg: string) => Task.fromPromise(someAsyncOperation(arg)).tap((result) => {
  setSomething(result); // side effects
});

useTaskEffect(() => taskCreator(arg), [arg]);
```

### Generator-based useEffect

In this scenario a generator syntax is used to achieve the same result. Generator syntax allows for more natural task chaining via ```yield``` syntax. Note that despite the fact that a task may be yielded directly as ```yield someTask``` the result of such expression may be unknown in case of multiple yield statements, so using ```yield* someTask.generator()``` is recommended.

```tsx
useGeneratorEffect(function*() {
  const result = yield* Task.fromPromise(someAsyncOperation(arg)).generator();

  setSomething(result); // side effects
}, [arg]);
```

### Chaining multiple effects

In this scenario generator syntax is used to chain two consequtive async operations with two side-effects. In case of unmounting or re-render during execution of the first operation, the second one would not be started and both side effects would not be performed. In case of unmounting or re-render during execution of the second operation, only the second side-effect would be prevented. 

```tsx
useGeneratorEffect(function*() {
  const result = yield* Task.fromPromise(someAsyncOperation(arg)).generator();

  setSomething(result1); // side effect 1

  const result2 = yield* Task.fromPromise(otherAsyncOperation(resilt1)).generator();

  setSomethingElse(result2); // side effect 2
}, [arg]);
```

### Task-based useMemo

In this scenario, every time ```arg``` updates an asynchronous operation is started, updating ```userData``` asynchronously. In case of hook unmounting or updating ```arg``` again before the previous operation finishes, another operation in started instead, canceling the previous one.

```tsx
const userData = useTaskMemo(null, () => Task.fromPromise(getUserDataAsync(userId)), [userId]);
```

### Generator-based useMemo

In this scenario a generator syntax is used to achieve the same result. Generator syntax allows for more natural task chaining via ```yield``` syntax. Note that despite the fact that a task may be yielded directly as ```yield someTask``` the result of such expression may be unknown in case of multiple yield statements, so using ```yield* someTask.generator()``` is recommended.

```tsx
const userData = useGeneratorMemo(null, function*() {
  return yield* Task.fromPromise(getUserDataAsync(userId)).generator();
}, [userId]);
```

### Chaining multiple transformations

In this scenario a generator syntax is used to chain two consequtive async operations in a single task memo.

```tsx
const usageStats = useGeneratorMemo(null, function*() {
  const userData = yield* Task.fromPromise(getUserDataAsync(userId)).generator();

  yield* timeoutTask(100).generator(); // one may add delays easily

  return yield* Task.fromPromise(getUsageStats(userData)).generator();
}, [userId]);
```

### Task-based useCallback

In this scenario an asynchrounous callback is created, performing side-effects only if the hook is not unmounted. Callback is also interrupted if invoked again

```tsx
const taskCreator = (userId: string) => liftResult(getUserDataAsync(arg)).tap((userData) => {
  setUserData(userData); // side effects
});

const onClick = useTaskCallback(() => taskCreator(userId)), [userId]);

return <button onClick={onClick}>Click me</button>
```

### Generator-based useCallback

In this scenario an asynchrounous callback is created via generator syntax

```tsx
const onClick = useGeneratorCallback(function*() {
  const userData = yield* Task.fromPromise(getUserDataAsync(userId)).generator();

  yield* timeoutTask(100).generator(); // one may add delays easily

  setUserData(userData); // side-effects
}), [userId]);

return <button onClick={onClick}>Click me</button>
```
