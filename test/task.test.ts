import { renderHook, act } from '@testing-library/react-hooks';
import {
  useGenerator,
  useGeneratorCallbackState,
  useGeneratorCallback,
  useTaskCallback,
  useGeneratorMemoState,
  useGeneratorMemo,
  useTaskMemo,
} from '../src';
import {
  timeoutTask,
  castResult,
  isJust,
  isRight,
  isNothing,
  Maybe,
  Either,
  generateTask,
  isLeft,
} from 't-ask';
import { useState } from 'react';

describe('useTask', () => {
  const useTestCase = (key: string | null) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [running] = useGenerator(
      function*() {
        if (key) {
          setState('start');

          castResult<void>(yield timeoutTask(1000));

          if (key === 'throw') {
            throw new Error('Thrown');
          }

          setState('end');
        }
      },
      [key, setState],
    );

    return { state, running };
  };

  it('scenario1', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: 'true' as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario1.1', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: 'throw' as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario2', async () => {
    const { result, rerender, wait } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario3', async () => {
    const { result, rerender, wait } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      rerender('true');
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      rerender(null);
    });

    await wait(
      () => {
        return result.current.running === false;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(false);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario4', async () => {
    const { result, wait, rerender } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      rerender('true');
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      rerender('thru');
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario5', async () => {
    const { result, wait, rerender, unmount } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      rerender('true');
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);
  });
});

describe('useGeneratorCallbackState', () => {
  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [callback, running] = useGeneratorCallbackState(
      function*(prefix: string) {
        setState('start');

        castResult<void>(yield timeoutTask(1000));

        if (prefix === 'throw') {
          throw new Error('Provoked');
        }

        setState('end');

        return prefix + data;
      },
      [setState, data],
    );

    return { state, callback, running };
  };

  it('scenario1', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      result.current.callback('hello');
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario1.1', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    await act(async () => {
      const r = await result.current.callback('throw').resolve();

      expect(isJust(r)).toBeTruthy();
      expect(isJust(r) && isLeft(r.just)).toBeTruthy();
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    await act(async () => {
      const r = await result.current.callback('hello').resolve();

      expect(isJust(r)).toBeTruthy();
      expect(isJust(r) && isRight(r.just)).toBeTruthy();
      expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
        'hello world',
      );
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);
  });

  it('scenario3', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    expect(callback).toBeCalledTimes(1);
  });

  it('scenario4', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn((_: Maybe<Either<string, any>>) => {});
    const callback2 = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback1(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      result.current
        .callback('goodbye')
        .resolve()
        .then((r) => {
          callback2(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'goodbye world',
          );
        });
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  it('scenario5', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'hello world',
          );
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      rerender(' me');
    });

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);

    expect(callback).toBeCalledTimes(1);
  });

  it('scenario6', async () => {
    const { result, wait, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn((_: Maybe<Either<string, any>>) => {});
    const callback2 = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');
    expect(result.current.running).toStrictEqual(false);

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback1(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 250));
    });

    act(() => {
      rerender(' me');
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 250));
    });

    act(() => {
      result.current
        .callback('goodbye')
        .resolve()
        .then((r) => {
          callback2(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'goodbye me',
          );
        });
    });

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');
    expect(result.current.running).toStrictEqual(true);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(result.current.state).toStrictEqual('end');
    expect(result.current.running).toStrictEqual(false);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });
});

