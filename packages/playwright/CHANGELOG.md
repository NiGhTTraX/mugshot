# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@1.0.3...@mugshot/playwright@2.0.0) (2021-04-24)


### Code Refactoring

* Rename interface method ([48b6ccc](https://github.com/NiGhTTraX/mugshot/commit/48b6ccc0c2dc086290283f870895b8d6a0e169b7))
* Use named exports ([d70775f](https://github.com/NiGhTTraX/mugshot/commit/d70775f4f04f4faf92ccb3c4b6608ee734562e91))


### Features

* **mugshot:** Add basic constructor ([a482f74](https://github.com/NiGhTTraX/mugshot/commit/a482f743a9a18eac8bf120343e2bad1ff1fd9913))


### BREAKING CHANGES

* The `takeScreenshot` method on the `Webdriver`
interface has been renamed to `takeViewportScreenshot` to better reflect
its usage.
* Default exports are no more and everything is a named
export now. This improves the generated docs and should also help with
IDE autocomplete.





## [1.0.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@1.0.2...@mugshot/playwright@1.0.3) (2020-12-29)

**Note:** Version bump only for package @mugshot/playwright





## [1.0.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/playwright@1.0.1...@mugshot/playwright@1.0.2) (2020-09-09)

**Note:** Version bump only for package @mugshot/playwright





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
