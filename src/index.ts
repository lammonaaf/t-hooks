import {
  Task,
  generateTask,
  TaskCreator,
  timeoutTask,
  cancelledTask,
  TaskGenerator,
} from '@lammonaaf/t-ask';
import {
  DependencyList,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

export function tuple<Args extends any[]>(...args: Args): Args {
  return args as Args;
}

export const useTaskInterruption = <T>(
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
 * @returns memorized state, containing current execution stats and executed task to be spied on
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting
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

export const useGenerator = <TT extends Task<any>, R>(
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTask(() => generateTask(generator), deps);
};

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

export const useTaskMemo = <T>(
  defaultValue: T,
  generator: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(defaultValue, generator, deps);

  return state;
};

export const useGeneratorMemoState = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(defaultValue, () => generateTask(generator), deps);
};

export const useGeneratorMemo = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(defaultValue, generator, deps);

  return state;
};

export const useTaskCallbackState = <A extends any[], T>(
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState<boolean>(false);
  const [task, setTask] = useState<Task<T>>(cancelledTask());

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

export const useTaskCallback = <A extends any[], T>(
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(creator, deps);

  return callback;
};

export const useGeneratorCallbackState = <
  TT extends Task<any>,
  R,
  A extends any[]
>(
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => {
    return generateTask(async function*() {
      const result = yield* generator(...args);

      return result;
    });
  }, deps);
};

export const useGeneratorCallback = <TT extends Task<any>, R, A extends any[]>(
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(generator, deps);

  return callback;
};
