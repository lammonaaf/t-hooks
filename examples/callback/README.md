# Task callback T-Hooks usage example

This example illustrates using task callback hook to achieve a asynchrounous one-operation-at-a-time behavior in two different ways: interrupting previous operation (first option) and preventing new operations while the current one is running (second case). Either way there's also an option to interrupt the current operation (third option).

Also, the operation would also be interrupted in case of component unmounting (not demonstrated here);