describe('useGeneratorCallback', () => {
  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const callback = useGeneratorCallback(
      function*(prefix: string) {
        setState('start');

        castResult<void>(yield timeoutTask(1000));

        setState('end');

        return prefix + data;
      },
      [setState, data],
    );

    return { state, callback };
  };

  it('scenario1', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current.callback('hello');
    });

    await wait(
      () => {
        return result.current.state === 'start';
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(result.current.state).toStrictEqual('end');
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    expect(result.current.state).toStrictEqual('none');

    await act(async () => {
      const r = await result.current.callback('hello').resolve();

      expect(isJust(r)).toBeTruthy();
      expect(isJust(r) && isRight(r.just)).toBeTruthy();
      expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
        'hello world',
      );
    });

    expect(result.current.state).toStrictEqual('end');
  });

  it('scenario3', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(result.current.state).toStrictEqual('start');

    expect(callback).toBeCalledTimes(1);
  });

  it('scenario4', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn((_: Maybe<Either<string, any>>) => {});
    const callback2 = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback1(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      result.current
        .callback('goodbye')
        .resolve()
        .then((r) => {
          callback2(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'goodbye world',
          );
        });
    });

    await wait(
      () => {
        return result.current.state === 'start';
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(result.current.state).toStrictEqual('end');

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  it('scenario5', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'hello world',
          );
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    act(() => {
      rerender(' me');
    });

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.state).toStrictEqual('end');

    expect(callback).toBeCalledTimes(1);
  });

  it('scenario6', async () => {
    const { result, wait, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn((_: Maybe<Either<string, any>>) => {});
    const callback2 = jest.fn((_: Maybe<Either<string, any>>) => {});

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current
        .callback('hello')
        .resolve()
        .then((r) => {
          callback1(r);
          expect(isNothing(r)).toBeTruthy();
        });
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 250));
    });

    act(() => {
      rerender(' me');
    });

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 250));
    });

    act(() => {
      result.current
        .callback('goodbye')
        .resolve()
        .then((r) => {
          callback2(r);
          expect(isJust(r)).toBeTruthy();
          expect(isJust(r) && isRight(r.just)).toBeTruthy();
          expect(isJust(r) && isRight(r.just) ? r.just.right : '').toEqual(
            'goodbye me',
          );
        });
    });

    await wait(
      () => {
        return result.current.state === 'start';
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.state).toStrictEqual('end');

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });
});

describe('useTaskCallback', () => {
  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const callback = useTaskCallback(
      (prefix: string) =>
        generateTask(function*() {
          setState('start');

          castResult<void>(yield timeoutTask(1000));

          setState('end');

          return prefix + data;
        }),
      [setState, data],
    );

    return { state, callback };
  };

  it('scenario1', async () => {
    const { result, wait } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    expect(result.current.state).toStrictEqual('none');

    act(() => {
      result.current.callback('hello');
    });

    await wait(
      () => {
        return result.current.state === 'start';
      },
      { timeout: 100 },
    );

    expect(result.current.state).toStrictEqual('start');

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.state).toStrictEqual('end');
  });
});

describe('useGeneratorMemoState', () => {
  const useTestCase = (data: string) => {
    const [length, running] = useGeneratorMemoState(
      0,
      function*() {
        castResult<void>(yield timeoutTask(1000));

        if (data === 'throw') {
          throw new Error('Provoked');
        }

        return data.length;
      },
      [data],
    );

    return { length, running };
  };

  it('scenario1', async () => {
    const { result, wait } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario1.1', async () => {
    const { result, wait } = renderHook(useTestCase, { initialProps: 'throw' });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario2', async () => {
    const { result, wait, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('myaa');
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(4);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario3', async () => {
    const { result, wait, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    act(() => {
      rerender('myaa');
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await wait(
      () => {
        return result.current.running === true;
      },
      { timeout: 100 },
    );

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(4);
    expect(result.current.running).toBeFalsy();
  });
});

describe('useGeneratorMemo', () => {
  const useTestCase = (data: string) => {
    const length = useGeneratorMemo(
      0,
      function*() {
        castResult<void>(yield timeoutTask(1000));

        return data.length;
      },
      [data],
    );

    return { length };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(5);
  });
});

describe('useTaskMemo', () => {
  const useTestCase = (data: string) => {
    const length = useTaskMemo(
      0,
      () =>
        generateTask(function*() {
          castResult<void>(yield timeoutTask(1000));

          return data.length;
        }),
      [data],
    );

    return { length };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);

    await act(() => {
      return new Promise((resolve) => setTimeout(resolve, 1100));
    });

    expect(result.current.length).toBe(5);
  });
});
