# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@4.0.1...@mugshot/contracts@4.0.2) (2022-11-04)

### Bug Fixes

- **deps:** update dependency typescript to ~4.8.0 ([5360346](https://github.com/NiGhTTraX/mugshot/commit/5360346a2d4d988afe5f55ef789dfb037940dfae))

## [4.0.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@4.0.0...@mugshot/contracts@4.0.1) (2022-07-17)

### Bug Fixes

- **deps:** update dependency @types/chai to ~4.3.0 ([172ca10](https://github.com/NiGhTTraX/mugshot/commit/172ca108b4c75588cc41201b694bc1d98b55641c))
- **deps:** update dependency fs-extra to ~10.1.0 ([68b4979](https://github.com/NiGhTTraX/mugshot/commit/68b4979c369af698dc0888453cab95881b2ffcf1))
- **deps:** update dependency fs-extra to v10 ([f039fb6](https://github.com/NiGhTTraX/mugshot/commit/f039fb67d523fcbc879a3e68e3434d2270b88bcf))

# [4.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.1.2...@mugshot/contracts@4.0.0) (2021-04-24)

### Bug Fixes

- **deps:** update dependency chai to ~4.3.0 ([e50af21](https://github.com/NiGhTTraX/mugshot/commit/e50af2144ae45172af5f12eb378f4705e11c42fe))
- **deps:** update dependency fs-extra to ~9.1.0 ([c24e935](https://github.com/NiGhTTraX/mugshot/commit/c24e93512c51d810426f9cb6e60ec8d9b50c9d3f))

### Code Refactoring

- Rename interface method ([48b6ccc](https://github.com/NiGhTTraX/mugshot/commit/48b6ccc0c2dc086290283f870895b8d6a0e169b7))

### BREAKING CHANGES

- The `takeScreenshot` method on the `Webdriver`
  interface has been renamed to `takeViewportScreenshot` to better reflect
  its usage.

## [3.1.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.1.1...@mugshot/contracts@3.1.2) (2020-12-29)

**Note:** Version bump only for package @mugshot/contracts

## [3.1.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.1.0...@mugshot/contracts@3.1.1) (2020-09-09)

**Note:** Version bump only for package @mugshot/contracts

# [3.1.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0...@mugshot/contracts@3.1.0) (2020-09-07)

### Features

- **contracts:** Move test helper here and export it ([a598687](https://github.com/NiGhTTraX/mugshot/commit/a598687))

# [3.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.1...@mugshot/contracts@3.0.0) (2020-09-05)

### Features

- **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
- **contracts:** Update tests for new `Webdriver` interface ([61269be](https://github.com/NiGhTTraX/mugshot/commit/61269be))

### Tests

- Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))

### BREAKING CHANGES

- **contracts:** ideally there should be no breaking changes, but the
  new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.

- there should be no changes on the `Webdriver` contract
  tests, but if you were using `loadFixture` to set up screenshot tests
  then those will most likely fail after this.

# [3.0.0-alpha.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.2...@mugshot/contracts@3.0.0-alpha.3) (2020-09-05)

**Note:** Version bump only for package @mugshot/contracts

# [3.0.0-alpha.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.1...@mugshot/contracts@3.0.0-alpha.2) (2020-09-05)

### Features

- **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
- **contracts:** Update tests for new `Webdriver` interface ([61269be](https://github.com/NiGhTTraX/mugshot/commit/61269be))

### Tests

- Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))

### BREAKING CHANGES

- **contracts:** ideally there should be no breaking changes, but the
  new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.

- there should be no changes on the `Webdriver` contract
  tests, but if you were using `loadFixture` to set up screenshot tests
  then those will most likely fail after this.

# [3.0.0-alpha.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.0...@mugshot/contracts@3.0.0-alpha.1) (2020-08-30)

### Bug Fixes

- **deps:** update dependency jimp to ~0.10.0 ([27082ef](https://github.com/NiGhTTraX/mugshot/commit/27082ef))
- **deps:** update dependency jimp to ~0.12.0 ([0476077](https://github.com/NiGhTTraX/mugshot/commit/0476077))
- **deps:** update dependency jimp to ~0.13.0 ([e595da0](https://github.com/NiGhTTraX/mugshot/commit/e595da0))
- **deps:** update dependency jimp to ~0.14.0 ([03f5d08](https://github.com/NiGhTTraX/mugshot/commit/03f5d08))
- **deps:** update dependency jimp to ~0.15.0 ([6c83b36](https://github.com/NiGhTTraX/mugshot/commit/6c83b36))
- **deps:** update dependency jimp to ~0.16.0 ([726d036](https://github.com/NiGhTTraX/mugshot/commit/726d036))
- **deps:** update dependency jimp to ~0.9.0 ([46f8c99](https://github.com/NiGhTTraX/mugshot/commit/46f8c99))
