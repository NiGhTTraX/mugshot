# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@3.0.1...@mugshot/webdriverio@3.0.2) (2022-11-04)

### Bug Fixes

- **deps:** update dependency typescript to ~4.8.0 ([5360346](https://github.com/NiGhTTraX/mugshot/commit/5360346a2d4d988afe5f55ef789dfb037940dfae))

## [3.0.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@3.0.0...@mugshot/webdriverio@3.0.1) (2022-07-17)

**Note:** Version bump only for package @mugshot/webdriverio

# [3.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.3...@mugshot/webdriverio@3.0.0) (2021-04-24)

### Code Refactoring

- Rename interface method ([48b6ccc](https://github.com/NiGhTTraX/mugshot/commit/48b6ccc0c2dc086290283f870895b8d6a0e169b7))
- Use named exports ([d70775f](https://github.com/NiGhTTraX/mugshot/commit/d70775f4f04f4faf92ccb3c4b6608ee734562e91))

### Features

- **mugshot:** Add basic constructor ([a482f74](https://github.com/NiGhTTraX/mugshot/commit/a482f743a9a18eac8bf120343e2bad1ff1fd9913))
- **webdriverio:** Support webdriverio@7 ([b0d2dbf](https://github.com/NiGhTTraX/mugshot/commit/b0d2dbf86044a78dbed06d8c84685ba056c598b3))

### BREAKING CHANGES

- The `takeScreenshot` method on the `Webdriver`
  interface has been renamed to `takeViewportScreenshot` to better reflect
  its usage.
- Default exports are no more and everything is a named
  export now. This improves the generated docs and should also help with
  IDE autocomplete.
- **webdriverio:** This will not work with webdriverio@6 anymore.

## [2.0.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.2...@mugshot/webdriverio@2.0.3) (2020-12-29)

**Note:** Version bump only for package @mugshot/webdriverio

## [2.0.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.1...@mugshot/webdriverio@2.0.2) (2020-09-09)

**Note:** Version bump only for package @mugshot/webdriverio

## [2.0.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0...@mugshot/webdriverio@2.0.1) (2020-09-07)

**Note:** Version bump only for package @mugshot/webdriverio

# [2.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.1...@mugshot/webdriverio@2.0.0) (2020-09-05)

### deps

- **webdriverio:** Upgrade to webdriverio@6 ([f279ffc](https://github.com/NiGhTTraX/mugshot/commit/f279ffc))

### Features

- **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
- **webdriverio:** Implement the new `Webdriver` interface ([0340439](https://github.com/NiGhTTraX/mugshot/commit/0340439))

### Tests

- Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))

### BREAKING CHANGES

- **webdriverio:** drops support for webdriver<6.
- **contracts:** ideally there should be no breaking changes, but the
  new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.

- there should be no changes on the `Webdriver` contract
  tests, but if you were using `loadFixture` to set up screenshot tests
  then those will most likely fail after this.
- **webdriverio:** this will bump the min required version of Mugshot.

# [2.0.0-alpha.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.2...@mugshot/webdriverio@2.0.0-alpha.3) (2020-09-05)

**Note:** Version bump only for package @mugshot/webdriverio

# [2.0.0-alpha.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.1...@mugshot/webdriverio@2.0.0-alpha.2) (2020-09-05)

### deps

- **webdriverio:** Upgrade to webdriverio@6 ([f279ffc](https://github.com/NiGhTTraX/mugshot/commit/f279ffc))

### Features

- **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
- **webdriverio:** Implement the new `Webdriver` interface ([0340439](https://github.com/NiGhTTraX/mugshot/commit/0340439))

### Tests

- Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))

### BREAKING CHANGES

- **webdriverio:** drops support for webdriver<6.
- **contracts:** ideally there should be no breaking changes, but the
  new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.

- there should be no changes on the `Webdriver` contract
  tests, but if you were using `loadFixture` to set up screenshot tests
  then those will most likely fail after this.
- **webdriverio:** this will bump the min required version of Mugshot.

# [2.0.0-alpha.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.0...@mugshot/webdriverio@2.0.0-alpha.1) (2020-08-30)

**Note:** Version bump only for package @mugshot/webdriverio
