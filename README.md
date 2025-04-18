# astro-to-do

## How to run the app & tests

First of all, run 
```
cp .env.example .env &&
npm install &&
npx prisma migrate dev --name init
```
to install the dependencies and generate the initial migration.

### Running with docker compose

To build the app and run it, use the 'build_and_run_with_docker.sh' script, or run the following command manually:
```
sudo docker buildx build -t astro-to-do . && 
sudo docker compose up
```
By default, it will run on port 4422, or http://localhost:4422/

### Running the app locally

To run the app locally, use
```
npm run build &&
node ./dist/server/entry.mjs
```
By default, it will run on port 4321, or http://localhost:4321/

### Running the tests locally

Use
```
npm test
```

## Design & development approach, faced challenges

### Designing & development approach
- First, I started from trying to understand how the actions work, and attempting to call them from both the astro and svelte components. After grasping the concept of actions, I created all of the required basic actions, and moved to the client part of the app.
- I made a component to render individual tasks, and a component to render a list of tasks. After that, I implemented the task viewer / editor, and later, the task filter. I was working on styles and layout at the same time, as I was not certain about the visual part of the client when I started.
- After finishing the main functionality, I rechecked the code to ensure there was no obvious mistakes, and introduced some minor polishing tweaks.
- The finishing touch was adding the docker support and updating the readme.

### Astro's compatibility with other tools and libs
- There is seemingly no way to call the server actions without actually running a server, which results in testing the server logic being troublesome. As mentioned in https://docs.astro.build/en/guides/actions/#security-when-using-actions, the actions are accessible as public endpoints. However, there is no way to access them in tests. There is no supertest-like way to call these endpoints, and wrapping the action calls in astro components doesnt help either. <br/><br/> The approach used to mitigate these issues in the project is simple - the server logic is contained in handlers (`taskHandler` as example), which play the role of controllers / services, while astro's actions are simply used as wraps for them (`taskActions` as example), and are used as routers. This approach isnt perfect, but it makes testing the server logic simple and convenient, as handlers are just plain-js async functions.

- `astro build` seems to be incompatible with the latest approach to the prisma client generation (https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client), as both `src/generated/prisma/client`, suggested in the link, and `node_modules/<directory for the generated client>/` result in the build failing. It is possible to build the app without any issues with the old client generation approach, however, as mentioned in the link, this behavior is deprecated and will no longer be supported in the next major release.

- Installing node as the ssr provider, as described in https://docs.astro.build/en/guides/integrations-guide/node/#manual-install, resulted in the `astro build` failing with a quite generic error - https://docs.astro.build/en/reference/errors/action-not-found-error/. The documentation provides no steps to solve this problem, however, a related issue, https://github.com/withastro/astro/issues/11354, helped to solve this problem.

- My opinion on it: The astro's action are not perfect at the moment, which is to be expected, considering that they have been introduced less than a year ago. Astro's actions are not inherently broken at the concept level, but simply require more time to be perfected.


### Svelte's issues with the libs
- Svelte 5 is severely lacking in terms of the libraries used to solve common problems. <br/> At the moment, there seems to be only one usable library implementing a textarea which automatically adjusts its height based on the contents - https://www.npmjs.com/package/svelte-autosize, which is used in the project. While it works, it still requires some tinkering and manual calls of the autosizing function at certain moments. <br/> For handling swipes, the https://github.com/react2svelte/swipeable is used in the project, which ports the react-swipeable to svelte. However, it still requires manual swipes handling, there is no out-of-the-box way to handle, for example, a right swipe, and the library is barely maintained, if at all.

- My opinion on it: Such problems are to be expected, considering how small the svelte community is, and considering that Svelte 5 became stable only about half a year ago. It introduced some breaking changes to the core features, which, obviously, affected the existing libs.
