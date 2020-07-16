import { Task, TaskType, generateTask, TaskCreator, timeoutTask, cancelledTask } from 't-ask';
import { DependencyList, useState, useEffect, useMemo, useCallback } from 'react';

export function tuple<Args extends any[]>(...args: Args | [Args]): Args {
  if (args.length === 1 && Array.isArray(args[0])) {
    return args[0] as Args;
  } else {
    return args as Args;
  }
}

export const useTaskInterruption = <T>(task: Task<T>, callback: () => void) => {
  return useEffect(() => {
    return () => {
      callback();

      task.cancel();
    }
  }, [task]);
};

export const useTask = <T>(
  creator: TaskCreator<[], T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState<boolean>(false);

  const task = useMemo<Task<T>>(() => {
    return timeoutTask(0).tap(() => {
      setRunning(true);
    }).chain(creator).tap(() => {
      setRunning(false);
    });
  }, [...deps, setRunning]);

  useTaskInterruption(task, () => setRunning(false));

  return useMemo(() => tuple(running, task), [running, task]);
};

export const useGenerator = <TT extends Task<any>, R>(
  generator: () => Generator<TT, R, TaskType<TT>> | AsyncGenerator<TT, R, TaskType<TT>>,
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

  const task = useMemo<Task<T>>(() => {
    return timeoutTask(0).tap(() => {
      setRunning(true);
    }).chain(creator).tap((result) => {
      setState(result);

      setRunning(false);
    });
  }, [...deps, setRunning, setState]);

  useTaskInterruption(task, () => setRunning(false));

  return useMemo(() => tuple(state, running, task), [state, running, task]);
};

export const useTaskMemo = <T>(defaultValue: T, generator: () => Task<T>, deps: DependencyList) => {
  const [state] = useTaskMemoState(defaultValue, generator, deps);

  return state;
};

export const useGeneratorMemoState = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: () => Generator<TT, R, TaskType<TT>> | AsyncGenerator<TT, R, TaskType<TT>>,
  deps: DependencyList,
) => {
  return useTaskMemoState(defaultValue, () => generateTask(generator), deps);
};

export const useGeneratorMemo = <TT extends Task<any>, R>(
  defaultValue: R,
  generator: () => Generator<TT, R, TaskType<TT>> | AsyncGenerator<TT, R, TaskType<TT>>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(defaultValue, generator, deps);

  return state;
};

export const useTaskCallbackState = <A extends any[], T>(
  creator: TaskCreator<A,T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState<boolean>(false);
  const [task, setTask] = useState<Task<T>>(cancelledTask());

  const callback = useCallback((...args: A) => {
    const callbackTask = timeoutTask(0).tap(() => {
      setRunning(true);
    }).chain(() => creator(...args)).tap(() => {
      setRunning(false);
    });

    setTask(callbackTask);

    return callbackTask;
  }, [setTask, setRunning, ...deps]);

  useTaskInterruption(task, () => setRunning(false));

  return useMemo(() => tuple(callback, running, task), [callback, running, task]);
};

export const useTaskCallback = <A extends any[], T>(
  creator: TaskCreator<A,T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(creator, deps);

  return callback;
};

export const useGeneratorCallbackState = <TT extends Task<any>, R, A extends any[]>(
  generator: (...args: A) => Generator<TT, R, TaskType<TT>> | AsyncGenerator<TT, R, TaskType<TT>>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => generateTask(async function* () {
    const result = yield* generator(...args);

    return result;
  }), deps);
};

export const useGeneratorCallback = <TT extends Task<any>, R, A extends any[]>(
  generator: (...args: A) => Generator<TT, R, TaskType<TT>> | AsyncGenerator<TT, R, TaskType<TT>>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(generator, deps);

  return callback;
};
