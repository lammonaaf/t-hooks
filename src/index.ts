import {
  Task,
  generateTask,
  TaskFunction,
  TaskGeneratorFunction,
} from 't-tasks';
import {
  DependencyList,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

function tuple<Args extends any[]>(...args: Args): Args {
  return args as Args;
}

/**
 * Task-invoking hook
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time
 *
 * @template T resulting task resolve type
 * @param taskFunction task taskFunction to be invoked as effect
 * @param deps dependency list
 * @returns current execution status (running or not) and cancellation function
 */
export const useTaskEffect = <T>(
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const taskFunctionMemo = useCallback(taskFunction, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innerTask = taskFunctionMemo()
      .tap(() => {
        setTask((current) => (current === innerTask ? null : current));
      })
      .tapRejected(() => {
        setTask((current) => (current === innerTask ? null : current));
      });

    setTask(innerTask);
  }, [taskFunctionMemo, setTask]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => tuple(running, cancel), [running, cancel]);
};

/**
 * Generator-invoking hook
 *
 * Generator version of task-effect converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 *
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns current execution status (running or not) and cancellation function
 *
 * @see useTaskEffect
 */
export const useGeneratorEffect = <TT extends Task<any>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskEffect(() => generateTask(taskGeneratorFunction), deps);
};

/**
 * Task-based asynchronous memo hook
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 *
 * @template T resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskFunction task taskFunction to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value, current execution status (running or not) and cancellation function
 */
export const useTaskMemoState = <T>(
  initialValue: T,
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const inst = useMemo(() => Math.trunc(Math.random() * 100), []);

  const [state, setState] = useState<T>(initialValue);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innerTask = taskFunctionMemo()
      .tap((result) => {
        setState(result);

        setTask((current) => (current === innerTask ? null : current));
      })
      .tapRejected(() => {
        setTask((current) => (current === innerTask ? null : current));
      });

    setTask(innerTask);
  }, [taskFunctionMemo, setTask, setState, inst]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task, inst]);

  const running = !!task;

  return useMemo(() => tuple(state, running, cancel), [state, running, cancel]);
};

/**
 * Task-based asynchronous memo hook (convinience binding)
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 *
 * @template T resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskFunction task taskFunction to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value
 *
 * @see useTaskMemoState
 */
export const useTaskMemo = <T>(
  initialValue: T,
  taskFunction: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(initialValue, taskFunction, deps);

  return state;
};

/**
 * Generator-based asynchronous memo hook
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 *
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns memorized value, current execution status (running or not) and cancellation function
 *
 * @see useTaskMemoState
 */
export const useGeneratorMemoState = <TT extends Task<any>, R>(
  initialValue: R,
  taskGeneratorFunction: TaskGeneratorFunction<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(
    initialValue,
    () => generateTask(taskGeneratorFunction),
    deps,
  );
};

/**
 * Generator-based asynchronous memo hook (convinience binding)
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 *
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns memorized value
 *
 * @see useGeneratorMemoState
 */
export const useGeneratorMemo = <TT extends Task<any>, R>(
  initialValue: R,
  taskGeneratorFunction: TaskGeneratorFunction<[], TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(
    initialValue,
    taskGeneratorFunction,
    deps,
  );

  return state;
};

/**
 * Task-based asynchronous callback hook
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @template A callback arguments type
 * @template T resulting task resolve type
 * @param taskFunction task taskFunction to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and cancellation function
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallbackState = <A extends any[], T>(
  taskFunction: TaskFunction<A, T>,
  deps: DependencyList,
) => {
  const [task, setTask] = useState<Task<T> | null>(null);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const callback = useCallback(
    (...args: A) => {
      const innerTask = taskFunctionMemo(...args)
        .tap(() => {
          setTask((current) => (current === innerTask ? null : current));
        })
        .tapRejected(() => {
          setTask((current) => (current === innerTask ? null : current));
        });

      setTask(innerTask);

      return innerTask;
    },
    [setTask, taskFunctionMemo],
  );

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => tuple(callback, running, cancel), [
    callback,
    running,
    cancel,
  ]);
};

/**
 * Task-based asynchronous callback hook (convinience binding)
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @template A callback arguments type
 * @template T resulting task resolve type
 * @param taskFunction task taskFunction to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallback = <A extends any[], T>(
  taskFunction: TaskFunction<A, T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(taskFunction, deps);

  return callback;
};

/**
 * Generator-based asynchronous callback hook
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @template A callback arguments type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and cancellation function
 *
 * @see useTaskCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallbackState = <
  A extends any[],
  TT extends Task<any>,
  R
>(
  taskGeneratorFunction: TaskGeneratorFunction<A, TT, R>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => {
    return generateTask(function*() {
      return yield* taskGeneratorFunction(...args);
    });
  }, deps);
};

/**
 * Generator-based asynchronous callback hook (convinience binding)
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @template A callback arguments type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallback = <A extends any[], TT extends Task<any>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<A, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(taskGeneratorFunction, deps);

  return callback;
};
