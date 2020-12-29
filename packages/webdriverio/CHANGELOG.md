# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.2...@mugshot/webdriverio@2.0.3) (2020-12-29)

**Note:** Version bump only for package @mugshot/webdriverio





## [2.0.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.1...@mugshot/webdriverio@2.0.2) (2020-09-09)

**Note:** Version bump only for package @mugshot/webdriverio





## [2.0.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0...@mugshot/webdriverio@2.0.1) (2020-09-07)

**Note:** Version bump only for package @mugshot/webdriverio





# [2.0.0](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.1...@mugshot/webdriverio@2.0.0) (2020-09-05)


### deps

* **webdriverio:** Upgrade to webdriverio@6 ([f279ffc](https://github.com/NiGhTTraX/mugshot/commit/f279ffc))


### Features

* **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
* **webdriverio:** Implement the new `Webdriver` interface ([0340439](https://github.com/NiGhTTraX/mugshot/commit/0340439))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* **webdriverio:** drops support for webdriver<6.
* **contracts:** ideally there should be no breaking changes, but the
new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.
* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.
* **webdriverio:** this will bump the min required version of Mugshot.





# [2.0.0-alpha.3](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.2...@mugshot/webdriverio@2.0.0-alpha.3) (2020-09-05)

**Note:** Version bump only for package @mugshot/webdriverio





# [2.0.0-alpha.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.1...@mugshot/webdriverio@2.0.0-alpha.2) (2020-09-05)


### deps

* **webdriverio:** Upgrade to webdriverio@6 ([f279ffc](https://github.com/NiGhTTraX/mugshot/commit/f279ffc))


### Features

* **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
* **webdriverio:** Implement the new `Webdriver` interface ([0340439](https://github.com/NiGhTTraX/mugshot/commit/0340439))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* **webdriverio:** drops support for webdriver<6.
* **contracts:** ideally there should be no breaking changes, but the
new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.
* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.
* **webdriverio:** this will bump the min required version of Mugshot.





# [2.0.0-alpha.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/webdriverio@2.0.0-alpha.0...@mugshot/webdriverio@2.0.0-alpha.1) (2020-08-30)

**Note:** Version bump only for package @mugshot/webdriverio
