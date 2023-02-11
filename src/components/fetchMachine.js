import { assign, createMachine } from "xstate";

export default createMachine(
  {
    predictableActionArguments: true, //https://xstate.js.org/docs/guides/actions.html
    id: "loginFetch",
    initial: "loading",
    context: {
      path: import.meta.env.VITE_APP_BOOK_SERVER + "/api/v1/users/unique",
      method: "POST",
      token: "",
      results: "FOO",
      retryCount: 0,
    },
    states: {
      loading: {
        invoke: {
          src: "fetchData",
          onDone: { target: "success", actions: "handleData" },
          onError: { target: "failure" },
        },
      },
      success: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "success",
        }),
      },
      failure: {
        on: {
          always: [
            {
              target: "awaitingRetry",
              actions: "incRetry",
              cond: "withinLimit",
            },
            { target: "terminated" },
          ],
        },
      },
      awaitingRetry: {
        after: {
          FETCH_DELAY: "loading",
        },
      },
      terminated: {
        type: "final",
        data: (context, event) => ({
          results: context.results,
          result: "terminated",
        }),
      },
    },
  },
  {
    services: {
      fetchData: (_context, event) =>
        fetch(_context.path, {
          method: _context.method,
          headers: {
            Authorization: _context.token,
          },
        }).then((res) => res.json()),
    },
    guards: {
      withinLimit: (context) => context.retryCount < 5,
    },
    actions: {
      handleData: assign({ results: (_, event) => event.data }),
      incRetry: assign({ retryCount: (context) => context.retryCount + 1 }),
    },
    delays: {
      FETCH_DELAY: (context, event) => Math.pow(2.0, context.retryCount) * 500,
    },
  }
);
