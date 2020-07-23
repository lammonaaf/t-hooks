# Task memo T-Hooks usage example

This example illustrates using task memo hook to achieve useMemo-like behaviour with asynchronous operation. The hook also ensures that pending operation would be interrupted in case of dependencies update (hook re-render).

Also, the operation would also be interrupted in case of component unmounting (not demonstrated here);