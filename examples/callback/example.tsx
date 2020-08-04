import * as React from 'react';
import { useGeneratorCallbackState } from '../../.';
import { Task } from 't-tasks';

export const Example = () => {
  const [state, setState] = React.useState('Blah');

  const [callback, running, cancel] = useGeneratorCallbackState(
    function*() {
      yield* Task.timeout(2000).generator();

      setState(state + '-Blah');
    },
    [state, setState],
  );

  const callbackWrapper = React.useCallback(() => {
    if (!running) {
      callback();
    }
  }, [callback, running]);

  return (
    <div style={{ fontFamily: 'Arial' }}>
      Press this button to start operation canceling current one (if any)
      <div
        style={{ background: 'gray', padding: 10, margin: 5 }}
        onClick={callback}
      >
        {state} {running && '...'}
      </div>
      Press this button to start operation if none is running at the moment
      <div
        style={{ background: 'gray', padding: 10, margin: 5 }}
        onClick={callbackWrapper}
      >
        {state} {running && '...'}
      </div>
      Press this button to cancel current operation (if any)
      <div
        style={{ background: 'gray', padding: 10, margin: 5 }}
        onClick={cancel}
      >
        Cancel
      </div>
    </div>
  );
};
