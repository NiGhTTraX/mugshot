# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@1.0.0...@mugshot/playwright@1.0.1) (2020-09-07)

**Note:** Version bump only for package @mugshot/playwright





# [1.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@0.1.0...@mugshot/playwright@1.0.0) (2020-09-05)


### Features

* **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
* **playwright:** Implement the new `Webdriver` interface ([cb39f53](https://github.com/NiGhTTraX/mugshot/commit/cb39f53))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* **contracts:** ideally there should be no breaking changes, but the
new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.
* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.
* **playwright:** this will bump the min required version of Mugshot.





## [0.2.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@0.2.0...@mugshot/playwright@0.2.1) (2020-09-05)

**Note:** Version bump only for package @mugshot/playwright





# [0.2.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@0.1.0...@mugshot/playwright@0.2.0) (2020-09-05)


### Features

* **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
* **playwright:** Implement the new `Webdriver` interface ([cb39f53](https://github.com/NiGhTTraX/mugshot/commit/cb39f53))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* **contracts:** ideally there should be no breaking changes, but the
new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.
* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.
* **playwright:** this will bump the min required version of Mugshot.





# 0.1.0 (2020-08-30)


### Features

* **playwright:** Add adapter for Playwright ([429a78b](https://github.com/NiGhTTraX/mugshot/commit/429a78b))
