import {
  Task,
  generateTask,
  TaskCreator,
  timeoutTask,
  canceledTask,
  TaskGenerator,
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

const useTaskInterruption = <T>(
  task: Task<T>,
  callback: () => void,
  deps: DependencyList,
) => {
  const callbackMemo = useCallback(callback, deps);

  return useEffect(() => {
    return () => {
      callbackMemo();

      task.cancel();
    };
  }, [task, callbackMemo]);
};

/**
 * Task-invoking hook
 * @param creator task creator to be invoked as effect
 * @param deps dependency list
 * @returns current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time
 */
export const useTask = <T>(
  creator: TaskCreator<[], T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState<boolean>(false);

  const creatorMemo = useCallback(creator, deps);

  const task = useMemo<Task<T>>(() => {
    return timeoutTask(0)
      .tap(() => {
        setRunning(true);
      })
      .chain(creatorMemo)
      .tap(() => {
        setRunning(false);
      })
      .tapRejected(() => {
        setRunning(false);
      });
  }, [creatorMemo, setRunning]);

  useTaskInterruption(task, () => setRunning(false), [setRunning]);

  return useMemo(() => tuple(running, task), [running, task]);
};

/**
 * Generator-invoking hook
 * @param generator task generator function
 * @param deps dependency list
 * @returns current execution status (running or not) and executed task to be spied on
 *
 * @see useTask
 *
 * Generator version of task-effect converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGenerator = <TT extends Task<any>, R>(
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTask(() => generateTask(generator), deps);
};

/**
 * Task-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param creator task creator to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value, current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskMemoState = <T>(
  defaultValue: T,
  creator: TaskCreator<[], T>,
  deps: DependencyList,
) => {
  const [state, setState] = useState<T>(defaultValue);

  const [running, setRunning] = useState<boolean>(false);

  const creatorMemo = useCallback(creator, deps);

  const task = useMemo<Task<T>>(() => {
    return timeoutTask(0)
      .tap(() => {
        setRunning(true);
      })
      .chain(creatorMemo)
      .tap((result) => {
        setState(result);

        setRunning(false);
      })
      .tapRejected(() => {
        setRunning(false);
      });
  }, [creatorMemo, setRunning, setState]);

  useTaskInterruption(task, () => setRunning(false), [setRunning]);

  return useMemo(() => tuple(state, running, task), [state, running, task]);
};

/**
 * Task-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param creator task creator to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value
 *
 * @see useTaskMemoState
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskMemo = <T>(
  defaultValue: T,
  creator: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(defaultValue, creator, deps);

  return state;
};

/**
 * Generator-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param generator task generator function
 * @param deps dependency list
 * @returns memorized value, current execution status (running or not) and executed task to be spied on
 *
 * @see useTaskMemoState
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGeneratorMemoState = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(defaultValue, () => generateTask(generator), deps);
};

/**
 * Generator-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param generator task generator function
 * @param deps dependency list
 * @returns memorized value
 *
 * @see useGeneratorMemoState
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGeneratorMemo = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(defaultValue, generator, deps);

  return state;
};

/**
 * Task-based asynchronous callback hook
 * @param creator task creator to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallbackState = <A extends any[], T>(
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState<boolean>(false);
  const [task, setTask] = useState<Task<T>>(canceledTask());

  const creatorMemo = useCallback(creator, deps);

  const callback = useCallback(
    (...args: A) => {
      const callbackTask = timeoutTask(0)
        .tap(() => {
          setRunning(true);
        })
        .chain(() => creatorMemo(...args))
        .tap(() => {
          setRunning(false);
        })
        .tapRejected(() => {
          setRunning(false);
        });

      setTask(callbackTask);

      return callbackTask;
    },
    [setTask, setRunning, creatorMemo],
  );

  useTaskInterruption(task, () => setRunning(false), [setRunning]);

  return useMemo(() => tuple(callback, running, task), [
    callback,
    running,
    task,
  ]);
};

/**
 * Task-based asynchronous callback hook (convinience binding)
 * @param creator task creator to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallback = <A extends any[], T>(
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(creator, deps);

  return callback;
};

/**
 * Generator-based asynchronous callback hook
 * @param generator task generator function
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and executed task to be spied on
 *
 * @see useTaskCallbackState
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallbackState = <
  TT extends Task<any>,
  R,
  A extends any[]
>(
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => {
    return generateTask(function*() {
      const result = yield* generator(...args);

      return result;
    });
  }, deps);
};

/**
 * Generator-based asynchronous callback hook (convinience binding)
 * @param generator task generator function
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallback = <TT extends Task<any>, R, A extends any[]>(
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(generator, deps);

  return callback;
};
