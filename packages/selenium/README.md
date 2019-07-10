> Docker scripts to start a Selenium grid

----

## Requirements

- Docker
- docker-compose


## Usage

Spin up a Selenium server listening at `0.0.0.0:4444` and 2*N browser nodes (N Chrome and N Firefox) that connect to it:

```sh
npx @mugshot/selenium start [N=1]
```

Spin up a Selenium server listening at `0.0.0.0:4444` and 2 debug nodes (Chrome and Firefox) that have VNC listening at `0.0.0.0:5900` and `0.0.0.0:5901`:

```sh
npx @mugshot/selenium debug
```

Stop everything:

```sh
npx @mugshot/selenium stop
```

